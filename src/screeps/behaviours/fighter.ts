import { Behaviour } from '../../types'

const FighterBehaviour: Behaviour = {
  requiredPart: [ATTACK, RANGED_ATTACK],
  run: function (creep) {
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
    }
  },
}

export default FighterBehaviour
