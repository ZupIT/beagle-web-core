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

import GlobalContext from "service/global-context"
import { usersObjectCellphone, usersObject } from "./mocks-global-context"

/* fixme: all tests here are dependent from one another. This is bad, tests should be atomic, fix
asap. */
describe('globalContext', () => {
  const listener = jest.fn()
  const globalContext = GlobalContext.create()
  globalContext.subscribe(listener)

  beforeEach(() => {
    listener.mockClear()
    globalMocks.log.mockClear()
  })

  it('should initialize context with \'global\' as id and return it with getAsDataContext', async () => {
    const initialContext = { id: 'global', value: null }
    const getAllResult = globalContext.getAsDataContext()
    expect(getAllResult).toEqual(initialContext)
  })

  // Testing global context with object
  it('set with path should alter the object creating the hierarch path and trigger listeners', () => {
    const path = 'testing.path'

    globalContext.set('testingValue', path)
    const obj = {
      id: 'global',
      value: {
        testing: {
          path: 'testingValue'
        }
      }
    }
    expect(listener).toHaveBeenCalled()
    expect(globalContext.getAsDataContext()).toEqual(obj)
  })

  it('get with path should return only corresponding value', () => {
    const path = 'testing.path'
    expect(globalContext.get(path)).toEqual('testingValue')
  })

  it('get without path should return the entire value object', () => {
    const value = {
      testing: {
        path: 'testingValue'
      }
    }
    expect(globalContext.get()).toEqual(value)
  })

  it('get with invalid path should return undefined', () => {
    const path = 'invalid.path'
    expect(globalContext.get(path)).toEqual(undefined)
  })

  it('set without path should override entire context and trigger listeners', () => {
    const text = 'new Value without path'
    globalContext.set(text)
    const obj = {
      id: 'global',
      value: text
    }

    expect(listener).toHaveBeenCalled()
    expect(globalContext.getAsDataContext()).toEqual(obj)
  })

  it('clear without path should clean value prop and trigger listeners', () => {
    globalContext.clear()
    const cleanedContext = { id: 'global', value: null }
    expect(listener).toHaveBeenCalled()
    expect(globalContext.getAsDataContext()).toEqual(cleanedContext)
  })

  it('clear with path should clean value prop and trigger listeners', () => {
    // Set to prepare for clear testing
    const path = 'testing.clear.path'
    globalContext.set('testingValue', path)
    const obj = {
      id: 'global',
      value: {
        testing: {
          clear: {
            path: 'testingValue'
          }
        }
      }
    }
    expect(globalContext.getAsDataContext()).toEqual(obj)

    const newObj = {
      id: 'global',
      value: {
        testing: {
          clear: {}
        }
      }
    }
    globalContext.clear(path)

    expect(listener).toHaveBeenCalledTimes(1)
    expect(globalContext.getAsDataContext()).toEqual(newObj)
  })

  it('clear with path should delete subtree only preserving siblings', () => {
    // Set to prepare for clear testing
    const path = 'testing.clear.path'
    globalContext.set('testingValue', path)
    globalContext.set('testingOtherValue', 'testing.otherPath')
    const obj = {
      id: 'global',
      value: {
        testing: {
          clear: {
            path: 'testingValue'
          },
          otherPath: 'testingOtherValue'
        }
      }
    }
    expect(globalContext.getAsDataContext()).toEqual(obj)

    const newObj = {
      id: 'global',
      value: {
        testing: {
          otherPath: 'testingOtherValue'
        }
      }
    }
    globalContext.clear('testing.clear')
    expect(listener).toHaveBeenCalledTimes(2)
    expect(globalContext.getAsDataContext()).toEqual(newObj)
  })

  it('should set object in context when receiving one', () => {
    globalContext.clear()

    globalContext.set({
      name: 'Fulano da Silva',
      cpf: '000.000.000-00',
      balance: 58.9
    }, 'user')
    const obj = {
      id: 'global',
      value: {
        user: {
          name: 'Fulano da Silva',
          cpf: '000.000.000-00',
          balance: 58.9
        }
      }
    }
    expect(globalContext.getAsDataContext()).toEqual(obj)
    expect(globalContext.get()).toEqual(obj.value)
  })

  // Testing global context with array

  it('set should insert array elements correctly', () => {
    globalContext.clear()
    globalContext.set({
      name: 'Fulano',
      cpf: '000.000.000-00'
    }, 'users[0]')

    globalContext.set({
      name: 'Maria',
      cpf: '111.111.111-11'
    }, 'users[1]')

    globalContext.set({
      name: 'Jose',
      cpf: '222.222.222-22'
    }, 'users[2]')

    expect(globalContext.get()).toStrictEqual(usersObject)
  })

  it('clear array position should set the position to null', () => {
    globalContext.clear('users[1]')
    const value = {
      users: [
        { name: "Fulano", cpf: '000.000.000-00' },
        undefined,
        { name: "Jose", cpf: '222.222.222-22' }
      ]
    }
    expect(globalContext.get()).toStrictEqual(value)
  })

  it('clear property inside array position should remove the key', () => {
    globalContext.clear('users[0].name')
    const value = {
      users: [
        { cpf: '000.000.000-00' },
        undefined,
        { name: "Jose", cpf: '222.222.222-22' }
      ]
    }
    expect(globalContext.get()).toStrictEqual(value)
  })

  it('set should insert multiple levels of array elements correctly', () => {
    globalContext.clear()
    globalContext.set({
      name: 'Fulano',
      cpf: '000.000.000-00'
    }, 'users[0]')

    globalContext.set({
      phone: '9999',
      ddd: '34'
    }, 'users[0].cellphone[0]')

    globalContext.set({
      phone: '8888',
      ddd: '31'
    }, 'users[0].cellphone[1]')

    globalContext.set({
      name: 'Maria',
      cpf: '111.111.111-11'
    }, 'users[1]')

    globalContext.set({
      phone: '0000',
      ddd: '11'
    }, 'users[1].cellphone[0]')

    globalContext.set({
      phone: '1111',
      ddd: '64'
    }, 'users[1].cellphone[1]')

    globalContext.set({
      name: 'Jose',
      cpf: '222.222.222-22'
    }, 'users[2]')

    globalContext.set({
      phone: '2222',
      ddd: '61'
    }, 'users[2].cellphone[0]')

    expect(globalContext.get()).toStrictEqual(usersObjectCellphone)
  })

  it('clear should handle object key, array positions and entire object', () => {
    globalContext.clear('users[0].cellphone[1].phone')
    globalContext.clear('users[1].cpf')
    globalContext.clear('users[1].cellphone[0]')
    globalContext.clear('users[2].cellphone')
    const value = {
      users: [
        {
          name: "Fulano", cpf: '000.000.000-00',
          cellphone: [{ ddd: '34', phone: '9999' }, { ddd: '31' }]
        },
        {
          name: "Maria",
          cellphone: [undefined, { ddd: '64', phone: '1111' }]
        },
        {
          name: "Jose", cpf: '222.222.222-22'
        }
      ]
    }
    expect(globalContext.get()).toStrictEqual(value)
  })

  //Testing helper functions

  it('should warn if context has value but path not found', () => {
    globalContext.clear('testing.clear.path')
    expect(globalMocks.log).toHaveBeenCalled()
    expect(globalMocks.log.mock.calls[0][0]).toBe('warn')
  })

  it('should warn if empty context trying to clear some specific path', () => {
    globalContext.clear()
    globalContext.clear('testing.clear.path')
    expect(globalMocks.log).toHaveBeenCalledWith('warn', expect.any(String))
  })

  it('unsubscribe should remove listener', () => {
    const listener1: jest.Mock = jest.fn(() => unsubscribe1)
    const listener2: jest.Mock = jest.fn(() => unsubscribe2)
    const unsubscribe1 = globalContext.subscribe(listener1)
    const unsubscribe2 = globalContext.subscribe(listener2)

    const value = {
      testing: {
        path: 'testingValue'
      }
    }

    globalContext.set(value)
    unsubscribe1()
    globalContext.set(value)
    expect(listener1).toHaveBeenCalledTimes(1)
    expect(listener2).toHaveBeenCalledTimes(2)
  })

})
