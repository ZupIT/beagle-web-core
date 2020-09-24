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

import { getLabels } from '../../database/labels'

export const context = {
  id: 'form',
  value: {
    data: {
      title: '',
      text: '',
      labels: [],
    },
    labels: getLabels(),
    isLoading: true,
  },
}

export function setLoading(value: boolean) {
  return {
    _beagleAction_: 'beagle:setContext',
    contextId: 'form',
    path: 'isLoading',
    value,
  }
}

export function setNote(pathToNote: string){
  return {
    _beagleAction_: 'beagle:setContext',
    contextId: 'form',
    path: 'data',
    value: {
      id: `@{${pathToNote}.id}`,
      title: `@{${pathToNote}.title}`,
      text: `@{${pathToNote}.text}`,
      labels: `@{${pathToNote}.labels}`,
    },
  }
}

export function showFormErrors(value: boolean) {
  return {
    _beagleAction_: 'beagle:setContext',
    contextId: 'form',
    path: 'showErrors',
    value,
  }
}

export function showFieldError(fieldName: string, value: boolean) {
  return {
    _beagleAction_: 'beagle:setContext',
    contextId: 'form',
    path: `showFieldError.${fieldName}`,
    value,
  }
}

export default context
