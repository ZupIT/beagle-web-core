/*
  * Copyright 2020 ZUP IT SERVICOS EM TECNOLOGIA E INOVACAO SA
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *  http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
*/

import op from '../../src/operations'

describe('Operations', () => {
  beforeAll(() => {
    const keys = Object.keys(op)
    keys.forEach(key => op[key] = jest.fn(op[key]))
  })

  describe('Number', () => {
    it('should sum', () => expect(op.sum(...[1, 20, 10, 15])).toBe(46))
    it('should subtract', () => expect(op.subtract(...[40, 10, 30])).toBe(0))
    it('should multiply', () => expect(op.multiply(...[5, 10, 2, 1])).toBe(100))
    it('should divide', () => expect(op.divide(...[100, 2, 10, 5])).toBe(1))
  })

  describe('String', () => {
    it('should concatenate', () => (
      expect(op.concat(...['Admiral', ' ', 'Jaina Proudmore'])).toBe('Admiral Jaina Proudmore'))
    )

    it('should capitalize', () => expect(op.capitalize('dalinar kholin')).toEqual('Dalinar kholin'))

    it('should convert to uppercase', () => (
      expect(op.uppercase('dalinar kholin')).toEqual('DALINAR KHOLIN'))
    )

    it('should convert to lowercase', () => (
      expect(op.lowercase('DALInAR KHoLiN')).toEqual('dalinar kholin'))
    )

    it('should return a sub-string', () => {
      expect(op.substr('123456789', 5, 0)).toEqual('')
      expect(op.substr('123456789', 0, 5)).toEqual('12345')
      expect(op.substr('123456789', 3, 3)).toEqual('456')
      expect(op.substr('123456789', 5)).toEqual('6789')
    })
  })

  describe('Logic', () => {
    it('should resolve "and" correctly', () => {
      expect(op.and(...[true, true, true])).toBe(true)
      expect(op.and(...[true, true, false])).toBe(false)
    })

    it('should resolve "or" correctly', () => {
      expect(op.or(...[true, false, true])).toBe(true)
      expect(op.or(...[false, false])).toBe(false)
    })


    it('should negate', () => {
      expect(op.not(true)).toBe(false)
      expect(op.not(false)).toBe(true)
    })

    it('should make a condition', () => {
      expect(op.condition(true, 1, 2)).toBe(1)
      expect(op.condition(false, 1, 2)).toBe(2)
    })
  })

  describe('Comparison', () => {
    it('should resolve "gt" correctly', () => {
      expect(op.gt(5, 4)).toBe(true)
      expect(op.gt(5, 5)).toBe(false)
    })

    it('should resolve "gte" correctly', () => {
      expect(op.gte(5, 5)).toBe(true)
      expect(op.gte(3, 5)).toBe(false)
    })

    it('should resolve "lt" correctly', () => {
      expect(op.lt(8, 9)).toBe(true)
      expect(op.lt(8, 8)).toBe(false)
    })

    it('should resolve "lte" correctly', () => {
      expect(op.lte(8, 8)).toBe(true)
      expect(op.lte(9, 8)).toBe(false)
    })

    it('should be equal', () => {
      expect(op.eq(5, 5)).toBe(true)
      expect(op.eq('test', 'test')).toBe(true)
      expect(op.eq(true, true)).toBe(true)
      expect(op.eq({ a: 1, b: 2 }, { a: 1, b: 2 })).toBe(true)
      expect(op.eq([1, 2, 3], [1, 2, 3])).toBe(true)
    })

    it('should not be equal', () => {
      expect(op.eq(5, 6)).toBe(false)
      expect(op.eq('test1', 'test2')).toBe(false)
      expect(op.eq(true, false)).toBe(false)
      expect(op.eq({ a: 1, b: 2 }, { a: 1, b: 3 })).toBe(false)
      expect(op.eq([1, 2, 3], [1, 2, 4])).toBe(false)
    })

    it('should not be equal if types are different', () => {
      expect(op.eq(1, '1')).toBe(false)
      expect(op.eq({ a: 1 }, { a: '1' })).toBe(false)
      expect(op.eq([1], ['1'])).toBe(false)
    })
  })

  describe('Array', () => {
    it('should insert', () => {
      const array = [1, 2, 3]
      expect(op.insert(array, 9, 0)).toEqual([9, 1, 2, 3])
      expect(op.insert(array, 9, 1)).toEqual([1, 9, 2, 3])
      expect(op.insert(array, 9)).toEqual([1, 2, 3, 9])
    })

    it('should remove', () => {
      const numbers = [1, 2, 3, 2]
      expect(op.remove(numbers, 2)).toEqual([1, 3])
      expect(numbers).toEqual([1, 2, 3, 2])
      expect(op.remove(['abc', 'def', 'ghi'], 'def')).toEqual(['abc', 'ghi'])
      expect(op.remove([[1], [2], [3]], [2])).toEqual([[1], [3]])
      expect(op.remove([{ a: 1 }, { a: 2 }], { a: 1 })).toEqual([{ a: 2 }])
    })

    it('should removeIndex', () => {
      const array = [1, 2, 3]
      expect(op.removeIndex(array, 0)).toEqual([2, 3])
      expect(op.removeIndex(array, 1)).toEqual([1, 3])
      expect(op.removeIndex(array)).toEqual([1, 2])
    })

    it('should include', () => {
      expect(op.includes([1, 2, 3], 2)).toEqual(true)
      expect(op.includes([true], true)).toEqual(true)
      expect(op.includes(['1', '2', '3'], '3')).toEqual(true)
      expect(op.includes([[1], [2], [3]], [1])).toEqual(true)
      expect(op.includes([{ a: 1 }, { a: 2 }], { a: 1 })).toEqual(true)
    })

    it('should not include', () => {
      expect(op.includes([1, 2, 3], 0)).toEqual(false)
      expect(op.includes([false], true)).toEqual(false)
      expect(op.includes([1, 2, 3], '2')).toEqual(false)
      expect(op.includes(['1', '2', '3'], '4')).toEqual(false)
      expect(op.includes([[1], [2], [3]], ['1'])).toEqual(false)
      expect(op.includes([{ a: 1 }, { a: 2 }], { b: 1 })).toEqual(false)
    })
  })

  describe('Other', () => {
    it('should exist', () => {
      expect(op.isNull('')).toBe(true)
      expect(op.isNull('a')).toBe(true)
      expect(op.isNull(-1)).toBe(true)
      expect(op.isNull(0)).toBe(true)
      expect(op.isNull(1)).toBe(true)
      expect(op.isNull({})).toBe(true)
      expect(op.isNull({ a: 1 })).toBe(true)
      expect(op.isNull([])).toBe(true)
      expect(op.isNull([1])).toBe(true)
    })

    it('should not exist', () => {
      expect(op.isNull(undefined)).toBe(false)
      expect(op.isNull(null)).toBe(false)
    })

    it('should be empty', () => {
      expect(op.isEmpty('')).toBe(true)
      expect(op.isEmpty({})).toBe(true)
      expect(op.isEmpty([])).toBe(true)
      expect(op.isEmpty(null)).toBe(true)
      expect(op.isEmpty(undefined)).toBe(true)
    })

    it('should not be empty', () => {
      expect(op.isEmpty('abc')).toBe(false)
      expect(op.isEmpty([1, 3])).toBe(false)
      expect(op.isEmpty({ a: 2 })).toBe(false)
    })

    it('should return the length', () => {
      expect(op.length([1, 2, 3])).toEqual(3)
      expect(op.length('Hello World!')).toEqual(12)
    })
  })

  it('should have tested every operation', () => {
    const keys = Object.keys(op)
    keys.forEach(key => expect(op[key]).toHaveBeenCalled())
  })
})
