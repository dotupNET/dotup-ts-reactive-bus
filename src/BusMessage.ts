import { IBusMessage } from './IBusMessage';

export class BusMessage<T> implements IBusMessage<T> {
  constructor(topic: string) {
    this.topic = topic;
  }
  topic: string;
  payload: T;
}
