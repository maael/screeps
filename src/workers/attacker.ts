export default {
  run: function (creep: Creep) {
    if (creep.memory.activeRole !== 'attacker') return
    const hostile = creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS)
    if (hostile) {
      if (creep.attack(hostile) === ERR_NOT_IN_RANGE) {
        creep.moveTo(hostile)
      }
    } else if (creep.room.controller && !creep.room.controller.my) {
      if (creep.attackController(creep.room.controller) == ERR_NOT_IN_RANGE) {
        creep.moveTo(creep.room.controller)
      }
    } else {
      throw new Error('No hostile')
    }
  },
  parts: [ATTACK, WORK, TOUGH, MOVE],
}
