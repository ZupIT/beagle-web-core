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

import addChildren from './add-children'
import setContext from './set-context'
import sendRequest from './send-request'
import alert from './alert'
import confirm from './confirm'
import submitForm from './submit-form'
import condition from './condition'
import NavigationActions from './navigation'
import { ActionHandler } from './types'

const defaultActionHandlers: Record<string, ActionHandler> = {
  'beagle:addChildren': addChildren,
  'beagle:setContext': setContext,
  'beagle:sendRequest': sendRequest,
  'beagle:alert': alert,
  'beagle:confirm': confirm,
  'beagle:submitForm': submitForm,
  'beagle:condition': condition,
  ...NavigationActions,
}

export default defaultActionHandlers
