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

import LocalContextsManager from 'beagle-view/local-contexts/manager'
import { LocalContextsManager as LocalContextsManagerType } from 'beagle-view/local-contexts/types'
import * as LocalContext from 'beagle-view/local-contexts/context'

describe('LocalContextsManager', () => {
  let manager: LocalContextsManagerType

  beforeEach(() => {
    manager = LocalContextsManager.create()
  })

  it('should return undefined when the context does not exists', () => {
    const context = manager.getContext('my-context')
    expect(context).toBeUndefined()
  })

  it('should return and empty array when there is no localContext to be get as DataContext', () => {
    expect(manager.getAllAsDataContext()).toEqual([])
  })

  it('should create a new local context when a local context do not exists with same one', () => {
    expect(manager.getAllAsDataContext().length).toBe(0)

    const expectedLocalContext = LocalContext.default.create('my-context')
    const createSpy = jest.spyOn(LocalContext.default, 'create').mockImplementation(() => expectedLocalContext)
    const setSpy = jest.spyOn(expectedLocalContext, 'set')

    manager.setContext('my-context', { my: 'value' }, 'my-path')

    expect(createSpy).toHaveBeenCalledWith('my-context')
    expect(setSpy).toHaveBeenCalledWith({ my: 'value' }, 'my-path')

    const dataContexts = manager.getAllAsDataContext()
    expect(dataContexts.length).toBe(1)
    expect(dataContexts[0]).toEqual({ id: 'my-context', value: { 'my-path': { my: 'value' } } })

    createSpy.mockRestore()
    setSpy.mockRestore()
  })

  it('should return a LocalContext object when the provided id matches with an existing one', () => {
    manager.setContext('my-context', { my: 'value' }, 'my-path')
    const myContext = manager.getContext('my-context')
    expect(myContext).toBeDefined()
    expect(myContext?.getAsDataContext()).toEqual({ id: 'my-context', value: { 'my-path': { my: 'value' } } })
  })

  it('should edit the existing context when the id provided matches with an existing one', () => {
    manager.setContext('my-context', { my: 'value' }, 'my-path')

    const myContext = manager.getContext('my-context')
    const createSpy = jest.spyOn(LocalContext.default, 'create')
    const setSpy = jest.spyOn(myContext!, 'set')

    manager.setContext('my-context', 'edited value', 'my-2nd-path')

    expect(createSpy).not.toHaveBeenCalled()
    expect(setSpy).toHaveBeenCalledWith('edited value', 'my-2nd-path')

    const dataContexts = manager.getAllAsDataContext()
    expect(dataContexts.length).toBe(1)
    expect(dataContexts[0]).toEqual({ id: 'my-context', value: { 'my-path': { my: 'value' }, 'my-2nd-path': 'edited value' } })

    createSpy.mockRestore()
    setSpy.mockRestore()
  })

  it('should return an array when there are localContexts to be get as DataContext', () => {
    manager.setContext('my-1st-context', { my: 'value' }, 'my-path')
    manager.setContext('my-2nd-context', { my: 'value' }, 'my-path')
    manager.setContext('my-3rd-context', { my: 'value' }, 'my-path')

    const dataContexts = manager.getAllAsDataContext()
    expect(dataContexts.length).toBe(3)
    expect(dataContexts[0].id).toBe('my-1st-context')
    expect(dataContexts[1].id).toBe('my-2nd-context')
    expect(dataContexts[2].id).toBe('my-3rd-context')
  })

  it('should return undefined when the context does not exists to be get as DataContext', () => {
    const context = manager.getContextAsDataContext('my-context')
    expect(context).toBeUndefined()
  })

  it('should return a DataContext object when the provided id matches with an existing one to be get as DataContext', () => {
    manager.setContext('my-context', { my: 'value' }, 'my-path')
    const myContext = manager.getContextAsDataContext('my-context')
    expect(myContext).toBeDefined()
    expect(myContext?.id).toBeDefined()
    expect(myContext?.value).toBeDefined()
    expect(myContext).toEqual({ id: 'my-context', value: { 'my-path': { my: 'value' } } })
  })

  it('should remove the context that matches the id provided', () => {
    manager.setContext('my-1st-context', { my: 'value' }, 'my-path')
    manager.setContext('my-2nd-context', { my: 'value' }, 'my-path')
    manager.setContext('my-3rd-context', { my: 'value' }, 'my-path')

    expect(manager.getAllAsDataContext().length).toBe(3)

    manager.removeContext('my-2nd-context')

    expect(manager.getAllAsDataContext().length).toBe(2)
    expect(manager.getAllAsDataContext()[0].id).toBe('my-1st-context')
    expect(manager.getAllAsDataContext()[1].id).toBe('my-3rd-context')
  })

  it('should not remove any context when the id provided does not match with any context', () => {
    manager.setContext('my-1st-context', { my: 'value' }, 'my-path')
    manager.setContext('my-2nd-context', { my: 'value' }, 'my-path')
    manager.setContext('my-3rd-context', { my: 'value' }, 'my-path')

    expect(manager.getAllAsDataContext().length).toBe(3)

    manager.removeContext('my-4th-context')

    expect(manager.getAllAsDataContext().length).toBe(3)
    expect(manager.getAllAsDataContext()[0].id).toBe('my-1st-context')
    expect(manager.getAllAsDataContext()[1].id).toBe('my-2nd-context')
    expect(manager.getAllAsDataContext()[2].id).toBe('my-3rd-context')
  })

  it('should not crash when the contexts list is empty and a removal is attempted', () => {
    expect(manager.getAllAsDataContext().length).toBe(0)
    expect(() => manager.removeContext('my-4th-context')).not.toThrow()
  })

  it('should clear the local context list', () => {
    manager.setContext('my-1st-context', { my: 'value' }, 'my-path')
    manager.setContext('my-2nd-context', { my: 'value' }, 'my-path')
    manager.setContext('my-3rd-context', { my: 'value' }, 'my-path')

    expect(manager.getAllAsDataContext().length).toBe(3)

    manager.clearAll()

    expect(manager.getAllAsDataContext().length).toBe(0)
  })

  it('should not crash when and attempt to clear all the contexts is made but there are no contexts', () => {
    expect(manager.getAllAsDataContext().length).toBe(0)
    expect(() => manager.clearAll()).not.toThrow()
  })
})
