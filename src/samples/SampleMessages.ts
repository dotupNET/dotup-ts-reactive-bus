export class Message1 {
  constructor(public readonly channel: string, public readonly payload: string) { }
}

export class Message2 {
  constructor(public readonly value: string) { }
}