import { BeagleUIElement } from 'beagle-tree/types'
import { getLabels } from '../../database/labels'

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

const notesItem: BeagleUIElement = {
  _beagleComponent_: 'custom:menuItem',
  active: '@{eq(data.currentLabel, \'Notes\')}',
  icon: 'light-bulb',
  label: 'Notes',
  onPress: [
    {
      _beagleAction_: 'beagle:setContext',
      contextId: 'menu',
      path: 'active',
      value: 'Notes',
    },
    {
      _beagleAction_: 'beagle:setContext',
      contextId: 'filteredLabel',
      value: null,
    },
  ],
}

const editLabelsItem: BeagleUIElement = {
  _beagleComponent_: 'custom:menuItem',
  active: '@{eq(data.currentLabel, \'Edit labels\')}',
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
  active: `@{eq(data.currentLabel, '${label.name}')}`,
  icon: 'tag',
  color: label.color,
  label: label.name,
  onPress: [
    {
      _beagleAction_: 'beagle:setContext',
      contextId: 'data',
      path: 'currentLabel',
      value: label.name,
    },
  ],
}))

const menu: BeagleUIElement = {
  _beagleComponent_: 'custom:menu',
  id: 'menu',
  context: {
    id: 'active',
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
