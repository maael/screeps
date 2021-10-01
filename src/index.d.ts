interface BaseCreepMemory {
  role: 'harvester' | 'upgrader'
}

interface HarvesterCreepMemory extends BaseCreepMemory {
  role: 'harvester'
}

interface UpgraderCreepMemory extends BaseCreepMemory {
  role: 'upgrader'
  upgrading: boolean
}

declare type CreepMemory = HarvesterCreepMemory | UpgraderCreepMemory
