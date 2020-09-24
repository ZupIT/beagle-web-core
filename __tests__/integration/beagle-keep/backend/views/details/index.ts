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
import form from './form'
import context, { setNote, setLoading } from './context'
import { pageStyle } from '../styles'

const fetchNote = [{
  _beagleAction_: 'beagle:condition',
  condition: '@{isNull(global.selectedNote)}',
  onTrue: [setLoading(false)],
  onFalse: [{
    _beagleAction_: 'beagle:sendRequest',
    url: '/note/@{global.selectedNote}',
    onSuccess: setNote('onSuccess.data'),
    onError: [{
      _beagleAction_: 'beagle:addChildren',
      value: {
        _beagleComponent_: 'custom:error',
        message: 'Couldn\'t find note with id @{global.selectedNote}',
      },
      mode: 'replace',
    }],
    onFinish: [setLoading(false)],
  }]
}]

const details: BeagleUIElement = {
  _beagleComponent_: 'beagle:container',
  version: '',
  context,
  onInit: fetchNote,
  style: pageStyle,
  children: [
    {
      _beagleComponent_: 'custom:loadingOverlay',
      isVisible: '@{form.isLoading}',
    },
    form,
  ],
}

export default details
