import { Opaque } from 'type-fest'

export type RecordID = string

export interface IRecordWithID {
  id: RecordID
}

export type Email = Opaque<string, 'email'>

export const makeEmail = (str: string): Email => {
  // perform some validation if needed
  return str as Email
}
