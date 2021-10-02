import { calculateCreepCost } from '~/util'

const worker = [WORK, CARRY, MOVE]
const fighter = [RANGED_ATTACK, TOUGH, MOVE]
const healer = [HEAL, MOVE]

export default {
  healer: {
    parts: healer,
    cost: calculateCreepCost(healer),
    getName: () => `Healer:${Game.time}`,
  },
  worker: {
    parts: worker,
    cost: calculateCreepCost(worker),
    getName: () => `Worker:${Game.time}`,
  },
  fighter: {
    parts: fighter,
    cost: calculateCreepCost(fighter),
    getName: () => `Fighter:${Game.time}`,
  },
}
