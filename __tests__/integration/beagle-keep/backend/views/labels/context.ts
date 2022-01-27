/*
 * Copyright 2020, 2022 ZUP IT SERVICOS EM TECNOLOGIA E INOVACAO SA
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

const context = {
  id: 'labels',
  value: {
    current: getLabels(),
    new: null,
  },
}

export const enableLabelCreation = {
  _beagleAction_: 'beagle:setContext',
  contextId: 'labels',
  path: 'new',
  value: {
    id: '',
    name: '',
    color: '',
  },
}

export const disableLabelCreation = {
  _beagleAction_: 'beagle:setContext',
  contextId: 'labels',
  path: 'new',
  value: null,
}

export function addNewLabelToCurrentLabels(pathToLabel: string) {
  return {
    _beagleAction_: 'beagle:setContext',
    contextId: 'labels',
    value: {
      current: `@{insert(labels.current, ${pathToLabel})}`,
      new: null,
    },
  }
}

export const removeCurrent = {
  _beagleAction_: 'beagle:setContext',
  contextId: 'labels',
  path: 'current',
  value: '@{remove(labels.current, item)}',
}

export function replaceCurrent(pathToLabel: string) {
  return {
    _beagleAction_: 'beagle:setContext',
    contextId: 'labels',
    path: 'current[@{index}]',
    value: `@{${pathToLabel}}`,
  }
}

export default context
