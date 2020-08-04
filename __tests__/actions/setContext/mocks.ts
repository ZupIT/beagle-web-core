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

export function createSingleContextMock(
  ctxId = 'ctx_a',
  btnId = 'button',
): IdentifiableBeagleUIElement {
  return {
    _beagleComponent_: 'testComponent',
    id: 'container',
    value: '@{ctxId}',
    context: {
      id: ctxId,
      value: `value of ${ctxId}`,
    },
    children: [
      {
        _beagleComponent_: 'button',
        id: btnId,
        value: `@{${ctxId}}`,
      },
    ],
  }
}

export function createDoubleContextMock(): IdentifiableBeagleUIElement {
  const mock = createSingleContextMock()
  mock.children = [createSingleContextMock('ctx_b')]
  return mock
}

export function createMockWithDistantContext(): IdentifiableBeagleUIElement {
  return {
    _beagleComponent_: 'container',
    id: 'containerA',
    context: {
      id: 'ctx_a',
      value: 'value of ctx_a',
    },
    children: [
      {
        _beagleComponent_: 'container',
        id: 'containerB',
        children: [
          {
            _beagleComponent_: 'container',
            id: 'containerC',
            children: [
              {
                _beagleComponent_: 'container',
                id: 'containerD',
                children: [
                  {
                    _beagleComponent_: 'button',
                    id: 'button',
                    value: '@{ctx_a}',
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  }
}

export function createSameLevelContextMock(
  value: any = 'value of ctx_a',
): IdentifiableBeagleUIElement {
  return {
    _beagleComponent_: 'text',
    id: 'text',
    context: {
      id: 'ctx_a',
      value,
    },
    value: '@{ctx_a}',
  }
}

export function createMultipleScopesMock() {
  return {
    _beagleComponent_: 'container',
    id: 'container',
    children: [
      createSingleContextMock('ctx_a', 'btn_a'),
      createSingleContextMock('ctx_b', 'btn_b'),
    ],
  }
}

export function createGlobalContextMock(
  ctxId = 'global',
  btnId = 'button',
): IdentifiableBeagleUIElement {
  return {
    _beagleComponent_: 'testComponent',
    id: 'container',
    value: '@{global}',
    children: [
      {
        _beagleComponent_: 'button',
        id: btnId,
        value: `@{${ctxId}}`,
      },
    ],
  }
}
