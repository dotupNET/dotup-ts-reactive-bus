import { IBusMessage } from './IBusMessage';

export class BusMessage<T> implements IBusMessage<T> {
  constructor(topic: string) {
    this.topic = topic;
    this.payload = <T>{};
  }
  topic: string;
  payload: T;
}
