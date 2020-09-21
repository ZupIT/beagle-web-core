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
import { setLoading, showFieldError, showFormErrors, setFieldValue } from './context'
import { buttonGroupStyle, cardStyle } from '../styles'

function showFeedback(type: string, message: string) {
  return {
    _beagleAction_: 'custom:feedback',
    type,
    message,
  }
}

function createButton(text: string, isSubmit: boolean): BeagleUIElement {
  const action = isSubmit
    ? { _beagleAction_: 'beagle:submitForm' }
    : { _beagleAction_: 'beagle:popView' }

  return {
    _beagleComponent_: 'beagle:button',
    text,
    onPress: [action],
  }
}

function createField(name: string, label: string, isTextArea: boolean): BeagleUIElement {
  const field: BeagleUIElement = {
    _beagleComponent_: isTextArea? 'custom:textArea' : 'beagle:textInput',
    onChange: [setFieldValue(name, '@{onChange.value}')],
    onBlur: [showFieldError(name, true)],
    error: `@{condition(isEmpty(form.data.${name}), 'This field is required', '')}`,
    showError: `@{or(form.showErrors, form.showFieldError.${name})}`,
  }

  field[isTextArea ? 'label' : 'placeholder'] = label
  return field
}

const saveNote = [
  setLoading(true),
  {
    _beagleAction_: 'beagle:sendRequest',
    url: '/notes',
    method: '@{condition(isNull(global.selectedNote), \'POST\', \'PUT\')}',
    data: '@{form.data}',
    onSuccess: [
      showFeedback('success', 'Note successfully created!'),
      { _beagleAction_: 'beagle:popView' },
    ],
    onError: [showFeedback('error', 'Could not save the message. Please, try again later.')],
    onFinish: [setLoading(false)],
  },
]

const buttons: BeagleUIElement = {
  _beagleComponent_: 'beagle:container',
  style: buttonGroupStyle,
  children: [
    createButton('Cancel', false),
    createButton('Save', true),
  ]
}

const form: BeagleUIElement  = {
  _beagleComponent_: 'beagle:simpleForm',
  onSubmit: saveNote,
  onValidationError: showFormErrors,
  children: [
    {
      _beagleComponent_: 'beagle:container',
      style: cardStyle,
      children: [
        createField('title', 'Title', false),
        createField('text', 'Content', true),
        buttons,
      ]
    },
  ],
}

export default form
