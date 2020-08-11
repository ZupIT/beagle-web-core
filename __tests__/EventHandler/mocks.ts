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

import { IdentifiableBeagleUIElement } from 'beagle-tree/types'

export function createContainerWithAction(
  eventName: string,
  action?: any
): IdentifiableBeagleUIElement {
  return {
    _beagleComponent_: 'container',
    id: 'container',
    [eventName]: action || {
      _beagleAction_: 'beagle:alert',
      message: 'test message',
    },
  }
}

export function createModalMock(): IdentifiableBeagleUIElement {
  return {
    _beagleComponent_: 'container',
    id: 'container',
    context: {
      id: 'isModalOpen',
      value: false,
    },
    children: [
      {
        _beagleComponent_: 'button',
        id: 'btn-open-modal',
        onPress: {
          _beagleAction_: 'beagle:setContext',
          value: true,
        }
      },
      {
        _beagleComponent_: 'modal',
        id: 'modal',
        isOpen: '@{isModalOpen}',
        title: 'My Modal',
        onClose: [
          {
            _beagleAction_: 'beagle:setContext',
            value: false,
          },
          {
            _beagleAction_: 'beagle:alert',
            message: 'modal has been closed!',
          },
        ],
        children: [
          {
            _beagleComponent_: 'container',
            id: 'modal-content',
            onInit: {
              _beagleAction_: 'beagle:sendRequest',
              componentId: 'modal',
              url: '/modalContent',
              onSuccess: {
                _beagleAction_: 'addChildren',
                mode: 'replace',
                value: '@{onSuccess.data}',
              },
              onError: {
                _beagleAction_: 'showErrorMessage',
                text: 'An unexpected error ocurred!',
              },
            },
            children: [
              {
                _beagleComponent_: 'custom:loading',
                id: 'loading',
              },
            ],
          },
        ],
      },
    ],
  }
}
