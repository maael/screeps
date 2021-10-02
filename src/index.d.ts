interface BaseCreepMemory {
  role: 'harvester' | 'upgrader' | 'builder'
  activeRole?: 'attacker' | 'defender' | 'harvester' | 'upgrader' | 'builder'
}

interface BuilderCreepMemory extends BaseCreepMemory {
  role: 'builder'
  activeRole: 'builder'
  building: boolean
}

interface HarvesterCreepMemory extends BaseCreepMemory {
  role: 'harvester'
  activeRole: 'harvester'
}

interface DefenderCreepMemory extends BaseCreepMemory {
  activeRole: 'defender'
}

interface AttackerCreepMemory extends BaseCreepMemory {
  activeRole: 'attacker'
}

interface UpgraderCreepMemory extends BaseCreepMemory {
  role: 'upgrader'
  activeRole: 'upgrader'
  upgrading: boolean
}

declare type CreepMemory =
  | HarvesterCreepMemory
  | UpgraderCreepMemory
  | DefenderCreepMemory
  | AttackerCreepMemory
  | BuilderCreepMemory
