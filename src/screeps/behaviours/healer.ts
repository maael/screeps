import { Behaviour } from '../../types'

const HealerBehaviour: Behaviour = {
  requiredPart: [HEAL],
  run: function (creep) {
    const damaged = creep.pos.findClosestByPath(FIND_MY_CREEPS, {
      filter: function (ob) {
        return ob.hits < ob.hitsMax
      },
    })
    if (damaged) {
      if (creep.heal(damaged) === ERR_NOT_IN_RANGE) {
        creep.moveTo(damaged, { visualizePathStyle: { stroke: '#ffaa00' } })
      }
    } else {
      creep.say('Nothing to heal')
    }
  },
}

export default HealerBehaviour
