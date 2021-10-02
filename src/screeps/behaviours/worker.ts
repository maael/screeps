import { Behaviour } from '../../types'

const WorkerBehaviour: Behaviour = {
  requiredPart: [WORK],
  run: function (creep, state) {
    // TODO: Add repairs
    const { upgraders, builders, harvesters } = Memory.workerAllocations
    if (upgraders.includes(creep.name) || Object.keys(upgraders).length < 1) {
      if (!upgraders.includes(creep.name)) upgraders.push(creep.name)
      upgrade(creep)
    } else if (builders.includes(creep.name) || (state.building && Object.keys(builders).length < 2)) {
      if (!builders.includes(creep.name)) builders.push(creep.name)
      build(creep)
    } else if (
      harvesters.includes(creep.name) ||
      Object.keys(harvesters).length < creep.room.energyCapacityAvailable / 50
    ) {
      if (!harvesters.includes(creep.name)) harvesters.push(creep.name)
      harvest(creep)
    } else {
      if (!upgraders.includes(creep.name)) upgraders.push(creep.name)
      upgrade(creep)
    }
  },
}

function harvest(creep: Creep) {
  if (creep.memory.type !== 'worker') return
  creep.say('harvesting')
  if (creep.store.getFreeCapacity() > 0) {
    const sources = creep.room.find(FIND_SOURCES)
    if (creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
      creep.moveTo(sources[0], { visualizePathStyle: { stroke: '#ffaa00' } })
    }
  } else {
    const targets = creep.room.find(FIND_STRUCTURES, {
      filter: (structure) => {
        return (
          (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) &&
          structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0
        )
      },
    })
    if (targets.length > 0) {
      if (creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
        creep.moveTo(targets[0], { visualizePathStyle: { stroke: '#ffffff' } })
      }
    } else {
      build(creep)
    }
  }
}

function upgrade(creep: Creep) {
  if (creep.memory.type !== 'worker') return
  creep.say('upgrading')
  if (creep.memory.upgrading && creep.store[RESOURCE_ENERGY] == 0) {
    creep.memory.upgrading = false
    creep.say('🔄 harvest')
  }
  if (!creep.memory.upgrading && creep.store.getFreeCapacity() == 0) {
    creep.memory.upgrading = true
    creep.say('⚡ upgrade')
  }

  if (creep.memory.upgrading) {
    if (creep.upgradeController(creep.room.controller!) == ERR_NOT_IN_RANGE) {
      creep.moveTo(creep.room.controller!, { visualizePathStyle: { stroke: '#ffffff' } })
    }
  } else {
    const sources = creep.room.find(FIND_SOURCES)
    if (creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
      creep.moveTo(sources[0], { visualizePathStyle: { stroke: '#ffaa00' } })
    }
  }
}

function build(creep: Creep) {
  if (creep.memory.type !== 'worker') return
  creep.say('building')
  if (Object.keys(Game.constructionSites).length < 1) {
    creep.say('Nothing to build')
    return
  }
  if (creep.memory.building && creep.store[RESOURCE_ENERGY] == 0) {
    creep.memory.building = false
    creep.say('🔄 harvest')
  }
  if (!creep.memory.building && creep.store.getFreeCapacity() == 0) {
    creep.memory.building = true
    creep.say('🚧 build')
  }

  if (creep.memory.building) {
    const targets = creep.room.find(FIND_CONSTRUCTION_SITES)
    if (targets.length) {
      if (creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
        creep.moveTo(targets[0], { visualizePathStyle: { stroke: '#ffffff' } })
      }
    } else {
      upgrade(creep)
    }
  } else {
    const sources = creep.room.find(FIND_SOURCES)
    if (creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
      creep.moveTo(sources[0], { visualizePathStyle: { stroke: '#ffaa00' } })
    }
  }
}

export default WorkerBehaviour
