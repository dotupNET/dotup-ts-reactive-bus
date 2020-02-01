import { Observable, Subject, Subscription } from 'rxjs';
// tslint:disable-next-line: no-submodule-imports
import { filter } from 'rxjs/operators';
import { BusMessage } from './BusMessage';
import { IBusMessage } from './IBusMessage';
import { IReactiveBus } from './IReactiveBus';
import { ITopicMatcher } from './ITopicMatcher';
import { getLogger } from 'log4js';

const logger = getLogger('ReactiveBus');

export class ReactiveBus implements IReactiveBus {
  // tslint:disable-next-line: no-any
  private readonly subjectBus: Subject<any>;
  private readonly topicMatcher: ITopicMatcher;

  constructor(topicMatcher: ITopicMatcher) {
    logger.info('ReactiveBus created');
    // tslint:disable-next-line: no-any
    this.subjectBus = new Subject<any>();
    this.topicMatcher = topicMatcher;
  }

  publish<T>(message: BusMessage<T>): void;
  publish<T>(message: T, topic: string): void;
  publish<T>(message: T, topic?: string): void {
    let msg: IBusMessage<T>;

    if (message instanceof BusMessage) {
      msg = message;
      if (msg.topic === undefined) {
        throw new Error('Topic not set');
      }
    } else {
      // Create bus message
      const top = topic === undefined ? message.constructor.name : topic;
      if (top === undefined) {
        throw new Error('Topic not set');
      }
      msg = new BusMessage(top);
      msg.payload = message;
    }

    this.subjectBus.next(msg);
    // this.logger.Debug(`message <${msg.topic}> published`);
  }

  publishAsync<T>(message: BusMessage<T>): Promise<void>;
  publishAsync<T>(message: T, topic?: string): Promise<void>;
  async publishAsync<T>(message: T, topic?: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      try {
        this.publish(message, topic);
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  }

  // tslint:disable-next-line: no-any
  subscribe<T>(topic: (new (...args: any[]) => T) | string, handler: (message: IBusMessage<T>) => void): Subscription {
    const result = this.asObservable(topic);

    return result.subscribe(handler);
  }

  // tslint:disable-next-line: no-any
  subscribeAsync<T>(topic: (new (...args: any[]) => T) | string, handler: (message: IBusMessage<T>) => Promise<void>): Subscription {
    const result = this.asObservable(topic);

    return result.subscribe(handler);
  }

  // tslint:disable-next-line: no-any
  asObservable<T>(topic: (new (...args: any[]) => T) | string): Observable<IBusMessage<T>> {
    // tslint:disable-next-line: no-any : no-unsafe-any
    const t: string = typeof (topic) === 'string' ? topic : (<any>topic).name;
    // this.logger.Debug(`new subscrition for ${topic}`, 'subscribe');

    return this.subjectBus
      .pipe(
        filter<IBusMessage<T>>(m => this.topicMatcher.matchesMqtt(m.topic, t))
      );

  }

}
