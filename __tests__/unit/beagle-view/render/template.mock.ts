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

import { BeagleUIElement, DataContext } from 'beagle-tree/types'
import { TemplateManager } from 'beagle-view/render/template-manager/types'

export interface TemplateMocks {
  baseContainer: BeagleUIElement
  dataSource: DataContext[][]
  exceptionDataSource: DataContext[][]
  templateManager: TemplateManager
  exceptionTemplateManager: TemplateManager
  renderedContainer: BeagleUIElement
  renderedExceptionContainer: BeagleUIElement
}

export function createTemplateRenderMocks(): TemplateMocks {
  const baseContainer = {
    _beagleComponent_: 'beagle:container',
    id: 'template-container',
    context: {
      id: 'templateContainerContext',
      value: {
        propA: 'Test',
        propB: '???',
      },
    },
    children: [],
  }

  const implicitContexts = {
    first: [{ id: 'item', value: { key: 'first', text: 'First Child' } }],
    second: [{ id: 'item', value: { key: 'second', text: 'Second Child' } }],
    third: [{ id: 'item', value: { key: 'third', text: 'First Child' } }],
    unknown: [{ id: 'item', value: { key: 'unknown', text: 'Unknown Child' } }],
    secondUnknown: [{ id: 'item', value: { key: 'unknown 2', text: '???' } }],
  }

  const dataSource = [
    implicitContexts.first,
    implicitContexts.second,
    implicitContexts.unknown,
    implicitContexts.third,
    implicitContexts.secondUnknown,
  ]

  const exceptionDataSource = [
    implicitContexts.unknown,
    implicitContexts.first,
    implicitContexts.first,
    implicitContexts.third,
    implicitContexts.unknown,
    implicitContexts.secondUnknown,
    implicitContexts.unknown,
    implicitContexts.second,
    implicitContexts.third,
    implicitContexts.unknown,
  ]

  const renderImplicitContext = (_implicitContexts_: DataContext[] = []) =>
    (_implicitContexts_ && _implicitContexts_.length > 0 ? { _implicitContexts_ } : {})

  const templates = {
    firstChild: (implicitContext: DataContext[] = []) => ({
      _beagleComponent_: 'beagle:container',
      id: `first-child`,
      ...renderImplicitContext(implicitContext),
      children: [
        {
          _beagleComponent_: 'beagle:textInput',
          id: `first-text`,
          value: 'first',
        }
      ],
    }),
    secondChild: (implicitContext: DataContext[] = []) => ({
      _beagleComponent_: 'beagle:textInput',
      id: `second-child`,
      value: 'second',
      ...renderImplicitContext(implicitContext),
    }),
    thirdChild: (implicitContext: DataContext[] = []) => ({
      _beagleComponent_: 'beagle:container',
      id: `third-child`,
      ...renderImplicitContext(implicitContext),
      children: [
        {
          _beagleComponent_: 'beagle:textInput',
          id: `third-label`,
          value: `third label`,
        },
        {
          _beagleComponent_: 'beagle:input',
          id: `third-input`,
          value: `third input`,
        }
      ],
    }),
    unknownChild: (implicitContext: DataContext[] = []) => ({
      _beagleComponent_: 'beagle:textInput',
      id: `unknown-child`,
      value: 'unknown',
      ...renderImplicitContext(implicitContext),
    }),
    secondUnknownChild: (implicitContext: DataContext[] = []) => ({
      _beagleComponent_: 'beagle:container',
      id: `second-unknown-child`,
      ...renderImplicitContext(implicitContext),
      children: [
        {
          _beagleComponent_: 'beagle:textInput',
          id: `second-unknown-text`,
          value: '@{templateContainerContext.propA}',
        }
      ],
    }),
  }

  const templateManager = {
    default: templates.unknownChild(),
    templates: [
      {
        case: "@{eq(item.key, 'first')}",
        view: templates.firstChild(),
      },
      {
        case: "@{eq(item.key, 'second')}",
        view: templates.secondChild(),
      },
      {
        case: "@{eq(item.key, 'third')}",
        view: templates.thirdChild(),
      },
      {
        case: "@{eq(item.text, templateContainerContext.propB)}",
        view: templates.secondUnknownChild(),
      },
    ]
  }

  const exceptionTemplateManager = {
    templates: [
      {
        case: "@{eq(item.key, 'first')}",
        view: templates.firstChild(),
      },
      {
        case: "@{eq(item.key, 'second')}",
        view: templates.secondChild(),
      },
      {
        case: "@{eq(item.key, 'third')}",
        view: templates.thirdChild(),
      },
      {
        case: "@{eq(item.text, templateContainerContext.propB)}",
        view: templates.secondUnknownChild(),
      },
    ]
  }

  return {
    baseContainer,
    dataSource,
    exceptionDataSource,
    templateManager,
    exceptionTemplateManager,
    renderedContainer: {
      ...baseContainer,
      children: [
        templates.firstChild(implicitContexts.first),
        templates.secondChild(implicitContexts.second),
        templates.unknownChild(implicitContexts.unknown),
        templates.thirdChild(implicitContexts.third),
        templates.secondUnknownChild(implicitContexts.secondUnknown),
      ],
    },
    renderedExceptionContainer: {
      ...baseContainer,
      children: [
        { ...templates.firstChild(implicitContexts.first), id: 'first-child:1' },
        { ...templates.firstChild(implicitContexts.first), id: 'first-child:2' },
        { ...templates.thirdChild(implicitContexts.third), id: 'third-child:3' },
        { ...templates.secondUnknownChild(implicitContexts.secondUnknown), id: 'second-unknown-child:5' },
        { ...templates.secondChild(implicitContexts.second), id: 'second-child:7' },
        { ...templates.thirdChild(implicitContexts.third), id: 'third-child:8' },
      ],
    }
  }
}
