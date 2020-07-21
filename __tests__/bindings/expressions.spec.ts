import { replaceBindings } from '../../src/bindings'
import { createPerson } from './mocks'

describe('Binding expressions: replacing with provided contexts', () => {
  describe('context bindings', () => {
    it('should not alter structure passed as parameter', () => {
      const structure = { age: 20, name: '@{name}' }
      const original = { ...structure }
      const contextHierarchy = [{ id: 'name', value: 'Jest' }]
      replaceBindings(structure, contextHierarchy)
      expect(structure).toEqual(original)
    })
  
    it('should replace by context (string)', () => {
      const contextHierarchy = [{ id: 'ctx', value: 'Hello World!' }]
      const withValues = replaceBindings('@{ctx}', contextHierarchy)
      expect(withValues).toBe('Hello World!')
    })
  
    it('should replace by context (number)', () => {
      const contextHierarchy = [{ id: 'ctx', value: 584 }]
      const withValues = replaceBindings('@{ctx}', contextHierarchy)
      expect(withValues).toBe(584)
    })
  
    it('should replace by context (boolean)', () => {
      const contextHierarchy = [{ id: 'ctx', value: true }]
      const withValues = replaceBindings('@{ctx}', contextHierarchy)
      expect(withValues).toBe(true)
    })
  
    it('should replace by context (array)', () => {
      const contextHierarchy = [{ id: 'ctx', value: [1, 2, 3] }]
      const withValues = replaceBindings('@{ctx}', contextHierarchy)
      expect(withValues).toEqual([1, 2, 3])
    })
  
    it('should replace by context (object)', () => {
      const contextHierarchy = [{ id: 'ctx', value: createPerson() }]
      const withValues = replaceBindings('@{ctx}', contextHierarchy)
      expect(withValues).toEqual(contextHierarchy[0].value)
    })
  
    it('should replace binding in the middle of a text (string)', () => {
      const contextHierarchy = [{ id: 'ctx', value: 'Hello World' }]
      const withValues = replaceBindings('Mid text expression: @{ctx}.', contextHierarchy)
      expect(withValues).toBe('Mid text expression: Hello World.')
    })
  
    it('should replace binding in the middle of a text (number)', () => {
      const contextHierarchy = [{ id: 'ctx', value: 584 }]
      const withValues = replaceBindings('Mid text expression: @{ctx}.', contextHierarchy)
      expect(withValues).toBe('Mid text expression: 584.')
    })
  
    it('should replace binding in the middle of a text (boolean)', () => {
      const contextHierarchy =  [{ id: 'ctx', value: true }]
      const withValues = replaceBindings('Mid text expression: @{ctx}.', contextHierarchy)
      expect(withValues).toBe('Mid text expression: true.')
    })
  
    it('should replace binding in the middle of a text (array)', () => {
      const contextHierarchy = [{ id: 'ctx', value: [1, 2, 3] }]
      const withValues = replaceBindings('Mid text expression: @{ctx}.', contextHierarchy)
      expect(withValues).toBe('Mid text expression: [1,2,3].')
    })
  
    it('should replace binding in the middle of a text (object)', () => {
      const contextHierarchy = [{ id: 'ctx', value: createPerson() }]
      const withValues = replaceBindings('Mid text expression: @{ctx}.', contextHierarchy)
      expect(withValues).toBe(`Mid text expression: ${JSON.stringify(contextHierarchy[0].value)}.`)
    })
  
    it('should replace with value in context (object key)', () => {
      const contextHierarchy = [{ id: 'ctx', value: createPerson() }]
      const withValues = replaceBindings('@{ctx.name.first}', contextHierarchy)
      expect(withValues).toBe(contextHierarchy[0].value.name.first)
    })
  
    it('should replace with value in context (array item)', () => {
      const contextHierarchy = [{ id: 'ctx', value: createPerson() }]
      const withValues = replaceBindings('@{ctx.phones[0]}', contextHierarchy)
      expect(withValues).toBe(contextHierarchy[0].value.phones[0])
    })
  
    it('should replace with value in context (object key of an array item)', () => {
      const contextHierarchy = [{ id: 'ctx', value: createPerson() }]
      const withValues = replaceBindings('@{ctx.documents[1].name}', contextHierarchy)
      expect(withValues).toBe(contextHierarchy[0].value.documents[1].name)
    })
  
    it('should replace with value in context (item in array of array)', () => {
      const contextHierarchy = [{ id: 'ctx', value: [['Jest']] }]
      const withValues = replaceBindings('@{ctx[0][0]}', contextHierarchy)
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
    
      const withValues = replaceBindings(
        '@{user.name} is @{user.age} years old. His current plan is @{plan.name} and it costs $@{plan.value}. Please, call @{phones[0]} to talk to him.',
        contextHierarchy,
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
      const withValues = replaceBindings(person, [context])
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
      const withValues = replaceBindings(phones, [context])
      expect(withValues).toEqual(['(34) 7788-9944', '(34) 8456-8585', '(34) 91234-5678'])
    })
  
    it('should not replace and give a warning if path is invalid', () => {
      const originalWarning = console.warn
      console.warn = jest.fn()
      const withValues = replaceBindings('@{ctx.[.]}')
      expect(withValues).toBe('@{ctx.[.]}')
      expect(console.warn).toHaveBeenCalled()
      console.warn = originalWarning
    })
  
    it('should not replace if no context is found', () => {
      const withValues = replaceBindings('@{ctx}', [{ id: 'ctx2', value: 'jest' }])
      expect(withValues).toEqual('@{ctx}')
    })
  
    it('should not replace if path doesn\'t exist in the referred context', () => {
      const withValues = replaceBindings('@{ctx.name}', [{ id: 'ctx', value: { age: 30 } }])
      expect(withValues).toEqual('@{ctx.name}')
    })
  
    it('should scape expression', () => {
      const withValues = replaceBindings('\\@{myContext}', [{ id: 'myContext', value: 'jest' }])
      expect(withValues).toBe('@{myContext}')
    })
  
    it('should not scape expression when slash is also scaped', () => {
      const withValues = replaceBindings('\\\\@{myContext}', [{ id: 'myContext', value: 'jest' }])
      expect(withValues).toBe('\\jest')
    })
  
    it(
      'should scape expression when a scaped slash is present, but another slash is also present',
      () => {
        const withValues = replaceBindings('\\\\\\@{myContext}', [{ id: 'myContext', value: 'jest' }])
        expect(withValues).toBe('\\@{myContext}')
      },
    )
  })

  describe('Literals', () => {
    it('should resolve literals', () => {
      expect(replaceBindings('@{true}', [])).toBe(true)
      expect(replaceBindings('@{false}', [])).toBe(false)
      expect(replaceBindings('@{null}', [])).toBe(null)
      expect(replaceBindings('@{10}', [])).toBe(10)
      expect(replaceBindings('@{\'true\'}', [])).toBe('true')
      expect(replaceBindings('@{\'hello world, this is { beagle }!\'}', []))
        .toEqual('hello world, this is { beagle }!')
    })

    it('should scape string', () => {
      expect(replaceBindings('@{\'hello \\\'world\\\'!\'}', [])).toBe('hello \'world\'!')
    })

    it('should keep control symbols', () => {
      expect(replaceBindings('@{\'hello\nworld!\'}', [])).toBe('hello\nworld!')
    })

    it('should do nothing for malformed string', () => {
      expect(replaceBindings('@{\'test}', [])).toBe('@{\'test}')
    })

    it('should treat malformed number as context id', () => {
      expect(replaceBindings('@{5o1}', [{ id: '5o1', value: 'test'}])).toBe('test')
    })

    it('should do nothing with malformed number and invalid context id', () => {
      expect(replaceBindings('@{58.72.98}', [{ id: '58.72.98', value: 'test'}])).toBe('@{58.72.98}')
    })
  })

  describe('Operations', () => {
    it('should execute operation with literals', () => {
      expect(replaceBindings('@{sum(5, 7)}', [])).toBe(12)
    })

    it('should execute operation with context bindings', () => {
      const contexts = [{ id: 'user', value: { age: 12 } }, { id: 'adultAge', value: 18 }]
      expect(replaceBindings('@{subtract(adultAge, user.age)}', contexts)).toBe(6)
    })

    it('should execute operation with both context bindings and literals', () => {
      const contexts = [{ id: 'user', value: { age: 12 } }]
      expect(replaceBindings('@{subtract(18, user.age)}', contexts)).toBe(6)
    })

    it('should execute operation with operations', () => {
      const contexts = [{ id: 'values', value: [5, 8, 2, 7] }]
      expect(
        replaceBindings(
          '@{multiply(sum(values[0], values[1]), subtract(values[2], values[3]))}',
          contexts,
        )
      ).toBe(-65)
    })

    it('should chain operations', () => {
      const contextHierarchy = [{ id: 'counter', value: { a: 0, b: 1 } }]
      const expression = '@{condition(lte(sum(counter.a, 2, counter.b), 5), \'a + 2 + b <= 5, (true)\', \'a + 2 + b > 5, (false)\')}'
      const result1 = replaceBindings(expression, contextHierarchy)
      contextHierarchy[0].value.a = 3
      const result2 = replaceBindings(expression, contextHierarchy)
      expect(result1).toBe('a + 2 + b <= 5, (true)')
      expect(result2).toBe('a + 2 + b > 5, (false)')
    })

    it('should correctly handle symbols inside a string', () => {
      const expression = '@{concat(\'()}{}((),(\', \'test),(}\')}'
      expect(replaceBindings(expression, [])).toBe('()}{}((),(test),(}')
    })

    it('should ignore space between parameters', () => {
      expect(replaceBindings('@{concat( \'a\'    ,\'b\' ,     \'c\'  )}', [])).toBe('abc')
      expect(replaceBindings('@{concat(\'a\',\'b\',\'c\')}', [])).toBe('abc')
    })

    it('should log warning and do nothing else if operation doesn\'t exist', () => {
      const originalConsoleWarn = console.warn
      console.warn = jest.fn()

      expect(replaceBindings('@{blah(42)}', [])).toBe('@{blah(42)}')
      expect(console.warn).toHaveBeenCalled()

      console.warn = originalConsoleWarn
    })

    it('should log warning and do nothing else for malformed parameter list', () => {
      const originalConsoleWarn = console.warn
      console.warn = jest.fn()

      expect(replaceBindings('@{sum(2, 4))}', [])).toBe('@{sum(2, 4))}')
      expect(replaceBindings('@{sum(4(2)}', [])).toBe('@{sum(4(2)}')
      expect(replaceBindings('@{sum(2))}', [])).toBe('@{sum(2))}')
      expect(replaceBindings('@{sum(,),)}', [])).toBe('@{sum(,),)}')
      expect(console.warn).toHaveBeenCalledTimes(4)

      console.warn = originalConsoleWarn
    })

    it('should log error and do nothing else for malformed operation name', () => {
      const originalConsoleWarn = console.warn
      console.warn = jest.fn()

      expect(replaceBindings('@{2sum(4, 2)}', [])).toBe('@{2sum(4, 2)}')
      expect(replaceBindings('@{sum-test(4, 2)}', [])).toBe('@{sum-test(4, 2)}')
      expect(replaceBindings('@{s)um(4, 2)}', [])).toBe('@{s)um(4, 2)}')
      expect(console.warn).toHaveBeenCalledTimes(3)

      console.warn = originalConsoleWarn
    })
  })
})
