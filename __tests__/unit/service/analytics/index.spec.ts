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
import { ActionRecordParams, AnalyticsService, ScreenRecordParams } from 'service/analytics/types'
import analyticsService from '../../../../src/service/analytics'
import * as htmlHelpers from 'utils/html'
import action from 'beagle-view/render/action'

describe('Actions Analytics Service', () => {

  let analyticsConfigMock: AnalyticsConfig
  let actionMock: BeagleAction
  let expectedRecordBase: any
  let recordBase: ActionRecordParams
  let screenBase: ScreenRecordParams
  const promiseArray = [1, 2, 3]

  screenBase = {
    route: {
      url: 'text.action.payload'
    },
    platform: 'Jest',
  }

  actionMock = {
    _beagleAction_: 'beagle:pushView',
    route: { screen: { id: 'screenMock' } }
  }

  recordBase = {
    eventName: 'OnPress',
    platform: 'Jest',
    component: {
      _beagleComponent_: 'beagle:button',
      id: 'beagle_mock',
      onPress: actionMock
    },
    action: actionMock,
    route: {
      url: 'text.action.payload'
    },
  }

  expectedRecordBase = {
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
    screen: 'text.action.payload',
    timestamp: 10
  }

  analyticsConfigMock = {
    enableScreenAnalytics: true,
    actions: { 'beagle:pushStack': [] }
  }


  function analytics(): AnalyticsProvider {

    function getConfig() {
      return {
        enableScreenAnalytics: true,
        actions: { 'beagle:pushView': ['route.screen'] }
      }
    }

    function createRecord(record: AnalyticsRecord) {
    }

    return {
      getConfig,
      createRecord,
    }
  }

  function analyticsWithDelay(): AnalyticsProvider {

    let delayedConfig: AnalyticsConfig | null = null

    function getConfig() {
      setTimeout(() => {
        delayedConfig = {
          enableScreenAnalytics: true,
          actions: { 'beagle:pushView': ['route.screen'] }
        }
      }, 4000);
      return delayedConfig
    }

    function createRecord(record: AnalyticsRecord) { }

    return {
      getConfig,
      createRecord,
    }
  }

  let provider: AnalyticsProvider = analytics()
  let providerWithDelay: AnalyticsProvider = analyticsWithDelay()
  let analyticsServiceMock: AnalyticsService

  beforeAll(() => {
    //@ts-ignore
    htmlHelpers.getElementPosition = jest.fn().mockReturnValue({ x: 10, y: 10 })
    //@ts-ignore
    htmlHelpers.getElementByBeagleId = jest.fn().mockReturnValue('<div>button</div>')
    //@ts-ignore
    htmlHelpers.getPath = jest.fn().mockReturnValue('BODY/ROOT/DIV[3]/DIV/BUTTON')
  })

  beforeEach(() => {
    globalMocks.log.mockClear()
    spyOn(Date, 'now').and.returnValue(10)
    spyOn(provider, 'createRecord').and.callThrough()
    spyOn(providerWithDelay, 'createRecord').and.callThrough()
  })

  it('should call create Record for Action', () => {
    analyticsServiceMock = analyticsService.create(provider)
    actionMock = { ...actionMock, analytics: true }
    let recordMock = { ...recordBase, action: actionMock }

    analyticsServiceMock.createActionRecord(recordMock)

    expect(provider.createRecord).toHaveBeenCalledWith(expectedRecordBase)

  })

  it('should NOT call create Record for Action', () => {

    provider.getConfig = (() => analyticsConfigMock)
    actionMock = { ...actionMock, analytics: false }
    let recordMock = { ...recordBase, action: actionMock }

    analyticsServiceMock = analyticsService.create(provider)
    analyticsServiceMock.createActionRecord(recordMock)
    expect(provider.createRecord).toHaveBeenCalledTimes(0)

  })

  it('should call create Record for Action with additional entries', () => {

    expectedRecordBase = {
      ...expectedRecordBase,
      extra: 'test extra info'
    }

    actionMock = {
      ...actionMock,
      analytics: {
        additionalEntries: { extra: 'test extra info' }
      }
    }

    analyticsConfigMock = {
      enableScreenAnalytics: true,
      actions: { 'beagle:pushView': ['route.screen'] }
    }

    let recordMock = {
      ...recordBase,
      component: { ...recordBase.component, onPress: actionMock },
      action: actionMock
    }

    provider.getConfig = (() => analyticsConfigMock)
    analyticsServiceMock = analyticsService.create(provider)
    analyticsServiceMock.createActionRecord(recordMock)
    expect(provider.createRecord).toHaveBeenCalledWith(expectedRecordBase)

  })

  it('should call create Record for Screen', () => {
    expectedRecordBase = {
      type: 'screen',
      platform: 'WEB Jest',
      screen: 'text.action.payload',
      timestamp: 10
    }

    analyticsConfigMock = {
      enableScreenAnalytics: true,
      actions: { 'beagle:pushStack': [] }
    }

    provider.getConfig = (() => analyticsConfigMock)
    analyticsServiceMock = analyticsService.create(provider)
    analyticsServiceMock.createScreenRecord(screenBase)
    expect(provider.createRecord).toHaveBeenCalledWith(expectedRecordBase)

  })

  it('should NOT call create Record for Screen', async () => {
    analyticsConfigMock = {
      enableScreenAnalytics: false,
      actions: { 'beagle:pushStack': [] }
    }

    provider.getConfig = (() => analyticsConfigMock)
    analyticsServiceMock = analyticsService.create(provider)
    await analyticsServiceMock.createScreenRecord(screenBase)
    expect(provider.createRecord).toHaveBeenCalledTimes(0)

  })

  it('should show warning when exceeding queue max capacity', async () => {

    providerWithDelay.getMaximumItemsInQueue = () => 2
    analyticsServiceMock = analyticsService.create(providerWithDelay)

    promiseArray.map(async (id) => {
      try {
        await analyticsServiceMock.createActionRecord(recordBase)
        return id
      } catch { }
    })

    expect(globalMocks.log).toHaveBeenCalledWith('warn', expect.any(String))
  })

  it('should NOT show warning when NOT exceeding queue max capacity', async () => {

    providerWithDelay.getMaximumItemsInQueue = () => 5
    analyticsServiceMock = analyticsService.create(providerWithDelay)

    promiseArray.map(async (id) => {
      try {
        await analyticsServiceMock.createActionRecord(recordBase)
        return id
      } catch { }
    })

    expect(globalMocks.log).not.toHaveBeenCalled()

  })

  it('should empty queue when analytics config available', async () => {

    providerWithDelay.getMaximumItemsInQueue = () => 2
    analyticsServiceMock = analyticsService.create(providerWithDelay)

    promiseArray.map(async (id) => {
      try {
        await analyticsServiceMock.createActionRecord(recordBase)
        return id
      } catch { }
    })

    setTimeout(async () => {
      await analyticsServiceMock.createActionRecord(recordBase)
      expect(providerWithDelay.createRecord).toHaveBeenCalledTimes(3)
    }, 5000);
  })

  it('should NOT createRecord when analytics False and Provider True', async () => {

    provider.getConfig = (() => analyticsConfigMock)
    actionMock = { ...actionMock, analytics: false }
    let recordMock = { ...recordBase, action: actionMock }
    analyticsServiceMock = analyticsService.create(provider)
    analyticsServiceMock.createActionRecord(recordMock)
    expect(provider.createRecord).toHaveBeenCalledTimes(0)
  })

})
