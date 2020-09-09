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

import Navigation from 'beagle-view/render/navigation'
import { URLBuilder } from 'service/network/url-builder/types'
import { ViewClient } from 'service/network/view-client/types'
import { createUrlBuilderMock, createViewClientMock } from '../../old-structure/utils/test-utils'

describe('Beagle View: render: navigation', () => {
  const navigationAction = {
    _beagleAction_: 'beagle:pushView',
    route: {
      url: '/test',
      shouldPrefetch: true,
    },
  }
  let urlBuilder: URLBuilder
  let viewClient: ViewClient
  
  beforeEach(() => {
    urlBuilder = createUrlBuilderMock()
    viewClient = createViewClientMock()
  })

  it('should pre-fetch', () => {
    const component = {
      _beagleComponent_: 'beagle:button',
      onPress: navigationAction,
    }

    Navigation.preFetchViews(component, urlBuilder, viewClient)
    expect(viewClient.loadFromServer).toHaveBeenCalledWith(navigationAction.route.url)
  })

  it('should use the urlBuilder to build the url', () => {
    const component = {
      _beagleComponent_: 'beagle:button',
      onPress: navigationAction,
    }

    Navigation.preFetchViews(component, urlBuilder, viewClient)
    expect(urlBuilder.build).toHaveBeenCalledWith(navigationAction.route.url)
  })

  it('should identify route to pre-fetch inside an action list in the component\'s root.', () => {
    const component = {
      _beagleComponent_: 'beagle:button',
      onPress: [navigationAction],
    }

    Navigation.preFetchViews(component, urlBuilder, viewClient)
    expect(viewClient.loadFromServer).toHaveBeenCalledWith(navigationAction.route.url)
  })

  it('should identify multiple routes to pre-fetch in a single event', () => {
    const component = {
      _beagleComponent_: 'beagle:button',
      onPress: [
        navigationAction,
        { 
          _beagleAction_: 'beagle:pushStack',
          route: {
            url: '/test2',
            shouldPrefetch: true,
          }
        },
      ]
    }

    Navigation.preFetchViews(component, urlBuilder, viewClient)
    expect(viewClient.loadFromServer).toHaveBeenCalledTimes(2)
    expect(viewClient.loadFromServer).toHaveBeenCalledWith(navigationAction.route.url)
    expect(viewClient.loadFromServer).toHaveBeenCalledWith('/test2')
  })

  it('should identify multiple routes to pre-fetch in multiple events', () => {
    const component = {
      _beagleComponent_: 'beagle:button',
      onPress: [
        navigationAction,
        { 
          _beagleAction_: 'beagle:pushStack',
          route: {
            url: '/test2',
            shouldPrefetch: true,
          }
        },
      ],
      onDrag: [
        { 
          _beagleAction_: 'beagle:pushStack',
          route: {
            url: '/test3',
            shouldPrefetch: true,
          }
        },
        { 
          _beagleAction_: 'beagle:resetStack',
          route: {
            url: '/test4',
            shouldPrefetch: true,
          }
        },
      ]
    }

    Navigation.preFetchViews(component, urlBuilder, viewClient)
    expect(viewClient.loadFromServer).toHaveBeenCalledTimes(4)
    expect(viewClient.loadFromServer).toHaveBeenCalledWith(navigationAction.route.url)
    expect(viewClient.loadFromServer).toHaveBeenCalledWith('/test2')
    expect(viewClient.loadFromServer).toHaveBeenCalledWith('/test3')
    expect(viewClient.loadFromServer).toHaveBeenCalledWith('/test4')
  })

  it('should identify route to pre-fetch in the second level of the component\'s tree.', () => {
    const component = {
      _beagleComponent_: 'beagle:button',
      actions: {
        onPress: [navigationAction],
      }
    }

    Navigation.preFetchViews(component, urlBuilder, viewClient)
    expect(viewClient.loadFromServer).toHaveBeenCalledWith(navigationAction.route.url)
  })

  it('should identify route to pre-fetch inside a sub-action', () => {
    const component = {
      _beagleComponent_: 'beagle:button',
      onPress: [{
        _beagleAction_: 'beagle:sendRequest',
        url: 'https://mytest.com',
        onFinish: [navigationAction],
      }],
    }

    Navigation.preFetchViews(component, urlBuilder, viewClient)
    expect(viewClient.loadFromServer).toHaveBeenCalledWith(navigationAction.route.url)
  })

  it('should ignore case when looking for navigation actions', () => {
    const component = {
      _beagleComponent_: 'beagle:button',
      onPress: [{
        ...navigationAction,
        _beagleAction_: 'bEAgle:PushVIEW',
      }],
    }

    Navigation.preFetchViews(component, urlBuilder, viewClient)
    expect(viewClient.loadFromServer).toHaveBeenCalledWith(navigationAction.route.url)
  })

  it('should not prefetch navigation actions inside sub-components', () => {
    const component = {
      _beagleComponent_: 'beagle:listView',
      template: [{
        _beagleComponent_: 'beagle:button',
        onPress: navigationAction,
      }]
    }

    Navigation.preFetchViews(component, urlBuilder, viewClient)
    expect(viewClient.loadFromServer).not.toHaveBeenCalled()
  })

  it('should not prefetch if shouldPrefetch is not true', () => {
    const component = {
      _beagleComponent_: 'beagle:button',
      onPress: [{
        _beagleAction_: 'beagle:pushView',
        route: {
          url: '/test',
        },
      }]
    }

    Navigation.preFetchViews(component, urlBuilder, viewClient)
    expect(viewClient.loadFromServer).not.toHaveBeenCalled()
  })

  it('should not prefetch if the url is dynamic, i.e. if it\'s an expression', () => {
    const component = {
      _beagleComponent_: 'beagle:button',
      onPress: [{
        _beagleAction_: 'beagle:pushView',
        route: {
          url: '@{url}',
          shouldPrefetch: true,
        },
      }],
    }

    Navigation.preFetchViews(component, urlBuilder, viewClient)
    expect(viewClient.loadFromServer).not.toHaveBeenCalled()
  })

  it('should log warning for dynamic urls', () => {
    const component = {
      _beagleComponent_: 'beagle:button',
      onPress: [{
        _beagleAction_: 'beagle:pushView',
        route: {
          url: '@{url}',
          shouldPrefetch: true,
        },
      }],
    }

    Navigation.preFetchViews(component, urlBuilder, viewClient)
    expect(globalMocks.log).toHaveBeenCalledWith('warn', expect.any(String))
  })
})
