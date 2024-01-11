export class SetExIndex extends Set {
  array;

  constructor(iterable = []) {
    super(iterable)
    this.array = iterable;
  }

  add(value) {
    if (this.has(value)) return;
    super.add(value);
    this.array.push(value);
  }

  clear() {
    super.clear();
    this.array.length = 0;
  }

  delete(value) {
    if (!this.has(value)) return false;

    super.delete(value);
    const result = this.entries();
    this.array = result;

    return true;
  }

  deleteByIndex(index) {
    const target = this.array[index];
    super.delete(target);
    this.array.splice(index, 1);

    return target;
  }

  get(index) {
    return this.array[index];
  }
}
