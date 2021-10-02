import parts from './screeps/partConfigurations'
import * as behaviours from './screeps/behaviours'
import { cleanupCreepMemory, findBuildableNear, getRoomState } from './util'
import { showSpawning } from './visual'

Memory.workerAllocations = {
  builders: [],
  upgraders: [],
  harvesters: [],
}

export function loop() {
  cleanupCreepMemory()

  const spawn = Game.spawns['Spawn1']
  const spawnRoomState = getRoomState(spawn.room)
  const spawnCreeps = spawn.room.find(FIND_MY_CREEPS)
  const capabilities = spawnCreeps.reduce(
    (acc, c) => {
      const f = behaviours.fighter.requiredPart.some((p) => c.getActiveBodyparts(p)) ? 1 : 0
      const w = behaviours.worker.requiredPart.some((p) => c.getActiveBodyparts(p)) ? 1 : 0
      const h = behaviours.healer.requiredPart.some((p) => c.getActiveBodyparts(p)) ? 1 : 0
      return {
        fighters: acc.fighters + f,
        workers: acc.workers + w,
        healers: acc.healers + h,
      }
    },
    { fighters: 0, workers: 0, healers: 0 }
  )

  if (spawnRoomState.fighting && capabilities.fighters === 0 && spawn.room.energyAvailable > parts.fighter.cost) {
    spawn.spawnCreep(parts.fighter.parts, parts.fighter.getName(), { memory: { type: 'fighter' } })
  }
  if (spawnRoomState.repairing && capabilities.healers === 0 && spawn.room.energyAvailable > parts.healer.cost) {
    spawn.spawnCreep(parts.healer.parts, parts.healer.getName(), { memory: { type: 'healer' } })
  }
  if (capabilities.workers < 5 && spawn.room.energyAvailable > parts.worker.cost) {
    spawn.spawnCreep(parts.worker.parts, parts.worker.getName(), { memory: { type: 'worker' } })
  }
  showSpawning(spawn)

  for (const name in Game.creeps) {
    const creep = Game.creeps[name]
    behaviours[creep.memory.type].run(creep, spawnRoomState)
  }

  if (spawn.room.controller?.my && spawn.room.controller?.level > 1 && !spawnRoomState.building) {
    const freeSpace = findBuildableNear(spawn.room, spawn.pos.x, spawn.pos.y, 2)
    if (freeSpace) {
      spawn.room.createConstructionSite(freeSpace.x, freeSpace.y, STRUCTURE_EXTENSION)
    }
  }
}
