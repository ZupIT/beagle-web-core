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
import { createComponents } from './parser.mock'

describe('Metadata: parser', () => {
  const components = createComponents()
  const metadata = ComponentMetadata.extract(components)

  it('should convert to lowercase', () => {
    expect(metadata.lifecycles.beforeStart['beagle:CONTAINER']).not.toBeDefined()
    expect(metadata.lifecycles.beforeStart['beagle:container']).toBeDefined()
    expect(metadata.children['beagle:CONTAINER']).not.toBeDefined()
    expect(metadata.children['beagle:container']).toBeDefined()
  })

  it('should parse beforeStart lifecycles', () => {
    expect(metadata.lifecycles.beforeStart).toEqual({
      'beagle:container': components['beagle:CONTAINER'].beagleMetadata!.lifecycles!.beforeStart,
      'beagle:text': components['beagle:text'].beagleMetadata!.lifecycles!.beforeStart,
    })
  })

  it('should parse beforeViewSnapshot lifecycles', () => {
    expect(metadata.lifecycles.beforeViewSnapshot).toEqual({
      'beagle:text': components['beagle:text'].beagleMetadata!.lifecycles!.beforeViewSnapshot,
    })
  })

  it('should parse afterViewSnapshot lifecycles', () => {
    expect(metadata.lifecycles.afterViewSnapshot).toEqual({
      'beagle:button': components['beagle:button'].beagleMetadata!.lifecycles!.afterViewSnapshot,
      'beagle:text': components['beagle:text'].beagleMetadata!.lifecycles!.afterViewSnapshot,
    })
  })

  it('should parse beforeRender lifecycles', () => {
    expect(metadata.lifecycles.beforeRender).toEqual({
      'beagle:container': components['beagle:CONTAINER'].beagleMetadata!.lifecycles!.beforeRender,
      'beagle:text': components['beagle:text'].beagleMetadata!.lifecycles!.beforeRender,
    })
  })

  it('should parse children metadata', () => {
    expect(metadata.children).toEqual({
      'beagle:container': components['beagle:CONTAINER'].beagleMetadata!.children,
      'beagle:button': components['beagle:button'].beagleMetadata!.children,
    })
  })
})
