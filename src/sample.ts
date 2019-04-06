import { ReactiveBus } from './ReactiveBus';
import { TopicMatcher } from './TopicMatcher';
import { Message1, Message2 } from './samples/SampleMessages';

export class Startup {

  private bus: ReactiveBus;

  async testMessageBus() {

    this.bus = new ReactiveBus(new TopicMatcher('.'));

    this.bus.subscribe<string>('t1', x => {
      console.log(x);
    });

    this.bus.publish('t1', 't1');

    const sub = this.bus.subscribe(Message1, async data => {
      console.log(`1 as Message1 received - ${data.payload}`);
      sub.unsubscribe();
    });

    this.bus.asObservable(Message2)
      .subscribe(o => {
        console.log(`2: ${o.payload.value}`);
      });

    await this.bus.publishAsync(new Message1('CHA1', 'OHA'));

    const m2 = this.bus.publishAsync(new Message2('value.toString()'));
    await m2;
    console.log('message2 published');

    const all = Promise.all([
      this.send1(),
      this.send2()
    ]);

    console.log('all pusblished');
    await all;
    console.log('all done');

    console.log('programm finished');
  }

  async send1() {
    await this.delay(3000);
    await this.bus.publishAsync(new Message1('111', 'send1-111'));
    console.log('send1 done');
  }

  async send2() {
    await this.delay(10);
    await this.bus.publishAsync(new Message2('send2-112'));
    console.log('send2 done');
  }

  async delay(ms: number): Promise<void> {
    // tslint:disable-next-line: no-string-based-set-timeout
    return new Promise<void>(resolve => setTimeout(resolve, ms));
  }

}

const startup = new Startup();
// tslint:disable-next-line: no-floating-promises
startup.testMessageBus();
