export function showSpawning(spawn: StructureSpawn) {
  if (spawn.spawning) {
    const spawningCreep = Game.creeps[spawn.spawning.name]
    spawn.room.visual.text('🛠️' + spawningCreep.memory.type, spawn.pos.x + 1, spawn.pos.y, {
      align: 'left',
      opacity: 0.8,
    })
  }
}
