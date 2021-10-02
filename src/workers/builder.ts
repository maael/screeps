export default {
  run: function (creep: Creep) {
    if (creep.memory.activeRole !== 'builder') return
  },
  parts: [WORK, CARRY, MOVE],
}
