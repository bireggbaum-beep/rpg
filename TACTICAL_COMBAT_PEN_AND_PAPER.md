# Tactical Combat - Pen & Paper Regelwerk
## Final Fantasy meets 4 Against Darkness

Ein vollständig spielbares Pen & Paper Kampfsystem für taktische Kämpfe am Spieltisch.

---

## 📋 Benötigte Materialien

### Für jeden Spieler
- **Charakterbogen** (siehe unten)
- **W6-Würfel** (mindestens 2-3 pro Spieler)
- **Token/Marker** für AP (Münzen, Glassteine, etc.)
- **Token für Stagger** (andere Farbe als AP)
- **Papierclips oder Marker** für HP-Tracking

### Für den Spielleiter
- **Gegnerkarten** (siehe Templates)
- **Initiativ-Tracker** (einfache Liste)
- **Combo-Meter Tracker** (Papier mit Kästchen 0-10)
- **Cooldown-Tracker** (optional: kleine Würfel als Countdown)

---

## 🎯 Charakterbögen - Spielfertig

### KRIEGER
```
┌─────────────────────────────────────┐
│ KRIEGER                             │
├─────────────────────────────────────┤
│ HP: ⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜ (120)      │
│ Speed: 5  |  AP pro Runde: 2        │
│ Angriff: 20  |  Verteidigung: 15    │
│ Zone: NAH                           │
├─────────────────────────────────────┤
│ HALTUNG (markiere eine):            │
│ ⬜ OFFENSIV (+30% ATK, -20% DEF)    │
│ ☑ NEUTRAL (normal)                  │
│ ⬜ DEFENSIV (-20% ATK, +30% DEF)    │
├─────────────────────────────────────┤
│ FÄHIGKEITEN:                        │
│                                     │
│ ⚔ POWER STRIKE                      │
│   Kosten: 2 AP | Cooldown: 3 Runden│
│   Effekt: 2x Schaden, +3 Stagger   │
│   Cooldown: ⬜⬜⬜                   │
│                                     │
│ 🛡 SHIELD WALL                      │
│   Kosten: 2 AP | Cooldown: 3 Runden│
│   Effekt: +50% DEF für 2 Runden    │
│   Cooldown: ⬜⬜⬜                   │
│   Dauer: ⬜⬜                        │
└─────────────────────────────────────┘
```

### MAGIER
```
┌─────────────────────────────────────┐
│ MAGIER                              │
├─────────────────────────────────────┤
│ HP: ⬜⬜⬜⬜⬜⬜⬜⬜ (80)             │
│ Speed: 7  |  AP pro Runde: 2        │
│ Angriff: 25  |  Verteidigung: 8     │
│ Zone: FERN                          │
├─────────────────────────────────────┤
│ HALTUNG (markiere eine):            │
│ ⬜ OFFENSIV (+30% ATK, -20% DEF)    │
│ ☑ NEUTRAL (normal)                  │
│ ⬜ DEFENSIV (-20% ATK, +30% DEF)    │
├─────────────────────────────────────┤
│ FÄHIGKEITEN:                        │
│                                     │
│ 🔥 FIREBALL                         │
│   Kosten: 3 AP | Cooldown: 3 Runden│
│   Effekt: Schaden an ALLE Gegner   │
│           1.5x ATK, +2 Stagger     │
│   Cooldown: ⬜⬜⬜                   │
│                                     │
│ 💚 HEAL                             │
│   Kosten: 2 AP | Cooldown: 4 Runden│
│   Effekt: Heile 30 HP (1 Ziel)     │
│   Cooldown: ⬜⬜⬜⬜                 │
└─────────────────────────────────────┘
```

### SCHURKE
```
┌─────────────────────────────────────┐
│ SCHURKE                             │
├─────────────────────────────────────┤
│ HP: ⬜⬜⬜⬜⬜⬜⬜⬜⬜ (90)           │
│ Speed: 9  |  AP pro Runde: 3        │
│ Angriff: 18  |  Verteidigung: 10    │
│ Zone: MITTE                         │
├─────────────────────────────────────┤
│ HALTUNG (markiere eine):            │
│ ⬜ OFFENSIV (+30% ATK, -20% DEF)    │
│ ☑ NEUTRAL (normal)                  │
│ ⬜ DEFENSIV (-20% ATK, +30% DEF)    │
├─────────────────────────────────────┤
│ FÄHIGKEITEN:                        │
│                                     │
│ ⚡ QUICK STRIKE                     │
│   Kosten: 1 AP | Cooldown: 2 Runden│
│   Effekt: 1.2x Schaden, +1 Stagger │
│   Cooldown: ⬜⬜                     │
│                                     │
│ 🗡 POISON BLADE                     │
│   Kosten: 2 AP | Cooldown: 3 Runden│
│   Effekt: 1x Schaden, +1 Stagger   │
│           Ziel: WEAKENED (2 Runden)│
│   Cooldown: ⬜⬜⬜                   │
└─────────────────────────────────────┘
```

