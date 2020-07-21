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
import globalContextApi, { cloneObject } from "../src/GlobalContextAPI"
import { hasDifferentPointers } from "./utils/test-utils"
import { usersObjectCellphone, usersObject } from "./mocks-global-context"

const baseUrl = 'http://teste.com'

describe.only('globalContextApi', () => {
  let listener
  
  beforeEach(() => {
    jest.clearAllMocks();
    listener = jest.fn()
    globalContextApi.subscribe(listener)
  });

  it('should initialize context with \'global\' as id and return it with getAsDataContext', async () => {
    const initialContext = { id: 'global', value: null }
    const getAllResult = globalContextApi.getAsDataContext()
    expect(getAllResult).toEqual(initialContext)
  })

  // Testing global context with object

  it('set with path should alter the object creating the hierarch path and trigger listeners', () => {
    const path = 'testing.path'

    globalContextApi.set('testingValue', path)
    const obj = {
      id: 'global',
      value: {
        testing: {
          path: 'testingValue'
        }
      }
    }
    expect(listener).toHaveBeenCalled()
    expect(globalContextApi.getAsDataContext()).toEqual(obj)
  })

  it('get with path should return only corresponding value', () => {
    const path = 'testing.path'
    expect(globalContextApi.get(path)).toEqual('testingValue')
  })

  it('get without path should return the entire value object', () => {
    const value = {
      testing: {
        path: 'testingValue'
      }
    }
    expect(globalContextApi.get()).toEqual(value)
  })

  it('get with invalid path should return undefined', () => {
    const path = 'invalid.path'
    expect(globalContextApi.get(path)).toEqual(undefined)
  })

  it('set without path should override entire context and trigger listeners', () => {
    const text = 'new Value without path'
    globalContextApi.set(text)
    const obj = {
      id: 'global',
      value: text
    }
    
    expect(listener).toHaveBeenCalled()
    expect(globalContextApi.getAsDataContext()).toEqual(obj)
  })

  it('clear without path should clean value prop and trigger listeners', () => {
    globalContextApi.clear()
    const cleanedContext = { id: 'global', value: null }
    expect(listener).toHaveBeenCalled()
    expect(globalContextApi.getAsDataContext()).toEqual(cleanedContext)
  })

  it('clear with path should clean value prop and trigger listeners', () => {
    // Set to prepare for clear testing
    const path = 'testing.clear.path'
    globalContextApi.set('testingValue', path)
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
    expect(globalContextApi.getAsDataContext()).toEqual(obj)

    const newObj = {
      id: 'global',
      value: {
        testing: {
          clear: {}
        }
      }
    }
    globalContextApi.clear(path)
    
    expect(listener).toHaveBeenCalledTimes(2)
    expect(globalContextApi.getAsDataContext()).toEqual(newObj)
  })

  it('clear with path should delete subtree only preserving siblings', () => {
    // Set to prepare for clear testing
    const path = 'testing.clear.path'
    globalContextApi.set('testingValue', path)
    globalContextApi.set('testingOtherValue', 'testing.otherPath')
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
    expect(globalContextApi.getAsDataContext()).toEqual(obj)

    const newObj = {
      id: 'global',
      value: {
        testing: {
          otherPath: 'testingOtherValue'
        }
      }
    }
    globalContextApi.clear('testing.clear')
    expect(listener).toHaveBeenCalledTimes(3)
    expect(globalContextApi.getAsDataContext()).toEqual(newObj)
  })

  it('should set object in context when receiving one', () => {
    globalContextApi.clear()

    globalContextApi.set({
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
    expect(globalContextApi.getAsDataContext()).toEqual(obj)
    expect(globalContextApi.get()).toEqual(obj.value)
  })

  // Testing global context with array

  it('set should insert array elements correctly', () => {
    globalContextApi.clear()
    globalContextApi.set({
      name: 'Fulano',
      cpf: '000.000.000-00'
    }, 'users[0]')

    globalContextApi.set({
      name: 'Maria',
      cpf: '111.111.111-11'
    }, 'users[1]')

    globalContextApi.set({
      name: 'Jose',
      cpf: '222.222.222-22'
    }, 'users[2]')

    expect(globalContextApi.get()).toStrictEqual(usersObject)
  })

  it('clear array position should set the position to null', () => {
    globalContextApi.clear('users[1]')
    const value = {
      users: [
        { name: "Fulano", cpf: '000.000.000-00' },
        null,
        { name: "Jose", cpf: '222.222.222-22' }
      ]
    }
    expect(globalContextApi.get()).toStrictEqual(value)
  })

  it('clear property inside array position should remove the key', () => {
    globalContextApi.clear('users[0].name')
    const value = {
      users: [
        { cpf: '000.000.000-00' },
        null,
        { name: "Jose", cpf: '222.222.222-22' }
      ]
    }
    expect(globalContextApi.get()).toStrictEqual(value)
  })

  it('set should insert multiple levels of array elements correctly', () => {
    globalContextApi.clear()
    globalContextApi.set({
      name: 'Fulano',
      cpf: '000.000.000-00'
    }, 'users[0]')

    globalContextApi.set({
      phone: '9999',
      ddd: '34'
    }, 'users[0].cellphone[0]')

    globalContextApi.set({
      phone: '8888',
      ddd: '31'
    }, 'users[0].cellphone[1]')

    globalContextApi.set({
      name: 'Maria',
      cpf: '111.111.111-11'
    }, 'users[1]')

    globalContextApi.set({
      phone: '0000',
      ddd: '11'
    }, 'users[1].cellphone[0]')

    globalContextApi.set({
      phone: '1111',
      ddd: '64'
    }, 'users[1].cellphone[1]')

    globalContextApi.set({
      name: 'Jose',
      cpf: '222.222.222-22'
    }, 'users[2]')

    globalContextApi.set({
      phone: '2222',
      ddd: '61'
    }, 'users[2].cellphone[0]')

    expect(globalContextApi.get()).toStrictEqual(usersObjectCellphone)
  })

  it('clear should handle object key, array positions and entire object', () => {
    globalContextApi.clear('users[0].cellphone[1].phone')
    globalContextApi.clear('users[1].cpf')
    globalContextApi.clear('users[1].cellphone[0]')
    globalContextApi.clear('users[2].cellphone')
    const value = {
      users: [
        {
          name: "Fulano", cpf: '000.000.000-00',
          cellphone: [{ ddd: '34', phone: '9999' }, { ddd: '31' }]
        },
        {
          name: "Maria",
          cellphone: [null, { ddd: '64', phone: '1111' }]
        },
        {
          name: "Jose", cpf: '222.222.222-22'
        }
      ]
    }
    expect(globalContextApi.get()).toStrictEqual(value)
  })

  //Testing helper functions

  it('should clone object', () => {
    const cloned = cloneObject(usersObjectCellphone)
    expect(cloned).toEqual(usersObjectCellphone)
    expect(hasDifferentPointers(cloned, usersObjectCellphone)).toBe(true)
  })

  it('should warn if context has value but path not found', () => {
    const originalWarn = console.warn
    console.warn = jest.fn()
    globalContextApi.clear('testing.clear.path')
    expect(console.warn).toHaveBeenCalled()
    console.warn = originalWarn
  })

  it('should warn if empty context trying to clear some specific path', () => {
    globalContextApi.clear()
    const originalWarn = console.warn
    console.warn = jest.fn()

    globalContextApi.clear('testing.clear.path')
    expect(console.warn).toHaveBeenCalled()
    console.warn = originalWarn
  })

})
