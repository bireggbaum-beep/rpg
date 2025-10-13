import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Progress } from '@/components/ui/progress.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Sword, Shield, Zap, Heart, Target, Users, Flame, Droplet, Wind } from 'lucide-react'
import './App.css'

// Game Constants
const ZONES = {
  MELEE: 'Nah',
  MIDDLE: 'Mitte',
  RANGED: 'Fern'
}

const STANCES = {
  OFFENSIVE: { name: 'Offensiv', damageBonus: 1.3, defenseBonus: 0.8 },
  NEUTRAL: { name: 'Neutral', damageBonus: 1.0, defenseBonus: 1.0 },
  DEFENSIVE: { name: 'Defensiv', damageBonus: 0.8, defenseBonus: 1.3 }
}

// Character Templates
const CHARACTER_TEMPLATES = {
  warrior: {
    name: 'Krieger',
    maxHp: 120,
    speed: 5,
    attack: 20,
    defense: 15,
    zone: ZONES.MELEE,
    icon: Sword,
    abilities: [
      { id: 'power_strike', name: 'Power Strike', cost: 2, cooldown: 3, damage: 2, stagger: 3, type: 'attack' },
      { id: 'shield_wall', name: 'Shield Wall', cost: 2, cooldown: 3, type: 'buff', effect: 'protected', duration: 2 }
    ]
  },
  mage: {
    name: 'Magier',
    maxHp: 80,
    speed: 7,
    attack: 25,
    defense: 8,
    zone: ZONES.RANGED,
    icon: Flame,
    abilities: [
      { id: 'fireball', name: 'Fireball', cost: 3, cooldown: 3, damage: 1.5, stagger: 2, type: 'aoe' },
      { id: 'heal', name: 'Heal', cost: 2, cooldown: 4, heal: 30, type: 'heal' }
    ]
  },
  rogue: {
    name: 'Schurke',
    maxHp: 90,
    speed: 9,
    attack: 18,
    defense: 10,
    zone: ZONES.MIDDLE,
    icon: Wind,
    abilities: [
      { id: 'quick_strike', name: 'Quick Strike', cost: 1, cooldown: 2, damage: 1.2, stagger: 1, type: 'attack' },
      { id: 'poison_blade', name: 'Poison Blade', cost: 2, cooldown: 3, damage: 1, stagger: 1, type: 'attack', effect: 'weakened', duration: 2 }
    ]
  }
}

const ENEMY_TEMPLATES = {
  goblin: {
    name: 'Goblin',
    maxHp: 50,
    speed: 6,
    attack: 12,
    defense: 8,
    staggerThreshold: 6,
    zone: ZONES.MELEE,
    icon: Target
  },
  orc: {
    name: 'Ork',
    maxHp: 100,
    speed: 4,
    attack: 18,
    defense: 12,
    staggerThreshold: 10,
    zone: ZONES.MELEE,
    icon: Target
  },
  dark_mage: {
    name: 'Dunkler Magier',
    maxHp: 70,
    speed: 8,
    attack: 22,
    defense: 6,
    staggerThreshold: 7,
    zone: ZONES.RANGED,
    icon: Target
  }
}

