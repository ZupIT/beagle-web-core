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

import { AnalyticsConfig, BeagleAction } from 'index'
import formatActionRecord from 'service/analytics/actions'
import { ActionRecordParams } from 'service/analytics/types'
import * as htmlHelpers from 'utils/html'

describe('Actions Analytics Service', () => {

  let analyticsConfigMock: AnalyticsConfig
  let actionMock: BeagleAction = {
    _beagleAction_: 'beagle:pushView',
    route: { screen: { id: 'screenMock' } }
  }

  const button = {
    _beagleComponent_: 'beagle:button',
    id: 'beagle_mock',
    onPress: actionMock
  }

  const recordBase: ActionRecordParams = {
    eventName: 'OnPress',
    platform: 'Jest',
    component: button,
    action: actionMock,
    route: 'text.action.payload',
  }

  analyticsConfigMock = {
    enableScreenAnalytics: true,
    actions: { 'beagle:pushView': [] }
  }

  const expectedBase = {
    type: 'action',
    platform: 'Jest',
    event: 'OnPress',
    component: {
      type: 'beagle:button',
      id: 'beagle_mock',
      position: { x: 10, y: 10 },
      xPath: 'BODY/ROOT/DIV[3]/DIV/BUTTON'
    },
    attributes:{},
    beagleAction: 'beagle:pushView',
    screen: "text.action.payload",
    timestamp: 10
  }

  beforeEach(() => {
    spyOn(Date, 'now').and.returnValue(10)
    //@ts-ignore
    htmlHelpers.getElementPosition = jest.fn().mockReturnValue({ x: 10, y: 10 })
    //@ts-ignore
    htmlHelpers.getElementByBeagleId = jest.fn().mockReturnValue('<div>button</div>')
    //@ts-ignore
    htmlHelpers.getPath = jest.fn().mockReturnValue('BODY/ROOT/DIV[3]/DIV/BUTTON')
  })

  it('should format the Action', () => {

    const expected = { ...expectedBase }
    const result = formatActionRecord({ ...recordBase }, analyticsConfigMock)

    expect(result).toEqual(expected)
  })

  it('should format the Action adding additional attributes from CONFIG', () => {

    const expected = { ...expectedBase, attributes: { 'route.screen': { id: 'screenMock' } } }
    analyticsConfigMock.actions = { 'beagle:pushView': ['route.screen'] }
    const result = formatActionRecord({ ...recordBase }, analyticsConfigMock)

    expect(result).toEqual(expected)
  })

  it('should format the Action adding additional attributes from ACTION', () => {

    const expected = { ...expectedBase, additionalEntries: { test: 'additionalEntries' }, attributes: { 'route.screen': { id: 'screenMock' } } }
    actionMock.analytics = { additionalEntries: { test: 'additionalEntries' }, attributes: ['route.screen'] }
    const result = formatActionRecord({ ...recordBase, action: actionMock }, analyticsConfigMock)

    expect(result).toEqual(expected)
  })

})