---

## 👹 Gegnerkarten

### GOBLIN
```
┌─────────────────────────────────┐
│ GOBLIN                          │
├─────────────────────────────────┤
│ HP: ⬜⬜⬜⬜⬜ (50)              │
│ Speed: 6                        │
│ Angriff: 12  |  Verteidigung: 8│
│ Zone: NAH                       │
├─────────────────────────────────┤
│ STAGGER: ⬜⬜⬜⬜⬜⬜ (0/6)      │
│ ⬜ GEBROCHEN (-50% DEF, Skip)  │
├─────────────────────────────────┤
│ AKTION:                         │
│ Würfle W6:                      │
│ 1-4: Basis-Angriff (12 Schaden)│
│ 5-6: Schwerer Schlag (18 Schad)│
└─────────────────────────────────┘
```

### ORK
```
┌─────────────────────────────────┐
│ ORK                             │
├─────────────────────────────────┤
│ HP: ⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜ (100)    │
│ Speed: 4                        │
│ Angriff: 18  |  Verteidigung: 12│
│ Zone: NAH                       │
├─────────────────────────────────┤
│ STAGGER: ⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜(0/10)│
│ ⬜ GEBROCHEN (-50% DEF, Skip)  │
├─────────────────────────────────┤
│ AKTION:                         │
│ Würfle W6:                      │
│ 1-3: Basis-Angriff (18 Schaden)│
│ 4-5: Wuchtschlag (24 Schaden)  │
│ 6: Kriegsschrei (alle Helden   │
│    -2 auf nächsten Angriff)    │
└─────────────────────────────────┘
```

### DUNKLER MAGIER
```
┌─────────────────────────────────┐
│ DUNKLER MAGIER                  │
├─────────────────────────────────┤
│ HP: ⬜⬜⬜⬜⬜⬜⬜ (70)           │
│ Speed: 8                        │
│ Angriff: 22  |  Verteidigung: 6│
│ Zone: FERN                      │
├─────────────────────────────────┤
│ STAGGER: ⬜⬜⬜⬜⬜⬜⬜ (0/7)    │
│ ⬜ GEBROCHEN (-50% DEF, Skip)  │
├─────────────────────────────────┤
│ AKTION:                         │
│ Würfle W6:                      │
│ 1-2: Schattenblitz (22 Schaden)│
│ 3-4: Dunkle Kugel (18 Schaden, │
│      +Weakened für 2 Runden)   │
│ 5-6: Fluch (15 Schaden an ALLE)│
└─────────────────────────────────┘
```

---

## 🎲 SPIELABLAUF - Schritt für Schritt

### KAMPFBEGINN

1. **Aufbau vorbereiten**
   - Jeder Spieler nimmt seinen Charakterbogen
   - Spielleiter legt Gegnerkarten aus
   - Combo-Meter auf 0 setzen (Zettel mit 10 Kästchen)

2. **Initiative bestimmen**
   - Sortiere alle Charaktere und Gegner nach Speed (höchste zuerst)
   - Bei Gleichstand: W6 würfeln
   - Schreibe Reihenfolge auf

### RUNDENABLAUF

#### Phase 1: Rundenbeginn
- Runden-Nummer ansagen
- Alle Charaktere erhalten ihre AP (Tokens verteilen)
- Cooldowns um 1 reduzieren (Kästchen leeren)
- Status-Effekte um 1 reduzieren

#### Phase 2: Helden-Züge (in Initiative-Reihenfolge)

**Wenn ein Held dran ist:**

1. **Haltung wählen** (optional, kostet keine AP)
   - Markiere neue Haltung auf dem Bogen
   - Merke dir die Modifikatoren

