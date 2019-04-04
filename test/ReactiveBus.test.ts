// tslint:disable: newline-per-chained-call
import { expect } from 'chai';
import { Subscription } from 'rxjs';
import { BusMessage, ReactiveBus, TopicMatcher } from '../src/index';
import { Message1 } from '../src/samples/SampleMessages';

describe('ReactiveBus', () => {


  it('should create an instance', () => {
    const bus = new ReactiveBus(new TopicMatcher('/'));
    expect(bus).instanceOf(ReactiveBus);
  });

  it('should return subscription', () => {
    const bus = new ReactiveBus(new TopicMatcher('/'));
    const result = bus.subscribe(ReactiveBus, data => { });
    expect(result).instanceOf(Subscription);
    result.unsubscribe();
  });

  it('should receive message 1', async () => {
    const bus = new ReactiveBus(new TopicMatcher('/'));
    const result = bus.subscribe(Message1, msg => {
      expect(msg).instanceOf(BusMessage);
      expect(msg.payload).instanceOf(Message1);
    });
    const m1 = new Message1('CH', 'PAY');
    await bus.publishAsync(m1);
    result.unsubscribe();
  });

  it('should receive as observable', async () => {
    const bus = new ReactiveBus(new TopicMatcher('/'));
    const observable = bus.asObservable(Message1);
    const subscription = observable.subscribe(data => {
      const msg = new BusMessage<Message1>('Message1');
      msg.payload = new Message1('CH', 'PAY');
      expect(data).instanceOf(msg);
    });
    const m1 = new Message1('CH', 'PAY');
    await bus.publishAsync(m1);
    subscription.unsubscribe();
  });

});
