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

import { BeforeViewSnapshot } from 'metadata/decorator'
import { Component } from './types'

export const TextInput: Component<any> = jest.fn()
export const TextArea: Component<any> = jest.fn()

function parseInputModel(input: any) {
  if (!input.model) return
  const match = input.model.match(/(\w+)(\.(.+))?/)
  const contextId = match[1]
  const path = match[3]
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

BeforeViewSnapshot(parseInputModel)(TextInput)
BeforeViewSnapshot(parseInputModel)(TextArea)
