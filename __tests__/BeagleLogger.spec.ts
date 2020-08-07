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
import { BeagleLogConfig } from '../src/types'
import beagleLogger from '../src/BeagleLogger'

describe('BeagleLogger', () => {
    it('should set logger and call log function', async () => {
        const beagleLogConfig: BeagleLogConfig = {
            mode: 'development',
            debug: ['lifecycle', 'error', 'warn']
        }

        beagleLogger.setConfig(beagleLogConfig)
        beagleLogger.log = jest.fn(beagleLogger.log)
        beagleLogger.log({ test: 't', abc: 1 }, 'lifecycle')

        expect(beagleLogger.log).toHaveBeenCalled()
    })
})