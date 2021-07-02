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

import { clone } from 'beagle-tree/manipulation'
import { forEach, iterator, replaceEach } from 'beagle-tree/iteration'
import { createFormTree, createListViewTree } from './iteration.mock'

describe('Beagle Tree: iteration', () => {
  describe('Beagle Tree: iteration: forEach', () => {
    it('should iterate over all components', () => {
      const { tree, order } = createFormTree()
      const iteratee = jest.fn()
      forEach(tree, iteratee)
      expect(iteratee).toHaveBeenCalledTimes(order.length)
    })

    it('should iterate in the correct order', () => {
      const { tree, order } = createFormTree()
      let next = 0
      forEach(tree, (component, index) => {
        expect(index).toBe(next++)
        expect(component).toBe(order[index])
      })
    })

    it('should not iterate over list-view\'s template', () => {
      const { tree, order } = createListViewTree()
      let next = 0
      forEach(tree, (component, index) => {
        expect(index).toBe(next++)
        expect(component).toBe(order[index])
      })
    })

    it('should iterate over a tree with a single component', () => {
      const tree = { _beagleComponent_: 'container' }
      const iteratee = jest.fn()
      forEach(tree, iteratee)
      expect(iteratee).toHaveBeenCalledTimes(1)
      expect(iteratee).toHaveBeenCalledWith(tree, 0)
    })
  })

  describe('Beagle Tree: iteration: replaceEach', () => {
    it('should iterate over all components without altering the tree', () => {
      const { tree, order } = createFormTree()
      const iteratee = jest.fn(t => t)
      const result = replaceEach(tree, iteratee)
      expect(iteratee).toHaveBeenCalledTimes(order.length)
      expect(result).toBe(tree)
    })

    it('should iterate in the correct order and replace every component', () => {
      const { tree, order } = createFormTree()

      const result = replaceEach(tree, (component, index) => {
        expect(component).toEqual(order[index])
        const newComponent = clone(component)
        newComponent.value = index
        return newComponent
      })

      expect(result).not.toBe(tree)

      // we tested the forEach in the previous test suit, we know it works, so we can use it
      forEach(result, (component, index) => {
        expect(component.value).toBe(index)
      })
    })

    it('should not iterate over list-view\'s template', () => {
      const { tree, order } = createListViewTree()
      let next = 0
      replaceEach(tree, (component, index) => {
        expect(index).toBe(next++)
        expect(component).toBe(order[index])
        return component
      })
    })

    it('should iterate over a tree with a single component', () => {
      const tree = { _beagleComponent_: 'container' }
      const iteratee = jest.fn(t => t)
      replaceEach(tree, iteratee)
      expect(iteratee).toHaveBeenCalledTimes(1)
      expect(iteratee).toHaveBeenCalledWith(tree, 0)
    })

    it('should throw error if nothing is returned by the iteratee', () => {
      const { tree } = createFormTree()
      const iteratee = jest.fn()
      const replace = () => replaceEach(tree, iteratee)
      expect(replace).toThrowError()
    })
  })

  describe('Beagle Tree: iteration: iterate', () => {
    it('should iterate over all components', () => {
      const { tree, order } = createFormTree()
      let counter = 0
      const it = iterator(tree)
      let next = it.next()
      while (!next.done) {
        counter++
        next = it.next()
      }
      expect(counter).toBe(order.length)
    })

    it('should iterate in the correct order', () => {
      const { tree, order } = createFormTree()
      const it = iterator(tree)
      let index = 0
      for(let component in it) {
        expect(component).toBe(order[index++])
      }
    })

    it('should not iterate over list-view\'s template', () => {
      const { tree, order } = createListViewTree()
      const it = iterator(tree)
      let index = 0
      for(let component in it) {
        expect(component).toBe(order[index++])
      }
    })

    it('should iterate over a tree with a single component', () => {
      const tree = { _beagleComponent_: 'container' }
      const it = iterator(tree)
      let next = it.next()
      expect(next.value).toBe(tree)
      expect(next.done).toBe(false)
      next = it.next()
      expect(next.done).toBe(true)
    })
  })
})
