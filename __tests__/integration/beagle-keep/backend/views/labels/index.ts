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
import { BeagleAction } from 'action/types'
import context, { enableLabelCreation } from './context' 
import labelList from './label-list'
import { pageStyle, buttonGroupStyle } from '../styles'

function createButton(text: string, action: BeagleAction, disabled?: string): BeagleUIElement {
  return {
    _beagleComponent_: 'beagle:button',
    text,
    onPress: [action],
    disabled,
  }
}

const buttonGroup: BeagleUIElement = {
  _beagleComponent_: 'beagle:container',
  style: buttonGroupStyle,
  children: [
    createButton('Go back', { _beagleAction_: 'beagle:popView' }),
    createButton('Create new label', enableLabelCreation, '@{not(isEmpty(labels.new))}')
  ],
}

const labels: BeagleUIElement = {
  _beagleComponent_: 'beagle:container',
  style: pageStyle,
  context,
  children: [
    labelList,
    buttonGroup,
  ],
}

export default labels