2. **Aktionen ausführen** (solange AP vorhanden)
   
   **Option A: BASIS-ANGRIFF (1 AP)**
   - Wähle ein Ziel
   - Berechne Schaden: `(Dein ATK × Haltung) - (Gegner DEF × Faktor)`
   - Faktor = 1.0 normal, 0.5 wenn Gegner gebrochen
   - Gegner verliert HP
   - Gegner erhält +1 Stagger (Token hinzufügen)
   - Entferne 1 AP-Token
   
   **Option B: FÄHIGKEIT NUTZEN (siehe Charakterbogen)**
   - Prüfe: Genug AP? Cooldown = 0?
   - Zahle AP-Kosten (Tokens entfernen)
   - Führe Effekt aus (siehe Fähigkeitsbeschreibung)
   - Setze Cooldown (Kästchen markieren)
   - **Wichtig:** +1 Combo-Meter Kästchen markieren!
   
   **Option C: ZONE WECHSELN (1 AP)**
   - Ändere Zone auf Bogen (Nah ↔ Mitte ↔ Fern)
   - Entferne 1 AP-Token
   
   **Option D: VERTEIDIGEN (0 AP)**
   - Bis zum nächsten Zug: +50% Verteidigung
   - Notiere "Verteidigt" auf Bogen

3. **Zug beenden**
   - Sage "Zug beendet"
   - Nächster Charakter ist dran

#### Phase 3: Gegner-Züge (in Initiative-Reihenfolge)

**Für jeden Gegner:**
1. **Prüfe Status**
   - Gebrochen? → Zug überspringen, Status entfernen
   - Stunned? → Zug überspringen, Status entfernen

2. **Würfle Aktion** (siehe Gegnerkarte)
   - Würfle W6
   - Führe entsprechende Aktion aus
   - Wähle Ziel: Niedrigste HP oder zufällig (W6)

3. **Schaden berechnen**
   - `Gegner ATK - (Held DEF × Haltung)`
   - Held verliert HP

#### Phase 4: Rundenende
- Prüfe Sieg/Niederlage
- Wenn Kampf weitergeht: Neue Runde beginnen

---

## 🎯 COMBO-METER SYSTEM (Pen & Paper Lösung)

### Tracking
```
COMBO-METER
┌─┬─┬─┬─┬─┬─┬─┬─┬─┬─┐
│ │ │ │ │ │ │ │ │ │ │  = 0/10
└─┴─┴─┴─┴─┴─┴─┴─┴─┴─┘

Markiere Kästchen wenn Fähigkeiten genutzt werden:
┌─┬─┬─┬─┬─┬─┬─┬─┬─┬─┐
│X│X│X│X│ │ │ │ │ │ │  = 4/10
└─┴─┴─┴─┴─┴─┴─┴─┴─┴─┘
```

### Regeln
- **+2 Kästchen** pro genutzter Fähigkeit (nicht Basis-Angriff!)
- Bei **10/10 voll**: Team-Finisher verfügbar
- **Team-Finisher nutzen:**
  - Jeder Held kann in seinem Zug den Finisher auslösen
  - Kostet 0 AP
  - Effekt: Alle Gegner erleiden 50 Schaden
  - Meter auf 0 zurücksetzen

**Beispiel:**
- Runde 1: Krieger nutzt Power Strike → +2 Combo (2/10)
- Runde 1: Magier nutzt Fireball → +2 Combo (4/10)
- Runde 2: Schurke nutzt Quick Strike → +2 Combo (6/10)
- Runde 2: Krieger nutzt Power Strike → +2 Combo (8/10)
- Runde 3: Magier nutzt Heal → +2 Combo (10/10) → FINISHER BEREIT!

---

## 💥 STAGGER-SYSTEM (Pen & Paper Lösung)

### Tracking mit Tokens
Lege Token/Münzen auf die Gegnerkarte:
```
GOBLIN (Schwelle: 6)
Stagger: 🔴🔴🔴🔴⚪⚪ = 4/6

Bei 6 Tokens → GEBROCHEN!
```

### Gebrochen-Status
Wenn Stagger-Schwelle erreicht:
1. Markiere "GEBROCHEN" auf Gegnerkarte
2. Entferne alle Stagger-Tokens
3. Effekte:
   - Gegner hat -50% Verteidigung
   - Gegner überspringt nächsten Zug
4. Nach übersprungener Aktion: Status entfernen

**Beispiel:**
- Goblin hat 4/6 Stagger
- Krieger greift an: +1 Stagger → 5/6
- Magier nutzt Fireball: +2 Stagger → 7/6 → GEBROCHEN!
- Goblin überspringt nächsten Zug
- Alle Angriffe auf Goblin: -50% seiner Verteidigung
- Nach seinem übersprungenen Zug: Status weg, Stagger = 0

---

