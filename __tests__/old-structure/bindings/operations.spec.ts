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

import Operation from 'operation'

describe('Operations', () => {
  beforeAll(() => {
    const keys = Object.keys(Operation)
    // @ts-ignore
    keys.forEach(key => Operation[key] = jest.fn(Operation[key]))
  })

  describe('Number', () => {
    it('should sum', () => expect(Operation.sum(...[1, 20, 10, 15])).toBe(46))
    it('should subtract', () => expect(Operation.subtract(...[40, 10, 30])).toBe(0))
    it('should multiply', () => expect(Operation.multiply(...[5, 10, 2, 1])).toBe(100))
    it('should divide', () => expect(Operation.divide(...[100, 2, 10, 5])).toBe(1))
  })

  describe('String', () => {
    it('should concatenate', () => (
      expect(Operation.concat(...['Admiral', ' ', 'Jaina Proudmore'])).toBe('Admiral Jaina Proudmore'))
    )

    it('should capitalize', () => expect(Operation.capitalize('dalinar kholin')).toEqual('Dalinar kholin'))

    it('should convert to uppercase', () => (
      expect(Operation.uppercase('dalinar kholin')).toEqual('DALINAR KHOLIN'))
    )

    it('should convert to lowercase', () => (
      expect(Operation.lowercase('DALInAR KHoLiN')).toEqual('dalinar kholin'))
    )

    it('should return a sub-string', () => {
      expect(Operation.substr('123456789', 5, 0)).toEqual('')
      expect(Operation.substr('123456789', 0, 5)).toEqual('12345')
      expect(Operation.substr('123456789', 3, 3)).toEqual('456')
      expect(Operation.substr('123456789', 5)).toEqual('6789')
    })
  })

  describe('Logic', () => {
    it('should resolve "and" correctly', () => {
      expect(Operation.and(...[true, true, true])).toBe(true)
      expect(Operation.and(...[true, true, false])).toBe(false)
    })

    it('should resolve "or" correctly', () => {
      expect(Operation.or(...[true, false, true])).toBe(true)
      expect(Operation.or(...[false, false])).toBe(false)
    })


    it('should negate', () => {
      expect(Operation.not(true)).toBe(false)
      expect(Operation.not(false)).toBe(true)
    })

    it('should make a condition', () => {
      expect(Operation.condition(true, 1, 2)).toBe(1)
      expect(Operation.condition(false, 1, 2)).toBe(2)
    })
  })

  describe('Comparison', () => {
    it('should resolve "gt" correctly', () => {
      expect(Operation.gt(5, 4)).toBe(true)
      expect(Operation.gt(5, 5)).toBe(false)
    })

    it('should resolve "gte" correctly', () => {
      expect(Operation.gte(5, 5)).toBe(true)
      expect(Operation.gte(3, 5)).toBe(false)
    })

    it('should resolve "lt" correctly', () => {
      expect(Operation.lt(8, 9)).toBe(true)
      expect(Operation.lt(8, 8)).toBe(false)
    })

    it('should resolve "lte" correctly', () => {
      expect(Operation.lte(8, 8)).toBe(true)
      expect(Operation.lte(9, 8)).toBe(false)
    })

    it('should be equal', () => {
      expect(Operation.eq(5, 5)).toBe(true)
      expect(Operation.eq('test', 'test')).toBe(true)
      expect(Operation.eq(true, true)).toBe(true)
      expect(Operation.eq({ a: 1, b: 2 }, { a: 1, b: 2 })).toBe(true)
      expect(Operation.eq([1, 2, 3], [1, 2, 3])).toBe(true)
    })

    it('should not be equal', () => {
      expect(Operation.eq(5, 6)).toBe(false)
      expect(Operation.eq('test1', 'test2')).toBe(false)
      expect(Operation.eq(true, false)).toBe(false)
      expect(Operation.eq({ a: 1, b: 2 }, { a: 1, b: 3 })).toBe(false)
      expect(Operation.eq([1, 2, 3], [1, 2, 4])).toBe(false)
    })

    it('should not be equal if types are different', () => {
      expect(Operation.eq(1, '1')).toBe(false)
      expect(Operation.eq({ a: 1 }, { a: '1' })).toBe(false)
      expect(Operation.eq([1], ['1'])).toBe(false)
    })
  })

  describe('Array', () => {
    it('should insert', () => {
      const array = [1, 2, 3]
      expect(Operation.insert(array, 9, 0)).toEqual([9, 1, 2, 3])
      expect(Operation.insert(array, 9, 1)).toEqual([1, 9, 2, 3])
      expect(Operation.insert(array, 9)).toEqual([1, 2, 3, 9])
    })

    it('should remove', () => {
      const numbers = [1, 2, 3, 2]
      expect(Operation.remove(numbers, 2)).toEqual([1, 3])
      expect(numbers).toEqual([1, 2, 3, 2])
      expect(Operation.remove(['abc', 'def', 'ghi'], 'def')).toEqual(['abc', 'ghi'])
      expect(Operation.remove([[1], [2], [3]], [2])).toEqual([[1], [3]])
      expect(Operation.remove([{ a: 1 }, { a: 2 }], { a: 1 })).toEqual([{ a: 2 }])
    })

    it('should removeIndex', () => {
      const array = [1, 2, 3]
      expect(Operation.removeIndex(array, 0)).toEqual([2, 3])
      expect(Operation.removeIndex(array, 1)).toEqual([1, 3])
      expect(Operation.removeIndex(array)).toEqual([1, 2])
    })

    it('should include', () => {
      expect(Operation.includes([1, 2, 3], 2)).toEqual(true)
      expect(Operation.includes([true], true)).toEqual(true)
      expect(Operation.includes(['1', '2', '3'], '3')).toEqual(true)
      expect(Operation.includes([[1], [2], [3]], [1])).toEqual(true)
      expect(Operation.includes([{ a: 1 }, { a: 2 }], { a: 1 })).toEqual(true)
    })

    it('should not include', () => {
      expect(Operation.includes([1, 2, 3], 0)).toEqual(false)
      expect(Operation.includes([false], true)).toEqual(false)
      expect(Operation.includes([1, 2, 3], '2')).toEqual(false)
      expect(Operation.includes(['1', '2', '3'], '4')).toEqual(false)
      expect(Operation.includes([[1], [2], [3]], ['1'])).toEqual(false)
      expect(Operation.includes([{ a: 1 }, { a: 2 }], { b: 1 })).toEqual(false)
    })

    it('should unite/concat arrays', () => {
      expect(Operation.union([], [1, 2, 3])).toEqual([1, 2, 3])
      expect(Operation.union([1, 2, 3], [1])).toEqual([1, 2, 3, 1])
      expect(Operation.union([1, 2, 3], [4, 5, 6], [7, 8, 9])).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9])
    })
  })

  describe('Other', () => {
    it('should exist', () => {
      expect(Operation.isNull('')).toBe(true)
      expect(Operation.isNull('a')).toBe(true)
      expect(Operation.isNull(-1)).toBe(true)
      expect(Operation.isNull(0)).toBe(true)
      expect(Operation.isNull(1)).toBe(true)
      expect(Operation.isNull({})).toBe(true)
      expect(Operation.isNull({ a: 1 })).toBe(true)
      expect(Operation.isNull([])).toBe(true)
      expect(Operation.isNull([1])).toBe(true)
    })

    it('should not exist', () => {
      expect(Operation.isNull(undefined)).toBe(false)
      expect(Operation.isNull(null)).toBe(false)
    })

    it('should be empty', () => {
      expect(Operation.isEmpty('')).toBe(true)
      expect(Operation.isEmpty({})).toBe(true)
      expect(Operation.isEmpty([])).toBe(true)
      expect(Operation.isEmpty(null)).toBe(true)
      expect(Operation.isEmpty(undefined)).toBe(true)
    })

    it('should not be empty', () => {
      expect(Operation.isEmpty('abc')).toBe(false)
      expect(Operation.isEmpty([1, 3])).toBe(false)
      expect(Operation.isEmpty({ a: 2 })).toBe(false)
    })

    it('should return the length', () => {
      expect(Operation.length([1, 2, 3])).toEqual(3)
      expect(Operation.length('Hello World!')).toEqual(12)
    })
  })

  it('should have tested every operation', () => {
    const keys = Object.keys(Operation)
    // @ts-ignore
    keys.forEach(key => expect(Operation[key]).toHaveBeenCalled())
  })
})
