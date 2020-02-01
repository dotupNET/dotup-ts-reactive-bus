import { ReactiveBus } from './ReactiveBus';
import { TopicMatcher } from './TopicMatcher';
import { debounce } from 'rxjs/operators';
import { interval } from 'rxjs';
import { DataStore, Part1, Part2, AppDataStore } from './samples/DataStore';
import { Message1 } from './samples/SampleMessages';

function get<
  T,
  P1 extends keyof NonNullable<T>
>(obj: T, prop1: P1): NonNullable<T>[P1] | undefined;

function get<
  T,
  P1 extends keyof NonNullable<T>,
  P2 extends keyof NonNullable<NonNullable<T>[P1]>
>(obj: T, prop1: P1, prop2: P2): NonNullable<NonNullable<T>[P1]>[P2] | undefined;

function get<
  T,
  P1 extends keyof NonNullable<T>,
  P2 extends keyof NonNullable<NonNullable<T>[P1]>,
  P3 extends keyof NonNullable<NonNullable<NonNullable<T>[P1]>[P2]>
>(obj: T, prop1: P1, prop2: P2, prop3: P3): NonNullable<NonNullable<NonNullable<T>[P1]>[P2]>[P3] | undefined;

// ...and so on...

function get(obj: any, ...props: string[]): any {
  return obj && props.reduce(
    (result, prop) => result == null ? undefined : result[prop],
    obj
  );
}

export class Startup {

  private bus: ReactiveBus;

  async testMessageBus() {

    this.bus = new ReactiveBus(new TopicMatcher('.'));

    this.bus.subscribe(Part1, x => {
      console.log("Part1");
      console.log(x);
    });

    this.bus.publish('t1', 't1');

    // const sub = this.bus.subscribe(Message1, async data => {
    //   console.log(`1 as Message1 received - ${data.payload}`);
    //   sub.unsubscribe();
    // });

    this.bus.asObservable(Part2)
      // .pipe(
      //   debounce(() => interval(1000))
      // )
      .subscribe(o => {
        console.log(`Part 2: ${o.payload.name}`);
      });

    // const x = new AppDataStore();
    // get(x, "Part1", "age")
    // DataStore.myMethod<AppDataStore>(undefined, "Part2")

    await this.bus.publishAsync(new Message1('CHA1', 'OHA'));

    const m2 = this.bus.publishAsync(new Part1('p1'));
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
    await this.bus.publishAsync(new Part1('111'));
    console.log('send1 done');
  }

  async send2() {
    await this.delay(10);
    await this.bus.publishAsync(new Part2('send2-112'));
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
