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

import { find } from 'lodash'
import {
  BeforeStart,
  BeforeViewSnapshot,
  AfterViewSnapshot,
  BeforeRender,
  BeagleChildren,
} from 'metadata/decorator'
import Repeater from './repeater'
import { Component } from './types'

let containerIdCounter = 0

const TextInput: Component<any> = jest.fn()
const TextArea: Component<any> = jest.fn()
const Button: Component<any> = jest.fn()
const Container: Component<any> = jest.fn()
const Menu: Component<any> = jest.fn()

function parseInputModel(input: any) {
  if (!input.model) return
  const [contextId, path] = input.model.match(/(\w+)\.().*)/)
  input.value = `@{${input.model}}`
  input.onChange = input.onChange || []
  input.onChange.push({
    _beagleAction_: 'beagle:setContext',
    contextId,
    path,
    value: '@{onChange.value}',
  })
  delete input.model
}

BeforeStart(container => {
  container.id = `container:${containerIdCounter++}`
})(Container)

BeforeViewSnapshot(parseInputModel)(TextInput)
BeforeViewSnapshot(parseInputModel)(TextArea)

AfterViewSnapshot((button) => {
  button.isSubmit = !!find(button.onPress, { _beagleAction_: 'beagle:submitForm' })
})(Button)

BeforeRender((container) => {
  container.style = container.style || {}
  container.style.color = '#FFF'
})(Container)

BeagleChildren({ property: 'items' })(Menu)

const components: Record<string, Component<any>> = {
  'beagle:container': Container,
  'beagle:button': Button,
  'beagle:image': jest.fn(),
  'beagle:simpleForm': jest.fn(),
  'beagle:textInput': TextInput,
  'custom:menu': Menu,
  'custom:menuItem': jest.fn(),
  'custom:repeater': jest.fn(Repeater),
  'custom:textArea': TextArea,
  'custom:note': jest.fn(),
  'custom:editableLabel': jest.fn(),
  'custom:loading': jest.fn(),
  'custom:error': jest.fn(),
}

export default components
