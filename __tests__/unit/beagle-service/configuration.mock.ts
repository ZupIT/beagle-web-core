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

import ComponentMetadata from 'metadata/parser'

export function mockMetadataParsing() {
  const original = ComponentMetadata.extract
  const metadata = {
    children: {},
    lifecycles: {
      beforeStart: {
        'beagle:container': jest.fn(),
        'beagle:text': jest.fn(),
      },
      beforeViewSnapshot: {
        'beagle:text': jest.fn(),
      },
      beforeRender: {
        'beagle:container': jest.fn(),
        'beagle:text': jest.fn(),
      },
      afterViewSnapshot: {
        'beagle:button': jest.fn(),
        'beagle:text': jest.fn(),
      },
    },
  }
  ComponentMetadata.extract = jest.fn(() => metadata)

  return {
    metadata,
    unmockMetadataParsing: () => ComponentMetadata.extract = original,
  }
}
