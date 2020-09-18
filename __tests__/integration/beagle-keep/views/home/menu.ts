import { BeagleUIElement } from 'beagle-tree/types'
import { BeagleAction } from 'action/types'

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

export interface MenuItem {
  icon: string,
  label: string,
  onPress: BeagleAction[],
}

function createMenu(items: MenuItem[]): BeagleUIElement {
  return {
    _beagleComponent_: 'custom:menu',
    id: 'menu',
    context: {
      id: 'menu',
      value: {
        items,
        active: 'Notes'
      },
    },
    items: '@{union(menu.items, labelsToMenuItems(labels))}',
    active: '@{menu.active}',
    style: {
      margin: {
        right: { value: 20, type: 'REAL' },
      },
    },
  }
}

export default createMenu([
  {
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
  },
  {
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
])
