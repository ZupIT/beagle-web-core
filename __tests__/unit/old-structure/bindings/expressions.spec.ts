/*
 * Copyright 2020, 2022 ZUP IT SERVICOS EM TECNOLOGIA E INOVACAO SA
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

/**
 * TODO: rename this file. Test the new function in Expression.ts.
 */

import Expression from 'beagle-view/render/expression'
import BeagleParseError from 'error/BeagleParseError'
import BeagleNotFoundError from 'error/BeagleNotFoundError'
import { createPerson } from './mocks'
import defaultOperation from 'operation'

describe('Binding expressions: replacing with provided contexts', () => {
  beforeEach(() => {
    globalMocks.log.mockClear()
  })

  describe('context bindings', () => {
    it('should not alter structure passed as parameter', () => {
      const structure = { age: 20, name: '@{name}' }
      const original = { ...structure }
      const contextHierarchy = [{ id: 'name', value: 'Jest' }]
      Expression.resolve(structure, contextHierarchy, defaultOperation)
      expect(structure).toEqual(original)
    })

    it('should replace by context (string)', () => {
      const contextHierarchy = [{ id: 'ctx', value: 'Hello World!' }]
      const withValues = Expression.resolve('@{ctx}', contextHierarchy, defaultOperation)
      expect(withValues).toBe('Hello World!')
    })

    it('should replace by context (number)', () => {
      const contextHierarchy = [{ id: 'ctx', value: 584 }]
      const withValues = Expression.resolve('@{ctx}', contextHierarchy, defaultOperation)
      expect(withValues).toBe(584)
    })

    it('should replace by context (boolean)', () => {
      const contextHierarchy = [{ id: 'ctx', value: true }]
      const withValues = Expression.resolve('@{ctx}', contextHierarchy, defaultOperation)
      expect(withValues).toBe(true)
    })

    it('should replace by context (array)', () => {
      const contextHierarchy = [{ id: 'ctx', value: [1, 2, 3] }]
      const withValues = Expression.resolve('@{ctx}', contextHierarchy, defaultOperation)
      expect(withValues).toEqual([1, 2, 3])
    })

    it('should replace by context (object)', () => {
      const contextHierarchy = [{ id: 'ctx', value: createPerson() }]
      const withValues = Expression.resolve('@{ctx}', contextHierarchy, defaultOperation)
      expect(withValues).toEqual(contextHierarchy[0].value)
    })

    it('should replace binding in the middle of a text (string)', () => {
      const contextHierarchy = [{ id: 'ctx', value: 'Hello World' }]
      const withValues = Expression.resolve('Mid text expression: @{ctx}.', contextHierarchy,defaultOperation)
      expect(withValues).toBe('Mid text expression: Hello World.')
    })

    it('should replace binding in the middle of a text (number)', () => {
      const contextHierarchy = [{ id: 'ctx', value: 584 }]
      const withValues = Expression.resolve('Mid text expression: @{ctx}.', contextHierarchy, defaultOperation)
      expect(withValues).toBe('Mid text expression: 584.')
    })

    it('should replace binding in the middle of a text (boolean)', () => {
      const contextHierarchy = [{ id: 'ctx', value: true }]
      const withValues = Expression.resolve('Mid text expression: @{ctx}.', contextHierarchy, defaultOperation)
      expect(withValues).toBe('Mid text expression: true.')
    })

    it('should replace binding in the middle of a text (array)', () => {
      const contextHierarchy = [{ id: 'ctx', value: [1, 2, 3] }]
      const withValues = Expression.resolve('Mid text expression: @{ctx}.', contextHierarchy, defaultOperation)
      expect(withValues).toBe('Mid text expression: [1,2,3].')
    })

    it('should replace binding in the middle of a text (object)', () => {
      const contextHierarchy = [{ id: 'ctx', value: createPerson() }]
      const withValues = Expression.resolve('Mid text expression: @{ctx}.', contextHierarchy, defaultOperation)
      expect(withValues).toBe(`Mid text expression: ${JSON.stringify(contextHierarchy[0].value)}.`)
    })

    it('should replace with value in context (object key)', () => {
      const contextHierarchy = [{ id: 'ctx', value: createPerson() }]
      const withValues = Expression.resolve('@{ctx.name.first}', contextHierarchy, defaultOperation)
      expect(withValues).toBe(contextHierarchy[0].value.name.first)
    })

    it('should replace with value in context (array item)', () => {
      const contextHierarchy = [{ id: 'ctx', value: createPerson() }]
      const withValues = Expression.resolve('@{ctx.phones[0]}', contextHierarchy, defaultOperation)
      expect(withValues).toBe(contextHierarchy[0].value.phones[0])
    })

    it('should replace with value in context (object key of an array item)', () => {
      const contextHierarchy = [{ id: 'ctx', value: createPerson() }]
      const withValues = Expression.resolve('@{ctx.documents[1].name}', contextHierarchy, defaultOperation)
      expect(withValues).toBe(contextHierarchy[0].value.documents[1].name)
    })

    it('should replace with value in context (item in array of array)', () => {
      const contextHierarchy = [{ id: 'ctx', value: [['Jest']] }]
      const withValues = Expression.resolve('@{ctx[0][0]}', contextHierarchy, defaultOperation)
      expect(withValues).toBe('Jest')
    })

    it('should replace using values from multiple contexts', () => {
      const contextHierarchy = [
        {
          id: 'user',
          value: { name: 'John', age: 30 },
        },
        {
          id: 'plan',
          value: { name: 'Premium', value: 99.59, id: 'plan01' },
        },
        {
          id: 'phones',
          value: ['(34) 5599-5555', '(34) 90000-8787'],
        },
      ]

      const withValues = Expression.resolve(
        '@{user.name} is @{user.age} years old. His current plan is @{plan.name} and it costs $@{plan.value}. Please, call @{phones[0]} to talk to him.',
        contextHierarchy,
        defaultOperation
      )

      expect(withValues).toBe(
        'John is 30 years old. His current plan is Premium and it costs $99.59. Please, call (34) 5599-5555 to talk to him.',
      )
    })

    it('should replace bindings expressions in object', () => {
      const context = { id: 'ctx', value: { firstName: 'Jest', lastName: 'de Oliveira', age: 25 } }
      const person = {
        name: '@{ctx.firstName} @{ctx.lastName}',
        age: '@{ctx.age}',
        sex: 'm',
      }
      const withValues = Expression.resolve(person, [context], defaultOperation)
      expect(withValues).toEqual({
        name: 'Jest de Oliveira',
        age: 25,
        sex: 'm',
      })
    })

    it('should replace bindings expressions in array', () => {
      const context = {
        id: 'ctx',
        value: { telephone: '(34) 8456-8585', cellphone: '(34) 91234-5678' },
      }
      const phones = ['(34) 7788-9944', '@{ctx.telephone}', '@{ctx.cellphone}']
      const withValues = Expression.resolve(phones, [context], defaultOperation)
      expect(withValues).toEqual(['(34) 7788-9944', '(34) 8456-8585', '(34) 91234-5678'])
    })

    it('should return and give a warning if path is invalid', () => {
      const withValues = Expression.resolve('@{ctx.[.]}', [], defaultOperation)
      expect(withValues).toBe(null)
      expect(globalMocks.log).toHaveBeenCalledWith('warn', expect.any(BeagleParseError))
    })

    it('should replace with empty string if no context is found on string interpolation', () => {
      const withValues = Expression.resolve('Test @{ctx} string interpolation', [{ id: 'ctx2', value: 'jest' }], defaultOperation)
      expect(withValues).toEqual('Test  string interpolation')
    })

    it('should replace with null if no context is found', () => {
      const withValues = Expression.resolve('@{ctx}', [{ id: 'ctx2', value: 'jest' }], defaultOperation)
      expect(withValues).toEqual(null)
    })

    it('should replace with null if path doesn\'t exist in the referred context', () => {
      const withValues = Expression.resolve('@{ctx.name}', [{ id: 'ctx', value: { age: 30 } }], defaultOperation)
      expect(withValues).toEqual(null)
    })

    it('should scape expression', () => {
      const withValues = Expression.resolve('\\@{myContext}', [{ id: 'myContext', value: 'jest' }], defaultOperation)
      expect(withValues).toBe('@{myContext}')
    })

    it('should not scape expression when slash is also scaped', () => {
      const withValues = Expression.resolve('\\\\@{myContext}', [{ id: 'myContext', value: 'jest' }], defaultOperation)
      expect(withValues).toBe('\\jest')
    })

    it(
      'should scape expression when a scaped slash is present, but another slash is also present',
      () => {
        const withValues = Expression.resolve('\\\\\\@{myContext}', [{ id: 'myContext', value: 'jest' }], defaultOperation)
        expect(withValues).toBe('\\@{myContext}')
      },
    )
  })

  describe('Literals', () => {
    it('should resolve literals', () => {
      expect(Expression.resolve('@{true}', [], defaultOperation)).toBe(true)
      expect(Expression.resolve('@{false}', [], defaultOperation)).toBe(false)
      expect(Expression.resolve('@{null}', [], defaultOperation)).toBe(null)
      expect(Expression.resolve('@{10}', [], defaultOperation)).toBe(10)
      expect(Expression.resolve('@{\'true\'}', [], defaultOperation)).toBe('true')
      expect(Expression.resolve('@{\'hello world, this is { beagle }!\'}', [], defaultOperation))
        .toEqual('hello world, this is { beagle }!')
    })

    it('should scape string', () => {
      expect(Expression.resolve('@{\'hello \\\'world\\\'!\'}', [], defaultOperation)).toBe('hello \'world\'!')
    })

    it('should keep control symbols', () => {
      expect(Expression.resolve('@{\'hello\nworld!\'}', [], defaultOperation)).toBe('hello\nworld!')
    })

    it('should do nothing for malformed string', () => {
      expect(Expression.resolve('@{\'test}', [], defaultOperation)).toBe('@{\'test}')
    })

    it('should treat malformed number as context id', () => {
      expect(Expression.resolve('@{5o1}', [{ id: '5o1', value: 'test' }], defaultOperation)).toBe('test')
    })

    it('should return null for malformed number and invalid context id', () => {
      expect(Expression.resolve('@{58.72.98}', [{ id: '58.72.98', value: 'test' }], defaultOperation)).toBe(null)
    })
  })

  describe('Operations', () => {
    it('should execute operation with literals', () => {
      expect(Expression.resolve('@{sum(5, 7)}', [], defaultOperation)).toBe(12)
    })

    it('should execute operation with context bindings', () => {
      const contexts = [{ id: 'user', value: { age: 12 } }, { id: 'adultAge', value: 18 }]
      expect(Expression.resolve('@{subtract(adultAge, user.age)}', contexts, defaultOperation)).toBe(6)
    })

    it('should execute operation with both context bindings and literals', () => {
      const contexts = [{ id: 'user', value: { age: 12 } }]
      expect(Expression.resolve('@{subtract(18, user.age)}', contexts, defaultOperation)).toBe(6)
    })

    it('should execute operation with operations', () => {
      const contexts = [{ id: 'values', value: [5, 8, 2, 7] }]
      expect(
        Expression.resolve(
          '@{multiply(sum(values[0], values[1]), subtract(values[2], values[3]))}',
          contexts,
          defaultOperation
        )
      ).toBe(-65)
    })

    it('should chain operations', () => {
      const contextHierarchy = [{ id: 'counter', value: { a: 0, b: 1 } }]
      const expression = '@{condition(lte(sum(counter.a, 2, counter.b), 5), \'a + 2 + b <= 5, (true)\', \'a + 2 + b > 5, (false)\')}'
      const result1 = Expression.resolve(expression, contextHierarchy, defaultOperation)
      contextHierarchy[0].value.a = 3
      const result2 = Expression.resolve(expression, contextHierarchy, defaultOperation)
      expect(result1).toBe('a + 2 + b <= 5, (true)')
      expect(result2).toBe('a + 2 + b > 5, (false)')
    })

    it('should correctly handle symbols inside a string', () => {
      const expression = '@{concat(\'()}{}((),(\', \'test),(}\')}'
      expect(Expression.resolve(expression, [], defaultOperation)).toBe('()}{}((),(test),(}')
    })

    it('should ignore space between parameters', () => {
      expect(Expression.resolve('@{concat( \'a\'    ,\'b\' ,     \'c\'  )}', [], defaultOperation)).toBe('abc')
      expect(Expression.resolve('@{concat(\'a\',\'b\',\'c\')}', [], defaultOperation)).toBe('abc')
    })

    it('should log warning and return null if operation doesn\'t exist', () => {
      expect(Expression.resolve('@{blah(42)}', [], defaultOperation)).toBe(null)
      expect(globalMocks.log).toHaveBeenCalledWith('warn', expect.any(BeagleNotFoundError))
    })

    it('should log error and return null for malformed parameter list', () => {
      expect(Expression.resolve('@{sum(2, 4))}', [], defaultOperation)).toBe(null)
      expect(globalMocks.log).toHaveBeenLastCalledWith('warn', expect.any(BeagleParseError))
      expect(Expression.resolve('@{sum(4(2)}', [], defaultOperation)).toBe(null)
      expect(globalMocks.log).toHaveBeenLastCalledWith('warn', expect.any(BeagleParseError))
      expect(Expression.resolve('@{sum(2))}', [], defaultOperation)).toBe(null)
      expect(globalMocks.log).toHaveBeenLastCalledWith('warn', expect.any(BeagleParseError))
      expect(Expression.resolve('@{sum(,),)}', [], defaultOperation)).toBe(null)
      expect(globalMocks.log).toHaveBeenLastCalledWith('warn', expect.any(BeagleParseError))
    })

    it('should log error and replace with empty string when operation name is invalid', () => {
      expect(Expression.resolve('result: @{sum-test(4, 2)}', [], defaultOperation)).toBe('result: ')
      expect(globalMocks.log).toHaveBeenLastCalledWith('warn', expect.any(BeagleParseError))
    })

    it('should log error and return null when operation name is invalid', () => {
      expect(Expression.resolve('@{s)um(4, 2)}', [], defaultOperation)).toBe(null)
      expect(globalMocks.log).toHaveBeenLastCalledWith('warn', expect.any(BeagleParseError))
    })
  })
})
