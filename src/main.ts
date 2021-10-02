import harvester from './workers/harvester'
import upgrader from './workers/upgrader'
import attacker from './workers/attacker'
import defender from './workers/defender'
import builder from './workers/builder'

enum RoomState {
  Passive = 'Passive',
  Attacking = 'Attacking',
  Defending = 'Defending',
  Building = 'Building',
}

const roomStates: { [k: string]: RoomState } = {}

const workerMap = {
  harvester,
  upgrader,
  attacker,
  defender,
  builder,
}

function getRoomState(room: Room) {
  if (roomStates[room.name]) return roomStates[room.name]
  const isControlled = room.controller && room.controller.my
  const hasHostileCreeps = room.find(FIND_HOSTILE_CREEPS).length
  let state = RoomState.Passive
  if (Object.keys(Game.constructionSites).length > 0) {
    state = RoomState.Building
  } else if (isControlled && hasHostileCreeps) {
    state = RoomState.Defending
  } else if (!isControlled) {
    state = RoomState.Attacking
  }
  roomStates[room.name] = state
  return state
}

function calculateCreepCost(parts: BodyPartConstant[]) {
  return parts.reduce((acc, p) => acc + BODYPART_COST[p], 0)
}

export function loop() {
  for (const name in Memory.creeps) {
    if (!Game.creeps[name]) {
      delete Memory.creeps[name]
      console.log('Clearing non-existing creep memory:', name)
    }
  }

  const harvesters = Object.values(Game.creeps).filter((creep) => creep.memory.role == 'harvester')
  const upgraders = Object.values(Game.creeps).filter((creep) => creep.memory.role == 'upgrader')
  const fighters = Object.values(Game.creeps).filter(
    (creep) =>
      creep.memory.activeRole == 'attacker' ||
      creep.memory.activeRole == 'defender' ||
      creep.getActiveBodyparts(RANGED_ATTACK)
  )

  if (Game.spawns['Spawn1'].spawning) {
    const spawningCreep = Game.creeps[Game.spawns['Spawn1'].spawning.name]
    Game.spawns['Spawn1'].room.visual.text(
      '🛠️' + spawningCreep.memory.activeRole,
      Game.spawns['Spawn1'].pos.x + 1,
      Game.spawns['Spawn1'].pos.y,
      { align: 'left', opacity: 0.8 }
    )
  }

  if (harvesters.length < 3 && calculateCreepCost(harvester.parts)) {
    const newName = 'Harvester' + Game.time
    Game.spawns['Spawn1'].spawnCreep(harvester.parts, newName, {
      memory: { role: 'harvester', activeRole: 'harvester' },
    })
  } else if (upgraders.length < 2 && calculateCreepCost(upgrader.parts)) {
    const newName = 'Upgrader' + Game.time
    Game.spawns['Spawn1'].spawnCreep(upgrader.parts, newName, {
      memory: { role: 'upgrader', activeRole: 'upgrader', upgrading: false },
    })
  } else if (fighters.length < 2 && calculateCreepCost(attacker.parts)) {
    const newName = 'Fighter' + Game.time
    Game.spawns['Spawn1'].spawnCreep(attacker.parts, newName, {
      memory: { role: 'harvester', activeRole: 'attacker' },
    })
  }

  for (const name in Game.creeps) {
    const creep = Game.creeps[name]

    if (
      creep.room.controller?.my &&
      creep.room.controller?.level > 1 &&
      Object.keys(Game.constructionSites).length < 1
    ) {
      const mySpawn = creep.room.find(FIND_MY_SPAWNS)[0]
      const extensionSpawns = creep.room.lookAtArea(
        mySpawn.pos.x - 2,
        mySpawn.pos.y - 2,
        mySpawn.pos.x + 2,
        mySpawn.pos.y + 2
      )
      let freeSpace
      for (const x in extensionSpawns) {
        for (const y in extensionSpawns[x]) {
          const entries = extensionSpawns[x][y]
          const isBuildable = entries.every(
            ({ type, terrain }) => (type === 'terrain' && terrain === 'plain') || type === 'creep'
          )
          if (isBuildable) {
            freeSpace = { x: Number(x), y: Number(y) }
            break
          }
        }
        if (freeSpace) break
      }
      if (freeSpace) {
        creep.room.createConstructionSite(freeSpace.x, freeSpace.y, STRUCTURE_EXTENSION)
      }
    }

    const canAttack = creep.getActiveBodyparts(RANGED_ATTACK)
    const canWork = creep.getActiveBodyparts(WORK)
    const roomState = getRoomState(creep.room)
    console.log('Room state:', roomState)
    if (roomState === RoomState.Defending && canAttack) {
      creep.memory.activeRole = 'defender'
    } else if (roomState === RoomState.Attacking && canAttack) {
      creep.memory.activeRole = 'attacker'
    } else if (roomState === RoomState.Building && canWork && harvesters.length > 1) {
      creep.memory.activeRole = 'builder'
    } else {
      creep.memory.activeRole = creep.memory.role
    }
    try {
      const fn = workerMap[creep.memory.activeRole] || workerMap.harvester
      fn.run(creep)
    } catch (e) {
      console.log(
        creep.name,
        'failed activity',
        e.message,
        'as',
        creep.memory.activeRole,
        'falling back to',
        creep.memory.role
      )
      try {
        const fn = workerMap[creep.memory.role] || workerMap.harvester
        fn.run(creep)
      } catch {
        console.log('🚨 Failed to perform action for worker')
      }
    }
  }
}
