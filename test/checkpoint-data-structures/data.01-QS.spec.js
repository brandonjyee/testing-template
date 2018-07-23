'use strict';
/* global Queue Stack */
/* eslint-env jasmine */

// Data Structures Review Exercise

// For Queues and Stacks: don't use array methods push/pop/shift/unshift functions, nor any other Array.prototype methods, nor .length!

// You may use an Object or Array to store your data and keep head and tail pointers (variables) that change when functions like enqueue and dequeue are called.

describe('A stack', function () {

  let stack, uniqueObj = { id: 456 };
  beforeEach(() => {
    stack = new Stack();
  });

  it('adds and removes an item', function () {
    stack.add(uniqueObj);
    expect(stack.remove()).toBe(uniqueObj);
  });

  it('returns `undefined` on underflow (empty)', function () {
    expect(stack.remove()).toBe(undefined);
    stack.add(uniqueObj);
    expect(stack.remove()).toBe(uniqueObj);
    expect(stack.remove()).toBe(undefined);
  });

  // LIFO: Last In, First Out
  it('adds and removes three items in a LIFO way', function () {
    stack.add(5).add(uniqueObj).add('fullstack');
    expect(stack.remove()).toBe('fullstack');
    expect(stack.remove()).toBe(uniqueObj);
    expect(stack.remove()).toBe(5);
    expect(stack.remove()).toBe(undefined);
  });

  it('can handle interspersed add and remove', function () {
    stack.add(1);
    expect(stack.remove()).toBe(1);
    stack.add(2).add(3);
    expect(stack.remove()).toBe(3);
    stack.add(4);
    expect(stack.remove()).toBe(4);
    expect(stack.remove()).toBe(2);
    expect(stack.remove()).toBe(undefined);
  });

  // no globals!
  it('adds and removes its own items', function () {
    const s2 = new Stack();
    stack.add('fullstack');
    s2.add('JavaScript');
    expect(stack.remove()).toBe('fullstack');
    expect(stack.remove()).toBe(undefined);
    expect(s2.remove()).toBe('JavaScript');
    expect(s2.remove()).toBe(undefined);
  });

});

describe('A queue', function () {

  // pending('This is an extra-credit suite. Remove this line to try it.');

  let queue, uniqueObj = { id: 123 };
  beforeEach(() => {
    queue = new Queue();
  });

  it('adds and removes an item', function () {
    queue.add(uniqueObj);
    expect(queue.remove()).toBe(uniqueObj);
  });

  it('returns `undefined` on underflow (empty)', function () {
    expect(queue.remove()).toBe(undefined);
    queue.add(uniqueObj);
    expect(queue.remove()).toBe(uniqueObj);
    expect(queue.remove()).toBe(undefined);
  });

  // FIFO: First In, First Out
  it('adds and removes three items in a FIFO way', function () {
    queue.add(5).add(uniqueObj).add('fullstack');
    expect(queue.remove()).toBe(5);
    expect(queue.remove()).toBe(uniqueObj);
    expect(queue.remove()).toBe('fullstack');
    expect(queue.remove()).toBe(undefined);
  });

  it('can handle interspersed add and remove', function () {
    queue.add(1);
    expect(queue.remove()).toBe(1);
    queue.add(2).add(3);
    expect(queue.remove()).toBe(2);
    queue.add(4);
    expect(queue.remove()).toBe(3);
    expect(queue.remove()).toBe(4);
    expect(queue.remove()).toBe(undefined);
  });

  // no globals!
  it('adds and removes its own items', function () {
    const q2 = new Queue();
    queue.add('fullstack');
    q2.add('JavaScript');
    expect(q2.remove()).toBe('JavaScript');
    expect(q2.remove()).toBe(undefined);
    expect(queue.remove()).toBe('fullstack');
    expect(queue.remove()).toBe(undefined);
  });

});
