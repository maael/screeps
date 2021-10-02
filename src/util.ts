import { RoomState } from './types'

export function calculateCreepCost(parts: BodyPartConstant[]) {
  return parts.reduce((acc, p) => acc + BODYPART_COST[p], 0)
}

export function cleanupCreepMemory() {
  for (const name in Memory.creeps) {
    if (!Game.creeps[name]) {
      Memory.workerAllocations = {
        harvesters: Memory.workerAllocations?.harvesters.filter((i) => i !== name) || [],
        builders: Memory.workerAllocations?.builders.filter((i) => i !== name) || [],
        upgraders: Memory.workerAllocations?.upgraders.filter((i) => i !== name) || [],
      }
      delete Memory.creeps[name]
      console.log('Clearing non-existing creep memory:', name)
    }
  }
}

const roomStates: { [k: string]: RoomState } = {}

export function getRoomState(room: Room) {
  if (roomStates[room.name]) return roomStates[room.name]
  const isControlled = room.controller && room.controller.my
  const hasHostileCreeps = room.find(FIND_HOSTILE_CREEPS).length
  const myStructures = room.find(FIND_MY_STRUCTURES, {
    filter: function (ob) {
      return ob.hits < ob.hitsMax
    },
  }).length
  roomStates[room.name] = {
    fighting: !!((isControlled && hasHostileCreeps) || !isControlled),
    building: Object.keys(Game.constructionSites).length > 0,
    upgrading: !!(room.controller && room.controller.my && room.controller.level < 9),
    repairing: myStructures > 0,
  }
  return roomStates[room.name]
}

export function findBuildableNear(room: Room, x: number, y: number, radius: number) {
  const spaces = room.lookAtArea(x - radius, y - radius, x + radius, y + radius)
  let freeSpace
  for (const x in spaces) {
    for (const y in spaces[x]) {
      const entries = spaces[x][y]
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
  return freeSpace
}
