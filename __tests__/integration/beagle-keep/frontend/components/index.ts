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
import { AfterViewSnapshot, BeagleChildren } from 'metadata/decorator'
import Repeater from './repeater'
import Container from './container'
import { TextArea, TextInput } from './input'
import { Component } from './types'

const Button: Component<any> = jest.fn()
const Menu: Component<any> = jest.fn()

AfterViewSnapshot((button) => {
  button.isSubmit = !!find(button.onPress, { _beagleAction_: 'beagle:submitForm' })
})(Button)

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
  'custom:loadingOverlay': jest.fn(),
  'custom:loading': jest.fn(),
  'custom:error': jest.fn(),
}

export default components
