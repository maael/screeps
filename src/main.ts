import harvester from './workers/harvester'
import upgrader from './workers/upgrader'

export function loop() {
  for (const name in Memory.creeps) {
    if (!Game.creeps[name]) {
      delete Memory.creeps[name]
      console.log('Clearing non-existing creep memory:', name)
    }
  }

  const harvesters = Object.values(Game.creeps).filter((creep) => creep.memory.role == 'harvester')
  const canSpawn = Game.spawns['Spawn1'].store[RESOURCE_ENERGY] > 150
  const upgraders = Object.values(Game.creeps).filter((creep) => creep.memory.role == 'upgrader')
  console.log('Harvesters: ' + harvesters.length)

  if (Game.spawns['Spawn1'].spawning) {
    const spawningCreep = Game.creeps[Game.spawns['Spawn1'].spawning.name]
    Game.spawns['Spawn1'].room.visual.text(
      '🛠️' + spawningCreep.memory.role,
      Game.spawns['Spawn1'].pos.x + 1,
      Game.spawns['Spawn1'].pos.y,
      { align: 'left', opacity: 0.8 }
    )
  }

  if (canSpawn) {
    if (harvesters.length < 2) {
      const newName = 'Harvester' + Game.time
      console.log('Spawning new harvester: ' + newName)
      Game.spawns['Spawn1'].spawnCreep([WORK, CARRY, MOVE], newName, { memory: { role: 'harvester' } })
    } else if (upgraders.length < 1) {
      const newName = 'Upgrader' + Game.time
      console.log('Spawning new upgrader: ' + newName)
      Game.spawns['Spawn1'].spawnCreep([WORK, CARRY, MOVE], newName, { memory: { role: 'upgrader', upgrading: false } })
    }
  }

  for (const name in Game.creeps) {
    const creep = Game.creeps[name]
    if (creep.memory.role == 'harvester') {
      harvester.run(creep)
    }
    if (creep.memory.role == 'upgrader') {
      upgrader.run(creep)
    }
  }
}
