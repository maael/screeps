interface BaseCreepMemory {
  type: 'fighter' | 'healer' | 'worker'
}

interface FighterCreepMemory extends BaseCreepMemory {
  type: 'fighter'
}

interface HealerCreepMemory extends BaseCreepMemory {
  type: 'healer'
}

interface WorkerCreepMemory extends BaseCreepMemory {
  type: 'worker'
  building?: boolean
  upgrading?: boolean
}

declare type CreepMemory = HealerCreepMemory | WorkerCreepMemory | FighterCreepMemory

declare type RoomMemory = {
  workerAllocations?: {
    harvesters: string[]
    builders: string[]
    upgraders: string[]
  }
}

interface Memory {
  creeps: { [name: string]: CreepMemory }
  powerCreeps: { [name: string]: PowerCreepMemory }
  flags: { [name: string]: FlagMemory }
  rooms: { [name: string]: RoomMemory }
  spawns: { [name: string]: SpawnMemory }
  workerAllocations: {
    harvesters: string[]
    builders: string[]
    upgraders: string[]
  }
}

declare const Memory: Memory
