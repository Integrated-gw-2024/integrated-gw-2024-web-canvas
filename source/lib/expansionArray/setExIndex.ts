export class SetExIndex<T> extends Set<T> {
  array: T[];

  constructor(iterable: T[] = []) {
    super(iterable);
    this.array = iterable;
  }

  add(value: T): this {
    if (this.has(value)) return this;
    super.add(value);
    this.array.push(value);

    return this;
  }

  clear(): void {
    super.clear();
    this.array.length = 0;
  }

  delete(value: T): boolean {
    if (!this.has(value)) return false;

    super.delete(value);
    const result = this.entries();
    this.array = Array.from(result, ([, val]) => val);

    return true;
  }

  deleteByIndex(index: number): T {
    const target = this.array[index];
    super.delete(target);
    this.array.splice(index, 1);

    return target;
  }

  get(index: number): T | undefined {
    return this.array[index];
  }
}