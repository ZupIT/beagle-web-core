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

import { BeagleUIElement } from 'beagle-tree/types'
import {
  disableLabelCreation,
  removeCurrent,
  replaceCurrent,
  addNewLabelToCurrentLabels,
} from './context' 
import { cardStyle } from '../styles'

function setLoading(value: boolean) {
  return {
    _beagleAction_: 'beagle:setContext',
    contextId: 'isLoading',
    value,
  }
}

function showFeedback(type: string, message: string) {
  return {
    _beagleAction_: 'custom:feedback',
    type,
    message,
  }
}

const saveLabel = [
  setLoading(true),
  {
    _beagleAction_: 'beagle:sendRequest',
    url: '/label',
    method: '@{condition(isEmpty(item.id), \'POST\', \'PUT\')}',
    data: '@{onSave.value}',
    onSuccess: [{
      _beagleAction_: 'beagle:condition',
      condition: 'isEmpty(item.id)',
      onTrue: [addNewLabelToCurrentLabels('onSuccess.data')],
      onFalse: [replaceCurrent('onSuccess.data')],
    }],
    onError: [showFeedback('error', '@{error.data.message}')],
    onFinish: [setLoading(false)],
  },
]

const removeLabel = [
  {
    _beagleAction_: 'beagle:condition',
    condition: '@{isEmpty(item.id)}',
    onTrue: [disableLabelCreation],
    onFalse: [
      setLoading(true),
      {
        _beagleAction_: 'beagle:sendRequest',
        url: '/label/@{item.id}',
        method: 'DELETE',
        onSuccess: [removeCurrent],
        onError: [
          showFeedback('error', 'Error while deleting label.'),
          setLoading(false),
        ],
      },
    ],
  },
]

const labelList: BeagleUIElement = {
  _beagleComponent_: 'custom:repeater',
  id: 'label-list',
  style: cardStyle,
  dataSource: '@{condition(isNull(labels.new), labels.current, insert(labels.current, labels.new))}',
  key: 'id',
  template: {
    _beagleComponent_: 'custom:editableLabel',
    context: {
      id: 'isLoading',
      value: false,
    },
    isLoading: '@{isLoading}',
    label: '@{item}',
    onSave: saveLabel,
    onRemove: removeLabel,
  },
}

export default labelList
