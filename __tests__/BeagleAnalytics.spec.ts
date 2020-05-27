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
import { Analytics } from '../src/types'
import beagleAnalytics from '../src/BeagleAnalytics'

describe.only('BeagleAnalytics', () => {
  it('should get custom analytics service', async () => {
    const analytics: Analytics = {
        trackEventOnClick: jest.fn(),
        trackEventOnScreenAppeared: jest.fn(),
        trackEventOnScreenDisappeared: jest.fn()
    }

    beagleAnalytics.setAnalytics(analytics)
    beagleAnalytics.getAnalytics().trackEventOnScreenAppeared({ screenName: '/home'})

    expect(beagleAnalytics.getAnalytics()).toEqual(analytics)
    expect(analytics.trackEventOnScreenAppeared).toHaveBeenCalledWith({ screenName: '/home'})
    
  })
})
