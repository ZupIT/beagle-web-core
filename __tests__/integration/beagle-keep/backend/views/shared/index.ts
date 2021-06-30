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
import { getNotes } from '../../database/notes'
import { getLabels } from '../../database/labels'
import header from './header'
import menu from './menu'

export const getHomeBeagleElement = (notesList: BeagleUIElement<Record<string, Record<string, any>>>) => ({
    _beagleComponent_: 'beagle:container',
    version: '',
    context: {
      id: 'data',
      value: {
        notes: getNotes(),
        labels: getLabels(),
      },
    },
    children: [
      header,
      {
        _beagleComponent_: 'beagle:container',
        style: {
          flex: {
            flexDirection: 'ROW',
            flex: 1,
          },
        },
        children: [
          menu,
          notesList,
        ],
      },
      {
        _beagleComponent_: 'beagle:button',
        id: 'create-note',
        text: 'Create note',
        onPress: [
          {
            _beagleAction_: 'beagle:setContext',
            contextId: 'global',
            path: 'selectedNote',
            value: null,
          },
          {
            _beagleAction_: 'beagle:pushView',
            route: { url: '/details' },
          },
        ],
        style: {
          positionType: 'ABSOLUTE',
          position: {
            bottom: { value: 20, type: 'REAL' },
            right: { value: 20, type: 'REAL' },
          },
        },
      },
    ],
  }
)