function App() {
  const [gameState, setGameState] = useState('setup') // setup, combat, victory, defeat
  const [turn, setTurn] = useState(1)
  const [activeCharacter, setActiveCharacter] = useState(null)
  const [comboMeter, setComboMeter] = useState(0)
  const [combatLog, setCombatLog] = useState([])
  
  const [heroes, setHeroes] = useState([])
  const [enemies, setEnemies] = useState([])

  // Initialize game
  const startGame = () => {
    const initialHeroes = [
      { ...CHARACTER_TEMPLATES.warrior, id: 'h1', hp: 120, ap: 0, stance: 'NEUTRAL', cooldowns: {}, statusEffects: [] },
      { ...CHARACTER_TEMPLATES.mage, id: 'h2', hp: 80, ap: 0, stance: 'NEUTRAL', cooldowns: {}, statusEffects: [] },
      { ...CHARACTER_TEMPLATES.rogue, id: 'h3', hp: 90, ap: 0, stance: 'NEUTRAL', cooldowns: {}, statusEffects: [] }
    ]
    
    const initialEnemies = [
      { ...ENEMY_TEMPLATES.goblin, id: 'e1', hp: 50, stagger: 0, statusEffects: [], isBroken: false },
      { ...ENEMY_TEMPLATES.goblin, id: 'e2', hp: 50, stagger: 0, statusEffects: [], isBroken: false },
      { ...ENEMY_TEMPLATES.orc, id: 'e3', hp: 100, stagger: 0, statusEffects: [], isBroken: false }
    ]
    
    setHeroes(initialHeroes)
    setEnemies(initialEnemies)
    setGameState('combat')
    setTurn(1)
    setComboMeter(0)
    setCombatLog(['Kampf beginnt!'])
    startNewTurn(initialHeroes, initialEnemies)
  }

  const startNewTurn = (currentHeroes, currentEnemies) => {
    // Calculate AP based on speed
    const updatedHeroes = currentHeroes.map(h => ({
      ...h,
      ap: 1 + Math.floor(h.speed / 4),
      cooldowns: Object.fromEntries(
        Object.entries(h.cooldowns).map(([key, val]) => [key, Math.max(0, val - 1)])
      )
    }))
    
    // Update enemy broken status and cooldowns
    const updatedEnemies = currentEnemies.map(e => {
      const stillBroken = e.isBroken && e.brokenTurns > 0
      return {
        ...e,
        isBroken: stillBroken,
        brokenTurns: stillBroken ? e.brokenTurns - 1 : 0
      }
    })
    
    setHeroes(updatedHeroes)
    setEnemies(updatedEnemies)
    
    // Set first hero as active
    setActiveCharacter(updatedHeroes[0].id)
    
    addLog(`--- Runde ${turn} ---`)
  }

  const addLog = (message) => {
    setCombatLog(prev => [...prev.slice(-9), message])
  }

  const changeStance = (heroId, newStance) => {
    setHeroes(prev => prev.map(h => 
      h.id === heroId ? { ...h, stance: newStance } : h
    ))
    addLog(`${heroes.find(h => h.id === heroId).name} wechselt zu ${STANCES[newStance].name}`)
  }

  const changeZone = (heroId, newZone) => {
    const hero = heroes.find(h => h.id === heroId)
    if (hero.ap < 1) {
      addLog('Nicht genug AP!')
      return
    }
    
    setHeroes(prev => prev.map(h => 
      h.id === heroId ? { ...h, zone: newZone, ap: h.ap - 1 } : h
    ))
    addLog(`${hero.name} bewegt sich zu ${newZone}`)
  }

  const basicAttack = (heroId, targetId) => {
    const hero = heroes.find(h => h.id === heroId)
    const target = enemies.find(e => e.id === targetId)
    
    if (!hero || !target || hero.ap < 1) {
      addLog('Nicht genug AP!')
      return
    }
    
    const stance = STANCES[hero.stance]
    const damage = Math.max(1, Math.floor(hero.attack * stance.damageBonus - target.defense * (target.isBroken ? 0.5 : 1)))
    const staggerDamage = 1
    
    setEnemies(prev => prev.map(e => {
      if (e.id === targetId) {
        const newHp = Math.max(0, e.hp - damage)
        const newStagger = Math.min(e.staggerThreshold, e.stagger + staggerDamage)
        const broken = newStagger >= e.staggerThreshold
        
        return {
          ...e,
          hp: newHp,
          stagger: broken ? 0 : newStagger,
          isBroken: broken,
          brokenTurns: broken ? 1 : 0
        }
      }
      return e
    }))
    
    setHeroes(prev => prev.map(h => 
      h.id === heroId ? { ...h, ap: h.ap - 1 } : h
    ))
    
    addLog(`${hero.name} greift ${target.name} an für ${damage} Schaden (Stagger +${staggerDamage})`)
    
    if (target.hp - damage <= 0) {
      addLog(`${target.name} wurde besiegt!`)
    }
  }

  const useAbility = (heroId, abilityId, targetId = null) => {
    const hero = heroes.find(h => h.id === heroId)
    const ability = hero.abilities.find(a => a.id === abilityId)
    
    if (!hero || !ability || hero.ap < ability.cost) {
      addLog('Nicht genug AP!')
      return
    }
    
    if (hero.cooldowns[abilityId] > 0) {
      addLog(`${ability.name} ist noch auf Cooldown!`)
      return
    }
    
    const stance = STANCES[hero.stance]
    
    if (ability.type === 'attack') {
      const target = enemies.find(e => e.id === targetId)
      if (!target) return
      
      const damage = Math.max(1, Math.floor(hero.attack * ability.damage * stance.damageBonus - target.defense * (target.isBroken ? 0.5 : 1)))
      const staggerDamage = ability.stagger
      
      setEnemies(prev => prev.map(e => {
        if (e.id === targetId) {
          const newHp = Math.max(0, e.hp - damage)
          const newStagger = Math.min(e.staggerThreshold, e.stagger + staggerDamage)
          const broken = newStagger >= e.staggerThreshold
          
          return {
            ...e,
            hp: newHp,
            stagger: broken ? 0 : newStagger,
            isBroken: broken,
            brokenTurns: broken ? 1 : 0,
            statusEffects: ability.effect ? [...e.statusEffects, { type: ability.effect, duration: ability.duration }] : e.statusEffects
          }
        }
        return e
      }))
      
      addLog(`${hero.name} nutzt ${ability.name} auf ${target.name} für ${damage} Schaden!`)
    } else if (ability.type === 'aoe') {
      const damage = Math.max(1, Math.floor(hero.attack * ability.damage * stance.damageBonus))
      
      setEnemies(prev => prev.map(e => {
        const newHp = Math.max(0, e.hp - damage)
        const newStagger = Math.min(e.staggerThreshold, e.stagger + ability.stagger)
        const broken = newStagger >= e.staggerThreshold
        
        return {
          ...e,
          hp: newHp,
          stagger: broken ? 0 : newStagger,
          isBroken: broken,
          brokenTurns: broken ? 1 : 0
        }
      }))
      
      addLog(`${hero.name} nutzt ${ability.name} auf alle Gegner für ${damage} Schaden!`)
    } else if (ability.type === 'heal') {
      const healTarget = heroes.find(h => h.id === targetId)
      if (!healTarget) return
      
      setHeroes(prev => prev.map(h => 
        h.id === targetId ? { ...h, hp: Math.min(h.maxHp, h.hp + ability.heal) } : h
      ))
      
      addLog(`${hero.name} heilt ${healTarget.name} für ${ability.heal} HP!`)
    } else if (ability.type === 'buff') {
      setHeroes(prev => prev.map(h => 
        h.id === heroId ? { 
          ...h, 
          statusEffects: [...h.statusEffects, { type: ability.effect, duration: ability.duration }] 
        } : h
      ))
      
      addLog(`${hero.name} nutzt ${ability.name}!`)
    }
    
    // Update hero AP and cooldowns
    setHeroes(prev => prev.map(h => 
      h.id === heroId ? { 
        ...h, 
        ap: h.ap - ability.cost,
        cooldowns: { ...h.cooldowns, [abilityId]: ability.cooldown }
      } : h
    ))
    
    // Increase combo meter
    setComboMeter(prev => Math.min(100, prev + 20))
  }

  const useComboFinisher = () => {
    if (comboMeter < 100) {
      addLog('Combo-Meter nicht voll!')
      return
    }
    
    const damage = 50
    setEnemies(prev => prev.map(e => ({
      ...e,
      hp: Math.max(0, e.hp - damage)
    })))
    
    setComboMeter(0)
    addLog(`TEAM FINISHER! Alle Gegner erleiden ${damage} Schaden!`)
  }

  const endTurn = () => {
    const currentHeroIndex = heroes.findIndex(h => h.id === activeCharacter)
    
    if (currentHeroIndex < heroes.length - 1) {
      // Next hero's turn
      setActiveCharacter(heroes[currentHeroIndex + 1].id)
    } else {
      // Enemy turn
      enemyTurn()
    }
  }

  const enemyTurn = () => {
    addLog('--- Gegner-Zug ---')
    
    const aliveEnemies = enemies.filter(e => e.hp > 0 && !e.isBroken)
    
    aliveEnemies.forEach(enemy => {
      const aliveHeroes = heroes.filter(h => h.hp > 0)
      if (aliveHeroes.length === 0) return
      
      const target = aliveHeroes[Math.floor(Math.random() * aliveHeroes.length)]
      const stance = STANCES[target.stance]
      const damage = Math.max(1, Math.floor(enemy.attack - target.defense * stance.defenseBonus))
      
      setHeroes(prev => prev.map(h => 
        h.id === target.id ? { ...h, hp: Math.max(0, h.hp - damage) } : h
      ))
      
      addLog(`${enemy.name} greift ${target.name} an für ${damage} Schaden!`)
    })
    
    // Check win/lose conditions
    setTimeout(() => {
      checkGameEnd()
    }, 500)
  }

  const checkGameEnd = () => {
    const aliveHeroes = heroes.filter(h => h.hp > 0)
    const aliveEnemies = enemies.filter(e => e.hp > 0)
    
    if (aliveEnemies.length === 0) {
      setGameState('victory')
      addLog('SIEG! Alle Gegner besiegt!')
    } else if (aliveHeroes.length === 0) {
      setGameState('defeat')
      addLog('NIEDERLAGE! Alle Helden gefallen!')
    } else {
      // Start new turn
      setTurn(prev => prev + 1)
      setTimeout(() => startNewTurn(heroes, enemies), 500)
    }
  }

  const activeHero = heroes.find(h => h.id === activeCharacter)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-white mb-6 flex items-center justify-center gap-3">
          <Sword className="w-10 h-10" />
          Tactical Combat
          <Shield className="w-10 h-10" />
        </h1>

        {gameState === 'setup' && (
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle className="text-2xl text-center">Willkommen zum Taktischen Kampf</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-center text-muted-foreground">
                Ein rundenbasiertes Kampfspiel mit Final Fantasy-inspirierten Mechaniken
              </p>
              <div className="space-y-2 text-sm">
                <p>✦ ATB/Aktionspunkte-System</p>
                <p>✦ Stagger/Break-Mechanik</p>
                <p>✦ Haltungen (Offensiv/Neutral/Defensiv)</p>
                <p>✦ Zonen-System (Nah/Mitte/Fern)</p>
                <p>✦ Combo-Meter & Team-Finisher</p>
              </div>
              <Button onClick={startGame} className="w-full" size="lg">
                Kampf Starten
              </Button>
            </CardContent>
          </Card>
        )}

        {gameState === 'combat' && (
          <div className="space-y-4">
            {/* Top Bar */}
            <div className="flex justify-between items-center bg-slate-800/50 backdrop-blur p-4 rounded-lg">
              <div className="text-white">
                <span className="text-xl font-bold">Runde {turn}</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-white">
                  <div className="text-sm text-gray-400">Combo Meter</div>
                  <Progress value={comboMeter} className="w-48 h-3" />
                </div>
                <Button 
                  onClick={useComboFinisher} 
                  disabled={comboMeter < 100}
                  variant="destructive"
                  className="gap-2"
                >
                  <Zap className="w-4 h-4" />
                  Team Finisher
                </Button>
              </div>
            </div>

            {/* Main Combat Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Heroes */}
              <div className="lg:col-span-2 space-y-4">
                <Card className="bg-blue-950/30 border-blue-500/50">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Users className="w-5 h-5" />
                      Helden
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {heroes.map(hero => {
                      const Icon = hero.icon
                      const isActive = hero.id === activeCharacter
                      const stance = STANCES[hero.stance]
                      
                      return (
                        <div 
                          key={hero.id} 
                          className={`p-4 rounded-lg border-2 transition-all ${
                            isActive 
                              ? 'bg-blue-900/50 border-blue-400 shadow-lg shadow-blue-500/50' 
                              : 'bg-slate-800/50 border-slate-600'
                          } ${hero.hp <= 0 ? 'opacity-50' : ''}`}
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <Icon className="w-8 h-8 text-blue-400" />
                              <div>
                                <h3 className="text-white font-bold text-lg">{hero.name}</h3>
                                <div className="flex gap-2 mt-1">
                                  <Badge variant="outline" className="text-xs">
                                    {hero.zone}
                                  </Badge>
                                  <Badge variant="secondary" className="text-xs">
                                    {stance.name}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-white font-bold">AP: {hero.ap}</div>
                              <div className="text-sm text-gray-400">Speed: {hero.speed}</div>
                            </div>
                          </div>
                          
                          <div className="space-y-2 mb-3">
                            <div>
                              <div className="flex justify-between text-sm mb-1">
                                <span className="text-gray-400">HP</span>
                                <span className="text-white">{hero.hp}/{hero.maxHp}</span>
                              </div>
                              <Progress value={(hero.hp / hero.maxHp) * 100} className="h-2" />
                            </div>
                          </div>

                          {isActive && hero.hp > 0 && (
                            <div className="space-y-3 border-t border-slate-600 pt-3">
                              <div className="flex gap-2">
                                <Button 
                                  size="sm" 
                                  variant={hero.stance === 'OFFENSIVE' ? 'default' : 'outline'}
                                  onClick={() => changeStance(hero.id, 'OFFENSIVE')}
                                  className="flex-1"
                                >
                                  Offensiv
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant={hero.stance === 'NEUTRAL' ? 'default' : 'outline'}
                                  onClick={() => changeStance(hero.id, 'NEUTRAL')}
                                  className="flex-1"
                                >
                                  Neutral
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant={hero.stance === 'DEFENSIVE' ? 'default' : 'outline'}
                                  onClick={() => changeStance(hero.id, 'DEFENSIVE')}
                                  className="flex-1"
                                >
                                  Defensiv
                                </Button>
                              </div>
                              
                              <div className="flex gap-2">
                                {hero.abilities.map(ability => (
                                  <Button
                                    key={ability.id}
                                    size="sm"
                                    variant="secondary"
                                    disabled={hero.ap < ability.cost || hero.cooldowns[ability.id] > 0}
                                    onClick={() => {
                                      if (ability.type === 'aoe') {
                                        useAbility(hero.id, ability.id)
                                      } else if (ability.type === 'heal') {
                                        // Auto-target lowest HP hero
                                        const target = heroes.reduce((lowest, h) => 
                                          h.hp < lowest.hp ? h : lowest
                                        )
                                        useAbility(hero.id, ability.id, target.id)
                                      } else if (ability.type === 'buff') {
                                        useAbility(hero.id, ability.id)
                                      }
                                    }}
                                    className="flex-1 text-xs"
                                  >
                                    {ability.name}
                                    <span className="ml-1 text-xs opacity-70">
                                      ({ability.cost}AP)
                                      {hero.cooldowns[ability.id] > 0 && ` ${hero.cooldowns[ability.id]}T`}
                                    </span>
                                  </Button>
                                ))}
                              </div>
                              
                              <Button 
                                onClick={endTurn} 
                                className="w-full"
                                variant="outline"
                              >
                                Zug Beenden
                              </Button>
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </CardContent>
                </Card>

                {/* Enemies */}
                <Card className="bg-red-950/30 border-red-500/50">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Target className="w-5 h-5" />
                      Gegner
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {enemies.map(enemy => {
                      const Icon = enemy.icon
                      
                      return (
                        <div 
                          key={enemy.id} 
                          className={`p-4 rounded-lg border-2 bg-slate-800/50 border-slate-600 ${
                            enemy.hp <= 0 ? 'opacity-50' : ''
                          } ${enemy.isBroken ? 'border-yellow-500 shadow-lg shadow-yellow-500/50' : ''}`}
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <Icon className="w-8 h-8 text-red-400" />
                              <div>
                                <h3 className="text-white font-bold text-lg">{enemy.name}</h3>
                                <Badge variant="outline" className="text-xs mt-1">
                                  {enemy.zone}
                                </Badge>
                                {enemy.isBroken && (
                                  <Badge variant="destructive" className="text-xs ml-2">
                                    GEBROCHEN
                                  </Badge>
                                )}
                              </div>
                            </div>
                            <div className="text-right text-sm text-gray-400">
                              <div>ATK: {enemy.attack}</div>
                              <div>DEF: {enemy.defense}</div>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <div>
                              <div className="flex justify-between text-sm mb-1">
                                <span className="text-gray-400">HP</span>
                                <span className="text-white">{enemy.hp}/{enemy.maxHp}</span>
                              </div>
                              <Progress value={(enemy.hp / enemy.maxHp) * 100} className="h-2" />
                            </div>
                            
                            <div>
                              <div className="flex justify-between text-sm mb-1">
                                <span className="text-gray-400">Stagger</span>
                                <span className="text-white">{enemy.stagger}/{enemy.staggerThreshold}</span>
                              </div>
                              <Progress 
                                value={(enemy.stagger / enemy.staggerThreshold) * 100} 
                                className="h-2 bg-slate-700"
                              />
                            </div>
                          </div>

                          {activeHero && activeHero.hp > 0 && enemy.hp > 0 && (
                            <div className="flex gap-2 mt-3 border-t border-slate-600 pt-3">
                              <Button
                                size="sm"
                                variant="destructive"
                                disabled={activeHero.ap < 1}
                                onClick={() => basicAttack(activeHero.id, enemy.id)}
                                className="flex-1"
                              >
                                <Sword className="w-4 h-4 mr-1" />
                                Angriff (1AP)
                              </Button>
                              
                              {activeHero.abilities.filter(a => a.type === 'attack').map(ability => (
                                <Button
                                  key={ability.id}
                                  size="sm"
                                  variant="secondary"
                                  disabled={activeHero.ap < ability.cost || activeHero.cooldowns[ability.id] > 0}
                                  onClick={() => useAbility(activeHero.id, ability.id, enemy.id)}
                                  className="flex-1 text-xs"
                                >
                                  {ability.name} ({ability.cost}AP)
                                </Button>
                              ))}
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </CardContent>
                </Card>
              </div>

              {/* Combat Log */}
              <div className="lg:col-span-1">
                <Card className="bg-slate-800/50 h-full">
                  <CardHeader>
                    <CardTitle className="text-white text-lg">Kampf-Log</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-1 text-sm font-mono">
                      {combatLog.map((log, i) => (
                        <div 
                          key={i} 
                          className={`text-gray-300 ${
                            log.includes('---') ? 'text-yellow-400 font-bold' : ''
                          } ${
                            log.includes('SIEG') || log.includes('FINISHER') ? 'text-green-400 font-bold' : ''
                          } ${
                            log.includes('NIEDERLAGE') ? 'text-red-400 font-bold' : ''
                          }`}
                        >
                          {log}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        )}

        {(gameState === 'victory' || gameState === 'defeat') && (
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle className={`text-3xl text-center ${
                gameState === 'victory' ? 'text-green-500' : 'text-red-500'
              }`}>
                {gameState === 'victory' ? '🎉 SIEG! 🎉' : '💀 NIEDERLAGE 💀'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-center text-muted-foreground">
                {gameState === 'victory' 
                  ? 'Alle Gegner wurden besiegt!' 
                  : 'Alle Helden sind gefallen!'}
              </p>
              <Button onClick={startGame} className="w-full" size="lg">
                Neuer Kampf
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

export default App

