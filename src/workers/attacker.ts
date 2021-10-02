export default {
  run: function (creep: Creep) {
    if (creep.memory.activeRole !== 'attacker') return
    const hostile = creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS)
    if (hostile) {
      if (creep.attack(hostile) === ERR_NOT_IN_RANGE) {
        creep.moveTo(hostile, { visualizePathStyle: { stroke: '#ffaa00' } })
      }
    } else if (creep.room.controller && !creep.room.controller.my) {
      if (creep.attackController(creep.room.controller) == ERR_NOT_IN_RANGE) {
        creep.moveTo(creep.room.controller)
      }
    } else {
      creep.say('No hostiles')
      throw new Error('No hostile')
    }
  },
  parts: [RANGED_ATTACK, WORK, TOUGH, MOVE],
}
