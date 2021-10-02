export default {
  run: function (creep: Creep) {
    if (creep.memory.activeRole !== 'defender') return
    const hostile = creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS)
    if (hostile) {
      if (creep.attack(hostile) === ERR_NOT_IN_RANGE) {
        creep.moveTo(hostile)
      }
    } else {
      throw new Error('No hostiles')
    }
  },
  parts: [ATTACK, WORK, TOUGH, MOVE],
}
