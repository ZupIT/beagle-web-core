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

import { AnalyticsConfig, AnalyticsProvider, AnalyticsRecord, BeagleAction } from 'index'
import { ActionRecordParams, AnalyticsService, ScreenRecordParams } from 'service/analytics/types'
import analyticsService from '../../../../src/service/analytics'
import * as htmlHelpers from 'utils/html'

describe('Actions Analytics Service', () => {

  let analyticsConfigMock: AnalyticsConfig
  let actionMock: BeagleAction
  let expectedRecordBase: any
  let recordBase: ActionRecordParams
  let screenBase: ScreenRecordParams

  screenBase = {
    route: 'text.action.payload',
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
    route: 'text.action.payload',
  }

  expectedRecordBase = {
    type: 'action',
    platform: 'Jest',
    event: 'OnPress',
    component: {
      type: 'beagle:button',
      id: 'beagle_mock',
      position: { x: 10, y: 10 },
      xPath: 'BODY/ROOT/DIV[3]/DIV/BUTTON'
    },
    beagleAction: 'beagle:pushView',
    attributes: { 'route.screen': { id: 'screenMock' } },
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

  let provider: AnalyticsProvider
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
    provider = analytics()
    globalMocks.log.mockClear()
    spyOn(Date, 'now').and.returnValue(10)
    spyOn(provider, 'createRecord').and.callThrough()
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

  it('should NOT create Record if provider is unavailable', async () => {
    //@ts-ignore
    provider = undefined
    actionMock = { ...actionMock, analytics: false }
    let recordMock = { ...recordBase, action: actionMock }

    analyticsServiceMock = analyticsService.create(provider)
    analyticsServiceMock.createActionRecord(recordMock).then((returnValue) => {
      expect(returnValue).toBe(undefined)
    })

  })

  it('should call create Record for Action with additional entries', () => {

    expectedRecordBase = {
      ...expectedRecordBase,
      additionalEntries: { extra: 'test extra info' }
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

  it('should call create Record for Action with additional entries and exposed attributes (action)', () => {

    expectedRecordBase = {
      ...expectedRecordBase,
      additionalEntries: { extra: 'test extra info' }
    }

    actionMock = {
      ...actionMock,
      analytics: {
        additionalEntries: { extra: 'test extra info' },
        attributes: ["route.screen"]
      }
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

  it('Should interpret analytics object in action as if analytics is enabled.', () => {

    let mockRecord = {...expectedRecordBase}
    delete mockRecord['additionalEntries']
    delete mockRecord['attributes']

    actionMock = {
      ...actionMock,
      analytics: {}
    }

    analyticsConfigMock = {
      enableScreenAnalytics: true,
      actions: {}
    }

    let recordMock = {
      ...recordBase,
      component: { ...recordBase.component, onPress: actionMock },
      action: actionMock
    }

    provider.getConfig = (() => analyticsConfigMock)
    analyticsServiceMock = analyticsService.create(provider)
    analyticsServiceMock.createActionRecord(recordMock)
    expect(provider.createRecord).toHaveBeenCalledWith(mockRecord)

  })

  it('Should create action record when it is disabled in the config, but enabled in the action itself', () => {

    expectedRecordBase = {
      ...expectedRecordBase,
      additionalEntries: { extra: 'test extra info' }
    }

    actionMock = {
      ...actionMock,
      analytics: {
        additionalEntries: { extra: 'test extra info' },
        attributes: ["route.screen"]
      }
    }

    analyticsConfigMock = {
      enableScreenAnalytics: true,
      actions: {}
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
      platform: 'Jest',
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

  it('should NOT createRecord when analytics False and Provider True', async () => {

    provider.getConfig = (() => analyticsConfigMock)
    actionMock = { ...actionMock, analytics: false }
    let recordMock = { ...recordBase, action: actionMock }
    analyticsServiceMock = analyticsService.create(provider)
    analyticsServiceMock.createActionRecord(recordMock)
    expect(provider.createRecord).toHaveBeenCalledTimes(0)
  })

})
