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

import { clone } from 'beagle-tree/manipulation'
import { BeagleConfig } from 'service/beagle-service/types'
import { createLocalStorageMock } from '../../../old-structure/utils/test-utils'
import { paths } from '../backend/routes'
import { url } from '../constants'
import components from './components'
import setupOperations from './operations'

function createConfig(): BeagleConfig<any> {
  setupOperations()
  return {
    baseUrl: `${url}${paths.view}`,
    components,
    customActions: {
      'custom:feedback': jest.fn(),
    },
    lifecycles: {
      beforeStart: jest.fn((tree) => {
        /* making a clone guarantees Beagle won't alter the tree received as parameter, making it
        possible to verify the snapshots when testing. The same is done in all other lifecycles. */
        const newTree = clone(tree)
        if (newTree.version !== undefined) {
          newTree.version = 'Beagle Keep v1.0'
          return newTree
        }
      }),
      beforeViewSnapshot: jest.fn(clone),
      afterViewSnapshot: jest.fn(clone),
      beforeRender: jest.fn(clone),
    },
    customStorage: createLocalStorageMock(),
  }
}

export default createConfig
