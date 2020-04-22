/*
  * Copyright 2020 ZUP IT SERVICOS EM TECNOLOGIA E INOVACAO SA
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *  http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
*/

import { IdentifiableBeagleUIElement } from '../src/types'

export const treeA: IdentifiableBeagleUIElement = {
  id: 'A',
  _beagleType_: 'type-A',
  children: [
    {
      id: 'A.0',
      _beagleType_: 'type-B',
      style: 'margin: 10',
      children: [
        {
          id: 'A.0.0',
          _beagleType_: 'type-D',
        },
      ],
    },
    {
      id: 'A.1',
      _beagleType_: 'type-B',
      children: [
        {
          id: 'A.1.0',
          _beagleType_: 'type-D',
        },
        {
          id: 'A.1.1',
          _beagleType_: 'type-E',
          children: [
            {
              id: 'A.1.1.0',
              _beagleType_: 'type-F',
              style: 'margin: 10',
            },
            {
              id: 'A.1.1.1',
              _beagleType_: 'type-F',
            },
            {
              id: 'A.1.1.2',
              _beagleType_: 'type-F',
              style: 'margin: 20',
            },
            {
              id: 'A.1.1.3',
              _beagleType_: 'type-F',
            },
          ],
        },
      ],
    },
    {
      id: 'A.2',
      _beagleType_: 'type-C',
      style: 'margin: 20',
    },
  ],
}

export const treeB: IdentifiableBeagleUIElement = {
  id: 'B',
  _beagleType_: 'type-A',
  value: 'teste',
  children: [
    {
      id: 'B.0',
      _beagleType_: 'type-B',
      children: [
        {
          id: 'B.0.0',
          _beagleType_: 'type-C',
        },
      ],
    },
    {
      id: 'B.1',
      _beagleType_: 'type-C',
    },
  ],
}

export const treeC: IdentifiableBeagleUIElement = {
  id: 'C',
  _beagleType_: 'type-A',
  value: 'teste',
  children: [
    {
      id: 'C.0',
      _beagleType_: 'type-B',
      children: [
        {
          id: 'C.0.0',
          _beagleType_: 'type-C',
        },
      ],
    },
    {
      id: 'C.1',
      _beagleType_: 'type-D',
    },
  ],
}

export const treeD: IdentifiableBeagleUIElement = {
  id: 'D',
  _beagleType_: 'type-A',
  value: 'teste',
  children: [
    {
      id: 'D.0',
      _beagleType_: 'type-B',
      children: [
        {
          id: 'D.0.0',
          _beagleType_: 'type-C',
        },
      ],
    },
    {
      id: 'D.1',
      _beagleType_: 'type-D',
    },
  ],
}
