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

import { remoteSuccessfulFlowWithCompletionAfterSuccess } from './remote/successful/completes-after-success'
import { remoteSuccessfulFlowWithCompletionOnLoading } from './remote/successful/completes-on-loading'
import { remoteSuccessfulFlowWithCustomController } from './remote/successful/custom-controller'
import { remoteSuccessfulFlowWithInexistentController } from './remote/successful/inexistent-controller'
import { remoteUnsuccessfulFlowWithCompletionOnError } from './remote/unsuccessful/completes-on-error'
import { remoteUnsuccessfulFlowWithCustomController } from './remote/unsuccessful/custom-controller'
import { remoteUnsuccessfulFlowWithoutCompletion } from './remote/unsuccessful/never-completes'
import { remoteUnsuccessfulFlowWithRetrial } from './remote/unsuccessful/retry'
import { localFlowWithCustomController } from './local/custom-controller'
import { localFlowWithDefaultController } from './local/default-controller'
import { PushOperation } from './types'

export function createTestSuitForPushOperation(type: PushOperation) {
  describe(`${type}: flows for remote views`, () => {
    remoteSuccessfulFlowWithCompletionAfterSuccess(type)
    remoteSuccessfulFlowWithCompletionOnLoading(type)
    remoteUnsuccessfulFlowWithCompletionOnError(type)
    remoteUnsuccessfulFlowWithoutCompletion(type)
    remoteUnsuccessfulFlowWithRetrial(type)
    if (type !== 'pushView') {
      remoteSuccessfulFlowWithCustomController(type)
      remoteSuccessfulFlowWithInexistentController(type)
      remoteUnsuccessfulFlowWithCustomController(type)
    }
  })

  describe(`${type}: flows for local views`, () => {
    localFlowWithDefaultController(type)
    if (type !== 'pushView') {
      localFlowWithCustomController(type)
    }
  })
}
