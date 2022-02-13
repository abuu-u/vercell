export enum MessageType {
  sentGlobal,
  sentPersonal,
  recivedGlobal,
  recivedPersonal,
  recivedRejected,
}

export interface Message {
  id: number
  src: string
  sizeInBytes: number
  sentTime: Date
  type: MessageType
}

export type MessageRes = Omit<Message, 'sentTime'> & { sentTime: string }
