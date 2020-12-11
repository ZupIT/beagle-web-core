/**
 * @jest-environment jsdom
 */

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

/**
 * @jest-environment jsdom
 */

import { AnalyticsConfig, AnalyticsProvider, AnalyticsRecord, BeagleAction, IdentifiableBeagleUIElement, Route } from 'index'
import { AnalyticsService } from 'service/analytics/types'
import analyticsService from '../../../../src/service/analytics'
import * as htmlHelpers from 'utils/html'

describe('Actions Analytics Service', () => {

  let analyticsConfigMock: AnalyticsConfig
  let beagleActionMock: BeagleAction
  let componentMock: IdentifiableBeagleUIElement
  let routeMock: Route

  const eventName = 'OnPress'
  beagleActionMock = {
    _beagleAction_: 'beagle:pushView',
    route: { screen: { id: 'screenMock' } }
  }
  componentMock = {
    _beagleComponent_: 'beagle:button',
    id: 'beagle_mock',
    onPress: beagleActionMock
  }
  routeMock = {
    url: 'text.action.payload'
  }


  function analytics(): AnalyticsProvider {

    function getConfig() {
      return new Promise<AnalyticsConfig>((resolve, reject) => {
        resolve({
          enableScreenAnalytics: true,
          actions: { 'beagle:pushView': ['route.screen'] }
        })
      })
    }

    function createRecord(record: AnalyticsRecord) {
    }

    function startSession() {
      return new Promise<void>((resolve, reject) => {
        resolve()
      })
    }

    return {
      getConfig,
      createRecord,
      startSession
    }
  }

  function analytyticsWithDelay(): AnalyticsProvider {
    
    function getConfig() {
      return new Promise<AnalyticsConfig>((resolve, reject) => {
        resolve({
          enableScreenAnalytics: true,
          actions: { 'beagle:pushView': ['route.screen'] }
        })
      })
    }

    function createRecord(record: AnalyticsRecord) {
    }

    function startSession() {
      return new Promise<void>((resolve, reject) => {
        resolve() 
      })
    }

    return {
      getConfig,
      createRecord,
      startSession
    }

  }

  let provider: AnalyticsProvider = analytics()
  let analyticsServiceMock: AnalyticsService

  beforeAll(() => {
    //@ts-ignore
    htmlHelpers.getElementPosition = jest.fn().mockReturnValue({ x: 10, y: 10 })
    //@ts-ignore
    htmlHelpers.getElementByBeagleId = jest.fn().mockReturnValue('<div>button</div>')
    //@ts-ignore
    htmlHelpers.getPath = jest.fn().mockReturnValue('BODY/ROOT/DIV[3]/DIV/BUTTON')
  })

  beforeEach(()=>{
    spyOn(provider, 'createRecord').and.callThrough()
  })

  it('should call create Record for Action', async () => {
    analyticsServiceMock = analyticsService.create(provider)
    const expectedRecord = {
      type: 'action',
      platform: 'WEB Jest',
      event: 'OnPress',
      component: {
        type: 'beagle:button',
        id: 'beagle_mock',
        position: { x: 10, y: 10 },
        xPath: 'BODY/ROOT/DIV[3]/DIV/BUTTON'
      },
      beagleAction: 'beagle:pushView',
      'route.screen': { id: 'screenMock' },
      url: 'text.action.payload'
    }
    await analyticsServiceMock.createActionRecord(beagleActionMock, eventName, componentMock, 'Jest', routeMock)
    expect(provider.createRecord).toHaveBeenCalledWith(expectedRecord)

  })

  it('should NOT call create Record for Action', async () => {
    analyticsConfigMock = {
      enableScreenAnalytics: true,
      actions: { 'beagle:pushStack': [] }
    }

    provider.getConfig = (async () => analyticsConfigMock)
    analyticsServiceMock = analyticsService.create(provider)
    await analyticsServiceMock.createActionRecord(beagleActionMock, eventName, componentMock, 'Jest', routeMock)
    expect(provider.createRecord).toHaveBeenCalledTimes(0)

  })

  it('should call create Record if Action has Analytics enabled', async () => {
    analyticsConfigMock = {
      enableScreenAnalytics: true,
      actions: { 'beagle:pushStack': [] }
    }
    beagleActionMock = {
      _beagleAction_: 'beagle:pushView',
      route: { screen: { id: 'screenMock' } },
      analytics:{
        enable: true
      }
    }

    provider.getConfig = (async () => analyticsConfigMock)
    analyticsServiceMock = analyticsService.create(provider)
    await analyticsServiceMock.createActionRecord(beagleActionMock, eventName, componentMock, 'Jest', routeMock)
    expect(provider.createRecord).toHaveBeenCalled()

  })

  it('should call create Record for Action with additional entries', async () => {
    analyticsServiceMock = analyticsService.create(provider)
    const expectedRecord = {
      type: 'action',
      platform: 'WEB Jest',
      event: 'OnPress',
      component: {
        type: 'beagle:button',
        id: 'beagle_mock',
        position: { x: 10, y: 10 },
        xPath: 'BODY/ROOT/DIV[3]/DIV/BUTTON'
      },
      beagleAction: 'beagle:pushView',
      url: 'text.action.payload',
      extra: 'test extra info'
    }

    beagleActionMock = {
      _beagleAction_: 'beagle:pushView',
      route: { screen: { id: 'screenMock' } },
      analytics:{
        enable: true,
        additionalEntries:{extra: 'test extra info'}
      }
    }

    analyticsConfigMock = {
      enableScreenAnalytics: true,
      actions: { 'beagle:pushView': [] }
    }

    provider.getConfig = (async () => analyticsConfigMock)
    analyticsServiceMock = analyticsService.create(provider)
    await analyticsServiceMock.createActionRecord(beagleActionMock, eventName, componentMock, 'Jest', routeMock)
    expect(provider.createRecord).toHaveBeenCalledWith(expectedRecord)

  })

  it('should call create Record for Screen', async () => {
    const expectedRecord = { type: 'screen', platform: 'WEB Jest', url: 'text.action.payload' }

    analyticsConfigMock = {
      enableScreenAnalytics: true,
      actions: { 'beagle:pushStack': [] }
    }

    provider.getConfig = (async () => analyticsConfigMock)
    analyticsServiceMock = analyticsService.create(provider)
    await analyticsServiceMock.createScreenRecord(routeMock,'Jest')
    expect(provider.createRecord).toHaveBeenCalledWith(expectedRecord)

  })

  it('should NOT call create Record for Screen', async () => {
    analyticsConfigMock = {
      enableScreenAnalytics: false,
      actions: { 'beagle:pushStack': [] }
    }

    provider.getConfig = (async () => analyticsConfigMock)
    analyticsServiceMock = analyticsService.create(provider)
    await analyticsServiceMock.createScreenRecord(routeMock,'Jest')
    expect(provider.createRecord).toHaveBeenCalledTimes(0)

  })

  it('should pass a value for queue size', async () => {
    

  })

  // it('should NOT pass a value for queue size', async () => {
    

  // })

  // it('shold check if items are being added in queue', async () => {
    

  // })

  // it('Should show warning when exceeding queue max capacity ', async () => {
    

  // })

  // it('Should verify if last item has been removed from the queue while waiting for config promises', async () => {
    

  // })

})