## 🧮 SCHADENSBERECHNUNG - Vereinfacht

### Basis-Formel
```
Schaden = Angriff × Haltung-Bonus - Verteidigung × Gegner-Faktor
Minimum: 1 Schaden (immer mindestens 1)
```

### Haltungs-Modifikatoren
- **Offensiv:** ATK × 1.3, DEF × 0.8
- **Neutral:** ATK × 1.0, DEF × 1.0
- **Defensiv:** ATK × 0.8, DEF × 1.3

### Gegner-Faktoren
- **Normal:** DEF × 1.0
- **Gebrochen:** DEF × 0.5

### Praktische Beispiele

**Beispiel 1: Krieger (Neutral) greift Goblin an**
```
Krieger ATK: 20
Goblin DEF: 8
Haltung: Neutral (×1.0)

Schaden = 20 × 1.0 - 8 × 1.0 = 12 Schaden
```

**Beispiel 2: Krieger (Offensiv) greift gebrochenen Goblin an**
```
Krieger ATK: 20
Goblin DEF: 8 (gebrochen → ×0.5 = 4)
Haltung: Offensiv (×1.3)

Schaden = 20 × 1.3 - 4 = 26 - 4 = 22 Schaden
```

**Beispiel 3: Magier nutzt Fireball (1.5× ATK)**
```
Magier ATK: 25
Fireball Multiplikator: 1.5
Goblin DEF: 8

Schaden = 25 × 1.5 - 8 = 37.5 - 8 = 29 Schaden (auf ALLE Gegner!)
```

---

## 📊 SCHNELLREFERENZ-TABELLE

### Aktionskosten
| Aktion | AP-Kosten | Effekt |
|--------|-----------|--------|
| Basis-Angriff | 1 | Schaden + 1 Stagger |
| Fähigkeit | 1-3 | Siehe Charakterbogen |
| Zone wechseln | 1 | Ändere Position |
| Verteidigen | 0 | +50% DEF bis nächster Zug |
| Haltung wechseln | 0 | Ändere Modifikatoren |

### Stagger-Werte
| Aktion | Stagger |
|--------|---------|
| Basis-Angriff | +1 |
| Quick Strike | +1 |
| Poison Blade | +1 |
| Fireball | +2 |
| Power Strike | +3 |

### Status-Effekte
| Status | Effekt | Dauer |
|--------|--------|-------|
| Gebrochen | -50% DEF, Skip Turn | 1 Zug |
| Weakened | -30% ATK | 2 Runden |
| Protected | +50% DEF | 2 Runden |
| Stunned | Skip Turn | 1 Runde |
| Verteidigt | +50% DEF | Bis nächster Zug |

---

## 🎮 BEISPIEL-KAMPF (Komplett durchgespielt)

### Setup
- **Helden:** Krieger, Magier, Schurke
- **Gegner:** 2× Goblin, 1× Ork
- **Combo-Meter:** 0/10

### Initiative (nach Speed sortiert)
1. Schurke (Speed 9)
2. Ork (Speed 8) - FEHLER: Ork hat Speed 4!
3. Magier (Speed 7)
4. Goblin 1 (Speed 6)
5. Goblin 2 (Speed 6)
6. Krieger (Speed 5)
7. Ork (Speed 4)

**Korrigierte Initiative:**
1. Schurke (Speed 9)
2. Magier (Speed 7)
3. Goblin 1 (Speed 6)
4. Goblin 2 (Speed 6)
5. Krieger (Speed 5)
6. Ork (Speed 4)

---

### RUNDE 1

#### Schurke (3 AP)
- Haltung: Offensiv wählen
- Aktion 1: Quick Strike auf Goblin 1 (1 AP)
  - Schaden: 18 × 1.2 × 1.3 - 8 = 28 - 8 = 20 Schaden
  - Goblin 1: 50 → 30 HP
  - Stagger: 0 → 1/6
  - Combo: 0 → 2/10
- Aktion 2: Basis-Angriff auf Goblin 1 (1 AP)
  - Schaden: 18 × 1.3 - 8 = 23 - 8 = 15 Schaden
  - Goblin 1: 30 → 15 HP
  - Stagger: 1 → 2/6
- Aktion 3: Basis-Angriff auf Goblin 1 (1 AP)
  - Schaden: 15 Schaden
  - Goblin 1: 15 → 0 HP → **BESIEGT!**
  - Stagger: 2 → 3/6 (irrelevant, tot)

