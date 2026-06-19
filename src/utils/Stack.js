export class Stack {
  constructor(initialItems = []) {
    this.items = [...initialItems];
  }

  push(item) {
    this.items.push(item);
  }

  pop() {
    if (this.isEmpty()) return null;
    return this.items.pop();
  }

  peek() {
    if (this.isEmpty()) return null;
    return this.items[this.items.length - 1];
  }

  isEmpty() {
    return this.items.length === 0;
  }

  size() {
    return this.items.length;
  }

  clear() {
    this.items = [];
  }

  toArray() {
    // Returns elements from top to bottom (most recent state first — React history order)
    return [...this.items].reverse();
  }
  
  toBottomUpArray() {
    // Returns elements from bottom to top
    return [...this.items];
  }
}
