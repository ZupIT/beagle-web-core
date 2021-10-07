/*
 * Copyright 2020 ZUP IT SERVICOS EM TECNOLOGIA E INOVACAO SA
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import DoubleStack from 'beagle-navigator/double-stack'

describe('Double Stack', () => {
  describe('Read operations', () => {
    it('should be empty', () => {
      const doubleStack = DoubleStack.create()
      expect(doubleStack.isEmpty()).toBe(true)
    })

    it('should not be empty', () => {
      const doubleStack = DoubleStack.create([[1]])
      expect(doubleStack.isEmpty()).toBe(false)
    })

    it('should get top item (1 stack, 1 item)', () => {
      const doubleStack = DoubleStack.create([[1]])
      expect(doubleStack.getTopItem()).toBe(1)
    })

    it('should get top item (1 stack, 2 items)', () => {
      const doubleStack = DoubleStack.create([[1, 2]])
      expect(doubleStack.getTopItem()).toBe(2)
    })

    it('should get top item (2 stacks, 5 items)', () => {
      const doubleStack = DoubleStack.create([[1, 2], [3, 4, 5]])
      expect(doubleStack.getTopItem()).toBe(5)
    })

    it('should have single stack', () => {
      const doubleStack = DoubleStack.create([[1, 2, 3]])
      expect(doubleStack.hasSingleStack()).toBe(true)
    })

    it('should not have single stack', () => {
      const doubleStack = DoubleStack.create<number>([[1], [2]])
      expect(doubleStack.hasSingleStack()).toBe(false)
    })

    it('should have single item', () => {
      const doubleStack = DoubleStack.create<number>([[1]])
      expect(doubleStack.hasSingleItem()).toBe(true)
    })

    it('should not have single item (1 stack)', () => {
      const doubleStack = DoubleStack.create([[1, 2]])
      expect(doubleStack.hasSingleItem()).toBe(false)
    })

    it('should not have single item (2 stacks)', () => {
      const doubleStack = DoubleStack.create([[1], [2]])
      expect(doubleStack.hasSingleItem()).toBe(false)
    })

    it('should get a copy of the underlying matrix structure', () => {
      const initial = [[1, 2], [3], [4, 5, 6]]
      const doubleStack = DoubleStack.create(initial)
      expect(doubleStack.asMatrix()).toEqual(initial)
      expect(doubleStack.asMatrix()).not.toBe(initial)
    })
  })

  describe('Item operations', () => {
    it('should push item to an empty structure', () => {
      const doubleStack = DoubleStack.create<number>()
      doubleStack.pushItem(1)
      expect(doubleStack.asMatrix()).toEqual([[1]])
    })

    it('should push item to a single stack', () => {
      const doubleStack = DoubleStack.create([[1, 2]])
      doubleStack.pushItem(3)
      expect(doubleStack.asMatrix()).toEqual([[1, 2, 3]])
    })

    it('should push item to the last stack', () => {
      const doubleStack = DoubleStack.create([[1, 2], [3]])
      doubleStack.pushItem(4)
      expect(doubleStack.asMatrix()).toEqual([[1, 2], [3, 4]])
    })

    it('should do nothing when popping item from an empty structure', () => {
      const doubleStack = DoubleStack.create()
      const removed = doubleStack.popItem()
      expect(removed).toBeUndefined()
      expect(doubleStack.asMatrix()).toEqual([])
    })

    it('should pop item from stack with a single item', () => {
      const doubleStack = DoubleStack.create([[1]])
      const removed = doubleStack.popItem()
      expect(removed).toBe(1)
      expect(doubleStack.asMatrix()).toEqual([])
    })

    it('should pop item from stack with many items', () => {
      const doubleStack = DoubleStack.create([[1, 2], [3], [4, 5, 6]])
      const removed = doubleStack.popItem()
      expect(removed).toBe(6)
      expect(doubleStack.asMatrix()).toEqual([[1, 2], [3], [4, 5]])
    })

    it('should also pop stack when popItem removes the last item of a stack', () => {
      const doubleStack = DoubleStack.create([[1, 2], [3]])
      const removed = doubleStack.popItem()
      expect(removed).toBe(3)
      expect(doubleStack.asMatrix()).toEqual([[1, 2]])
    })

    it('should not pop anything when popUntil is used on an empty structure', () => {
      const doubleStack = DoubleStack.create()
      const removed = doubleStack.popUntil(() => true)
      expect(removed).toEqual([])
      expect(doubleStack.asMatrix()).toEqual([])
    })

    it(
      "should not pop anything when popUntil's predicate returns true for the last item",
      () => {
        const doubleStack = DoubleStack.create([[1, 2, 3]])
        const removed = doubleStack.popUntil(i => i === 3)
        expect(removed).toEqual([])
        expect(doubleStack.asMatrix()).toEqual([[1, 2, 3]])
      },
    )

    it(
      "should not pop anything when popUntil's predicate returns false for every item",
      () => {
        const doubleStack = DoubleStack.create([[1, 2, 3]])
        const removed = doubleStack.popUntil(i => i > 3)
        expect(removed).toEqual([])
        expect(doubleStack.asMatrix()).toEqual([[1, 2, 3]])
      },
    )

    it("should pop last item when using popUntil", () => {
      const doubleStack = DoubleStack.create([[1, 2, 3]])
      const removed = doubleStack.popUntil(i => i === 2)
      expect(removed).toEqual([3])
      expect(doubleStack.asMatrix()).toEqual([[1, 2]])
    })

    it("should pop 3 last items when using popUntil", () => {
      const doubleStack = DoubleStack.create([[1, 2, 3, 4]])
      const removed = doubleStack.popUntil(i => i === 1)
      expect(removed).toEqual([2, 3, 4])
      expect(doubleStack.asMatrix()).toEqual([[1]])
    })
  })


  describe('Stack operations', () => {
    it('should push stack to an empty structure', () => {
      const doubleStack = DoubleStack.create<number>()
      doubleStack.pushStack(1)
      expect(doubleStack.asMatrix()).toEqual([[1]])
    })

    it('should push stack to structure with 1 stack', () => {
      const doubleStack = DoubleStack.create([[1]])
      doubleStack.pushStack(2)
      expect(doubleStack.asMatrix()).toEqual([[1], [2]])
    })

    it('should do nothing when popping stack from empty structure', () => {
      const doubleStack = DoubleStack.create()
      const removed = doubleStack.popStack()
      expect(removed).toBeUndefined()
      expect(doubleStack.asMatrix()).toEqual([])
    })

    it('should pop stack from structure with single stack', () => {
      const doubleStack = DoubleStack.create([[1, 2]])
      const removed = doubleStack.popStack()
      expect(removed).toEqual([1, 2])
      expect(doubleStack.asMatrix()).toEqual([])
    })

    it('should pop stack from structure with 2 stacks', () => {
      const doubleStack = DoubleStack.create([[1, 2], [3]])
      const removed = doubleStack.popStack()
      expect(removed).toEqual([3])
      expect(doubleStack.asMatrix()).toEqual([[1, 2]])
    })

    it('should resetStack of empty structure', () => {
      const doubleStack = DoubleStack.create<number>()
      doubleStack.resetStack(1)
      expect(doubleStack.asMatrix()).toEqual([[1]])
    })

    it('should resetStack', () => {
      const doubleStack = DoubleStack.create([[1], [2, 3], [4, 5, 6]])
      doubleStack.resetStack(7)
      expect(doubleStack.asMatrix()).toEqual([[1], [2, 3], [7]])
    })

    it('should reset empty structure', () => {
      const doubleStack = DoubleStack.create<number>()
      doubleStack.reset(1)
      expect(doubleStack.asMatrix()).toEqual([[1]])
    })

    it('should reset', () => {
      const doubleStack = DoubleStack.create([[1], [2, 3], [4, 5, 6]])
      doubleStack.reset(7)
      expect(doubleStack.asMatrix()).toEqual([[7]])
    })
  })
})