#### Magier (2 AP)
- Haltung: Neutral
- Aktion: Fireball auf alle Gegner (3 AP) → **NICHT GENUG AP!**
- Aktion: Basis-Angriff auf Goblin 2 (1 AP)
  - Schaden: 25 - 8 = 17 Schaden
  - Goblin 2: 50 → 33 HP
  - Stagger: 0 → 1/6
- Aktion: Basis-Angriff auf Goblin 2 (1 AP)
  - Schaden: 17 Schaden
  - Goblin 2: 33 → 16 HP
  - Stagger: 1 → 2/6

#### Goblin 2 (Gegner-Zug)
- Würfelt W6: 3 → Basis-Angriff
- Ziel: Schurke (niedrigste HP)
- Schaden: 12 - 10 × 0.8 = 12 - 8 = 4 Schaden (Offensiv-Haltung!)
- Schurke: 90 → 86 HP

#### Krieger (2 AP)
- Haltung: Neutral
- Aktion: Power Strike auf Goblin 2 (2 AP)
  - Schaden: 20 × 2 - 8 = 40 - 8 = 32 Schaden
  - Goblin 2: 16 → 0 HP → **BESIEGT!**
  - Stagger: irrelevant
  - Combo: 2 → 4/10
  - Cooldown: Power Strike 3 Runden

#### Ork (Gegner-Zug)
- Würfelt W6: 5 → Wuchtschlag
- Ziel: Krieger (zufällig)
- Schaden: 24 - 15 = 9 Schaden
- Krieger: 120 → 111 HP

**Runde 1 Ende:**
- Goblin 1: TOT
- Goblin 2: TOT
- Ork: 100 HP, 0/10 Stagger
- Combo: 4/10

---

### RUNDE 2

#### Schurke (3 AP)
- Cooldown: Quick Strike 2 → 1
- Haltung: Neutral wechseln (mehr Verteidigung)
- Aktion 1: Poison Blade auf Ork (2 AP)
  - Schaden: 18 - 12 = 6 Schaden
  - Ork: 100 → 94 HP
  - Stagger: 0 → 1/10
  - Status: Weakened (2 Runden)
  - Combo: 4 → 6/10
- Aktion 2: Basis-Angriff auf Ork (1 AP)
  - Schaden: 18 - 12 = 6 Schaden
  - Ork: 94 → 88 HP
  - Stagger: 1 → 2/10

#### Magier (2 AP)
- Aktion: Heal auf Schurke (2 AP)
  - Schurke: 86 → 116 HP (max 90) → 90 HP
  - Combo: 6 → 8/10
  - Cooldown: Heal 4 Runden

#### Krieger (2 AP)
- Cooldown: Power Strike 3 → 2
- Aktion 1: Basis-Angriff auf Ork (1 AP)
  - Schaden: 20 - 12 = 8 Schaden
  - Ork: 88 → 80 HP
  - Stagger: 2 → 3/10
- Aktion 2: Basis-Angriff auf Ork (1 AP)
  - Schaden: 8 Schaden
  - Ork: 80 → 72 HP
  - Stagger: 3 → 4/10

#### Ork (Gegner-Zug)
- Status: Weakened (ATK -30%)
- Würfelt W6: 2 → Basis-Angriff
- Schaden: 18 × 0.7 - 15 = 12.6 - 15 = 1 Schaden (Minimum)
- Krieger: 111 → 110 HP
- Weakened: 2 → 1 Runde verbleibend

**Runde 2 Ende:**
- Ork: 72 HP, 4/10 Stagger, Weakened (1)
- Combo: 8/10

---

### RUNDE 3

#### Schurke (3 AP)
- Cooldown: Quick Strike 1 → 0 (verfügbar!)
- Cooldown: Poison Blade 3 → 2
- Aktion 1: Quick Strike auf Ork (1 AP)
  - Schaden: 18 × 1.2 - 12 = 21.6 - 12 = 9 Schaden
  - Ork: 72 → 63 HP
  - Stagger: 4 → 5/10
  - Combo: 8 → 10/10 → **FINISHER BEREIT!**
- Aktion 2: **TEAM FINISHER!** (0 AP)
  - Ork: 63 - 50 = 13 HP
  - Combo: 10 → 0/10
- Aktion 3: Basis-Angriff auf Ork (1 AP)
  - Schaden: 18 - 12 = 6 Schaden
  - Ork: 13 → 7 HP
  - Stagger: 5 → 6/10
- Aktion 4: Basis-Angriff auf Ork (1 AP)
  - Schaden: 6 Schaden
  - Ork: 7 → 1 HP
  - Stagger: 6 → 7/10

