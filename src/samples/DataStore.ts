export class AppDataStore {
  constructor(initialState?: Partial<AppDataStore>) {
    this.Part1 = new Part1();
    this.Part2 = new Part2();
    this.Part11 = new Part1();
    this.Part22 = new Part2();
  }

  public Part1: Part1;
  public Part2: Part2

  public Part11: Part1;
  public Part22: Part2

  myMethod<T, K extends keyof T>(model: T, key: K) {
    const value = model[key];
    //...
  }
}

export class Part1 {
  constructor(name?: string) {
    this.name = name;
  }
  name: string;
  age: number
}


export class Part2 {
  constructor(name?: string) {
    this.name = name;
  }
  name: string;
  isLoggedIn: boolean
}


export const DataStore = new AppDataStore();
