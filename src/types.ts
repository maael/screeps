export interface RoomState {
  fighting: boolean
  building: boolean
  upgrading: boolean
  repairing: boolean
}

export type BehaviourRun = (creep: Creep, roomState: RoomState) => void

export interface Behaviour {
  requiredPart: BodyPartConstant[]
  run: BehaviourRun
}