#### Magier (2 AP)
- Cooldown: Heal 4 → 3
- Aktion: Basis-Angriff auf Ork (1 AP)
  - Schaden: 25 - 12 = 13 Schaden
  - Ork: 1 → 0 HP → **BESIEGT!**

**KAMPF GEWONNEN!**

---

## 💡 TIPPS FÜR SPIELLEITER

### Tracking vereinfachen
1. **AP-Tokens:** Nutze unterschiedliche Münzen (z.B. 1-Cent für 1 AP)
2. **Stagger:** Andere Münzenfarbe oder Glassteine
3. **Cooldowns:** Kleine W6 auf Charakterbogen legen, Zahl = verbleibende Runden
4. **Combo-Meter:** Einfach Strichliste auf Papier
5. **HP:** Papierclips auf Charakterbogen verschieben

### Balancing
- **Zu leicht?** Mehr Gegner oder stärkere Gegner
- **Zu schwer?** Gegner-HP reduzieren oder mehr Heilung
- **Zu langsam?** AP-Formel ändern: 2 + floor(Speed/5)
- **Zu schnell?** Gegner-HP verdoppeln

### Varianten
- **Hardcore:** Keine Heilung zwischen Kämpfen
- **Schnell:** Alle starten mit vollem Combo-Meter
- **Taktisch:** Zonen-Reichweiten einführen (Nah kann nur Nah angreifen)

---

## 📄 DRUCKVORLAGEN

### Combo-Meter Tracker (zum Ausdrucken)
```
═══════════════════════════════════════
         COMBO-METER TRACKER
═══════════════════════════════════════

Kampf #1:
┌───┬───┬───┬───┬───┬───┬───┬───┬───┬───┐
│   │   │   │   │   │   │   │   │   │   │
└───┴───┴───┴───┴───┴───┴───┴───┴───┴───┘
0   1   2   3   4   5   6   7   8   9   10

Kampf #2:
┌───┬───┬───┬───┬───┬───┬───┬───┬───┬───┐
│   │   │   │   │   │   │   │   │   │   │
└───┴───┴───┴───┴───┴───┴───┴───┴───┴───┘

Kampf #3:
┌───┬───┬───┬───┬───┬───┬───┬───┬───┬───┐
│   │   │   │   │   │   │   │   │   │   │
└───┴───┴───┴───┴───┴───┴───┴───┴───┴───┘

═══════════════════════════════════════
```

### Initiative Tracker
```
═══════════════════════════════════════
       INITIATIVE TRACKER
═══════════════════════════════════════

Runde: _____

1. _________________ (Speed: ___)
2. _________________ (Speed: ___)
3. _________________ (Speed: ___)
4. _________________ (Speed: ___)
5. _________________ (Speed: ___)
6. _________________ (Speed: ___)
7. _________________ (Speed: ___)
8. _________________ (Speed: ___)

═══════════════════════════════════════
```

---

## ✅ CHECKLISTE FÜR SPIELLEITER

### Vor dem Kampf
- [ ] Charakterbögen verteilt
- [ ] Gegnerkarten vorbereitet
- [ ] AP-Tokens bereitgelegt
- [ ] Stagger-Tokens bereitgelegt
- [ ] Combo-Meter Zettel vorbereitet
- [ ] Initiative-Liste erstellt
- [ ] W6-Würfel für alle vorhanden

### Während des Kampfes
- [ ] Rundenzahl ansagen
- [ ] AP verteilen zu Rundenbeginn
- [ ] Cooldowns reduzieren
- [ ] Status-Effekte tracken
- [ ] Combo-Meter aktualisieren
- [ ] Stagger prüfen (Gebrochen?)
- [ ] Schaden korrekt berechnen

### Nach dem Kampf
- [ ] Erfahrung verteilen (optional)
- [ ] Loot verteilen (optional)
- [ ] HP für nächsten Kampf notieren
- [ ] Cooldowns zurücksetzen (optional)

---

## 🎯 FAZIT

Dieses System ist **vollständig am Spieltisch spielbar** mit:
- ✅ Einfachen Tracking-Methoden (Tokens, Kästchen)
- ✅ Klaren Regeln ohne Unklarheiten
- ✅ Schneller Schadensberechnung
- ✅ Taktischer Tiefe durch Haltungen, Stagger, Combo
- ✅ Druckbaren Vorlagen

**Viel Spaß beim Spielen!** 🎲⚔️

