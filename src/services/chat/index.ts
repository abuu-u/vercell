export enum AudioType {
  sentGlobal,
  sentPersonal,
  sentRequest,
  recivedGlobal,
  recivedPersonal,
  recivedRequest,
  recivedRejected,
  recivedRejectedRequest,
}

type AudioTypeRes =
  | 'greeting'
  | 'regular'
  | 'rejected'
  | 'request'
  | 'rejected-request'

export interface SendCommonArgs {
  audio: Blob
}

export interface SendRequestArgs {
  audio: Blob
  id: number
}

export interface AudioRes {
  id: number
  audioType: AudioTypeRes
  audioLink: string
  createdDate: string
  sent: boolean
}

export class Audio {
  id: number

  src: string

  sizeInBytes: number

  sentTime: Date

  type: AudioType

  constructor({ id, audioType, audioLink, createdDate, sent }: AudioRes) {
    let type: AudioType

    switch (audioType) {
      case 'greeting':
        type = sent ? AudioType.sentGlobal : AudioType.recivedGlobal
        break

      case 'regular':
        type = sent ? AudioType.sentPersonal : AudioType.recivedPersonal
        break

      case 'rejected':
        type = AudioType.recivedRejected
        break

      case 'rejected-request':
        type = AudioType.recivedRejectedRequest
        break

      // request
      default:
        type = sent ? AudioType.sentRequest : AudioType.recivedRequest
        break
    }

    this.id = id
    this.src = `${process.env.API_BASE_URL ?? ''}/${audioLink}`
    // Todo: remove or get from Res
    this.sizeInBytes = 10000
    this.sentTime = new Date(createdDate)
    this.type = type
  }

  static fromArray(data: AudioRes[]) {
    return data.map((it) => new Audio(it))
  }
}
