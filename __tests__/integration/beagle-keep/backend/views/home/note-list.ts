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
import { url, paths } from '../../../constants'

const noteTemplate: BeagleUIElement = {
  _beagleComponent_: 'custom:note',
  noteId: '@{item.id}',
  title: '@{item.title}',
  text: '@{item.text}',
  labels: '@{item.labels}',
  onSelect: [
    {
      _beagleAction_: 'beagle:setContext',
      contextId: 'global',
      path: 'selectedNote',
      value: '@{item.id}',
    },
    {
      _beagleAction_: 'beagle:pushView',
      route: { url: '/details' },
    },
  ],
  onRemove: [
    {
      _beagleAction_: 'beagle:setContext',
      contextId: 'data',
      path: 'notes',
      value: '@{remove(data.notes, item)}',
    },
    {
      _beagleAction_: 'beagle:sendRequest',
      url: `${url}${paths.note}/@{item.id}`,
      method: 'DELETE',
      onSuccess: [
        {
          _beagleAction_: 'custom:feedback',
          type: 'success',
          text: 'Note removed successfully!'
        },
      ],
      onError: [
        {
          _beagleAction_: 'custom:feedback',
          type: 'error',
          text: 'Connection error. Couldn\'t remove the label.'
        },
        {
          _beagleAction_: 'beagle:setContext',
          contextId: 'data',
          path: 'notes',
          value: '@{insert(data.notes, item, index)}',
        },
      ],
    },
  ],
  style: {
    margin: {
      all: { value: 10, type: 'REAL' },
    },
  },
}

const noteList: BeagleUIElement = {
  _beagleComponent_: 'custom:repeater',
  id: 'note-list',
  dataSource: '@{filterNotesByLabel(data.notes, data.currentLabel)}',
  key: 'id',
  template: noteTemplate,
}

export default noteList
