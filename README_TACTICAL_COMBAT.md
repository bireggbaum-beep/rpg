# Tactical Combat - Final Fantasy meets 4 Against Darkness

Ein rundenbasiertes taktisches Kampfspiel, das Final Fantasy-inspirierte Mechaniken mit dem 4 Against Darkness Framework kombiniert.

## 🎮 Spielfeatures

### Kernmechaniken
- **ATB/Aktionspunkte-System**: Jeder Charakter erhält AP basierend auf Speed (1 + floor(Speed/4))
- **Stagger/Break-System**: Baue Stagger auf, um Gegner zu "brechen" und massive Boni zu erhalten
- **Haltungen**: Wähle zwischen Offensiv, Neutral und Defensiv für taktische Vorteile
- **Zonen-System**: Nah, Mitte, Fern - abstrakte Positionierung ohne Bewegungskarten
- **Cooldown-Fähigkeiten**: Mächtige Spezialfähigkeiten mit strategischem Timing
- **Combo-Meter**: Fülle das Team-Meter für verheerende Finisher-Angriffe
- **Status-Effekte**: Schwächen, Betäuben, Markieren für taktische Tiefe

### Charaktere

#### Krieger
- HP: 120 | Speed: 5 | Angriff: 20 | Verteidigung: 15
- Zone: Nah
- Fähigkeiten:
  - **Power Strike**: 2 AP, 2x Schaden, +3 Stagger
  - **Shield Wall**: 2 AP, +50% Verteidigung für 2 Runden

#### Magier
- HP: 80 | Speed: 7 | Angriff: 25 | Verteidigung: 8
- Zone: Fern
- Fähigkeiten:
  - **Fireball**: 3 AP, AOE-Schaden an alle Gegner
  - **Heal**: 2 AP, heilt 30 HP

#### Schurke
- HP: 90 | Speed: 9 | Angriff: 18 | Verteidigung: 10
- Zone: Mitte
- Fähigkeiten:
  - **Quick Strike**: 1 AP, schneller Angriff
  - **Poison Blade**: 2 AP, Angriff + Schwächen-Effekt

### Gegner
- **Goblin**: 50 HP, Stagger-Schwelle 6
- **Ork**: 100 HP, Stagger-Schwelle 10
- **Dunkler Magier**: 70 HP, Stagger-Schwelle 7

## 🚀 Installation & Start

### Voraussetzungen
- Node.js 22.x
- pnpm

### Lokale Entwicklung
```bash
# Dependencies installieren
pnpm install

# Development Server starten
pnpm run dev

# Im Browser öffnen
http://localhost:5173
```

### Produktions-Build
```bash
# Build erstellen
pnpm run build

# Preview des Builds
pnpm run preview
```

## 🎯 Spielanleitung

1. **Kampf starten**: Klicke auf "Kampf Starten"
2. **Haltung wählen**: Wähle Offensiv/Neutral/Defensiv für deinen aktiven Helden
3. **Aktionen ausführen**:
   - Basis-Angriff: 1 AP, moderater Schaden
   - Spezial-Fähigkeiten: 2-3 AP, starke Effekte
   - Zug beenden: Nächster Held ist dran
4. **Stagger aufbauen**: Fokussiere Angriffe auf einen Gegner, um ihn zu brechen
5. **Combo nutzen**: Bei vollem Meter Team-Finisher für massiven AOE-Schaden
6. **Sieg**: Besiege alle Gegner!

## 🛠️ Technologie-Stack

- **React 18** - UI Framework
- **Vite** - Build Tool & Dev Server
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI-Komponenten
- **Lucide Icons** - Icon-System

## 📁 Projektstruktur

```
/rpg
├── src/
│   ├── App.jsx          # Haupt-Spiellogik
│   ├── App.css          # Styles
│   ├── components/ui/   # UI-Komponenten
│   └── assets/          # Bilder & Assets
├── public/              # Statische Dateien
├── index.html           # HTML Entry Point
└── package.json         # Dependencies
```

## 🎨 Design-Prinzipien

- **Visuell ausdrucksstark**: Gradient-Hintergründe, Animationen, Hover-Effekte
- **Klar strukturiert**: Card-basiertes Layout, Farbcodierung
- **Responsiv**: Funktioniert auf verschiedenen Bildschirmgrößen
- **Professionell**: Moderne UI mit shadcn/ui-Komponenten

## 📝 Lizenz

Dieses Projekt wurde als Demonstration taktischer Kampfmechaniken erstellt.

## 🤝 Credits

Inspiriert von:
- Final Fantasy Series (Kampfsystem, ATB, Stagger)
- 4 Against Darkness (Dungeon-Crawling-Framework)
