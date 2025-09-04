// js/github.js
export const GITHUB_CONFIG = {
    owner: 'bireggbaum-beep',
    repo: 'rpg',
    path: 'creatures.json',
    branch: 'main'
};

export class GitHubAPI {
    constructor() {
        this.token = localStorage.getItem('github_pat_token');
    }

    setToken(token) {
        this.token = token;
        localStorage.setItem('github_pat_token', token);
    }

    hasToken() {
        return !!this.token;
    }

    clearToken() {
        this.token = null;
        localStorage.removeItem('github_pat_token');
    }

    async getFile() {
        const url = `https://api.github.com/repos/${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}/contents/${GITHUB_CONFIG.path}?ref=${GITHUB_CONFIG.branch}`;
        
        try {
            const response = await fetch(url, {
                headers: {
                    'Accept': 'application/vnd.github.v3+json',
                    ...(this.token && { 'Authorization': `token ${this.token}` })
                }
            });

            if (!response.ok) {
                if (response.status === 404) {
                    return null;
                }
                throw new Error(`GitHub API Fehler: ${response.status}`);
            }

            const data = await response.json();
            const content = atob(data.content);
            return {
                content: JSON.parse(content),
                sha: data.sha
            };
        } catch (error) {
            console.error('Fehler beim Abrufen der Datei:', error);
            throw error;
        }
    }

    async updateFile(content, message, sha = null) {
        if (!this.token) {
            throw new Error('Kein GitHub PAT Token vorhanden');
        }

        const url = `https://api.github.com/repos/${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}/contents/${GITHUB_CONFIG.path}`;
        
        const body = {
            message: message || `Update creatures.json - ${new Date().toLocaleString('de-DE')}`,
            content: btoa(JSON.stringify(content, null, 2)),
            branch: GITHUB_CONFIG.branch
        };

        if (sha) {
            body.sha = sha;
        }

        try {
            const response = await fetch(url, {
                method: 'PUT',
                headers: {
                    'Accept': 'application/vnd.github.v3+json',
                    'Authorization': `token ${this.token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`GitHub API Fehler: ${errorData.message || response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Fehler beim Aktualisieren der Datei:', error);
            throw error;
        }
    }
}
