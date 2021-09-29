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

import nock from 'nock'
import BeagleService from 'service/beagle-service'
import { BeagleView as BeagleViewType } from 'beagle-view/types'
import BeagleView from 'beagle-view'
import { treeA } from './mocks'

const baseUrl = 'http://teste.com'
const path = '/myview'

describe('ViewContentManager', () => {
  const viewId = 'beagleId'
  /* fixme: this is a terrible sign, if this test suit needs the entire beagle service to pass, its
  tests are clearly not unitary. */
  const service = BeagleService.create({
    baseUrl,
    components: {},
  })
  const { viewContentManagerMap } = service
  let view: BeagleViewType

  beforeEach(() => {
    viewContentManagerMap.unregister(viewId)
    view = BeagleView.create(service)
    view.getRenderer().doFullRender(treeA)
    viewContentManagerMap.register(viewId, view)
    nock.cleanAll()
  })

  it('should register a view', () => {
    expect(viewContentManagerMap.isRegistered(viewId)).toBe(true)
  })

  it('should create a context for a view', async () => {
    const context = viewContentManagerMap.get(viewId, 'A.1')

    expect(context.getView).toBeDefined()
    expect(context.getElement).toBeDefined()
    expect(context.getElementId).toBeDefined()
  })

  it('should get view, element and elementId from context', () => {
    const context = viewContentManagerMap.get(viewId, 'A.1')

    expect(context.getView).toBeDefined()
    const getView = context.getView()
    expect(getView).toEqual(view)

    expect(context.getElement).toBeDefined()
    const element = context.getElement()
    expect(element).toStrictEqual(treeA.children![1])

    expect(context.getElementId).toBeDefined()
    const elementId = context.getElementId()
    expect(elementId).toBe('A.1')
  })

  it('should throw an error trying to create a context for an unregistered view', () => {
    try {
      viewContentManagerMap.get('viewNotRegistered', '1')
    } catch {
      expect(viewContentManagerMap.get).toThrowError()
    }
  })

  it('should throw an Beagle Error when trying to create a context without a viewId', () => {
    expect(() => {
      viewContentManagerMap.get(viewId, '')
    }).toThrow(
        new Error(`Beagle: ViewContentManagerMap couldn't find viewId or elementId`)
    )
  })

  it('should throw an Beagle Error when trying to create a context without a elementId', () => {
    expect(() => {
      viewContentManagerMap.get('', '1');
    }).toThrow(
        new Error(`Beagle: ViewContentManagerMap couldn't find viewId or elementId`)
    )
  })

  it('should throw an Beagle Error when trying to create a context and couldn\'t find view with provided id', () => {
    expect(() => {
      viewContentManagerMap.get('testid', '1');
    }).toThrow(
        new Error(`Beagle: ViewContentManagerMap couldn\'t find view with id testid`)
    )
  })

  it('should unregister a view', () => {
    viewContentManagerMap.unregister('beagleId')
    expect(viewContentManagerMap.isRegistered('beagleId')).toBe(false)
  })

})

describe('BeagleContext (Legacy)', () => {
  const viewId = 'beagleId'
  /* fixme: this is a terrible sign, if this test suit needs the entire beagle service to pass, its
  tests are clearly not unitary. */
  const service = BeagleService.create({
    baseUrl,
    components: {},
  })
  const { viewContentManagerMap } = service
  let view: BeagleViewType

  beforeEach(() => {
    viewContentManagerMap.unregister(viewId)
    view = BeagleView.create(service)
    view.getRenderer().doFullRender(treeA)
    viewContentManagerMap.register(viewId, view)
    nock.cleanAll()
  })
})
