export default {
  run: function (creep: Creep) {
    if (creep.memory.activeRole !== 'defender') return
    const hostile = creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS)
    if (hostile) {
      if (creep.attack(hostile) === ERR_NOT_IN_RANGE) {
        creep.moveTo(hostile, { visualizePathStyle: { stroke: '#ffaa00' } })
      }
    } else {
      creep.say('No hostiles')
      throw new Error('No hostiles')
    }
  },
  parts: [RANGED_ATTACK, WORK, TOUGH, MOVE],
}
