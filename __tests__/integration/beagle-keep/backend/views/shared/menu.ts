import { BeagleUIElement } from 'beagle-tree/types'
import { getLabels } from '../../database/labels'

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

const notesItem: BeagleUIElement = {
  _beagleComponent_: 'custom:menuItem',
  id: 'menu:notes',
  active: '{isNull(data.currentLabel)}',
  icon: 'light-bulb',
  label: 'Notes',
  onPress: [
    {
      _beagleAction_: 'beagle:setContext',
      contextId: 'data',
      path: 'currentLabel',
      value: null,
    },
  ],
}

const editLabelsItem: BeagleUIElement = {
  _beagleComponent_: 'custom:menuItem',
  id: 'menu:labels',
  active: false,
  icon: 'pencil',
  label: 'Edit labels',
  onPress: [
    {
      _beagleAction_: 'beagle:pushView',
      route: {
        url: '/labels'
      }
    },
  ],
}

const labelsItems: BeagleUIElement[] = getLabels().map(label => ({
  _beagleComponent_: 'custom:menuItem',
  id: `menu:label:${label.id}`,
  active: `@{eq(data.currentLabel, ${label.id})}`,
  icon: 'tag',
  color: label.color,
  label: label.name,
  onPress: [
    {
      _beagleAction_: 'beagle:setContext',
      contextId: 'data',
      path: 'currentLabel',
      value: label.id,
    },
  ],
}))

const menu: BeagleUIElement = {
  _beagleComponent_: 'custom:menu',
  id: 'menu',
  context: {
    id: 'activeMenuItem',
    value: 'Notes',
  },
  items: [
    notesItem,
    editLabelsItem,
    ...labelsItems,
  ],
  style: {
    margin: {
      right: { value: 20, type: 'REAL' },
    },
  },
}

export default menu
