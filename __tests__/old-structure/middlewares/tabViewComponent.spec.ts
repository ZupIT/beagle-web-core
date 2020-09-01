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

import {
  simpleTab, simpleTabParsed,
  treeF,treeFParsed, treeA,
  treeG, treeGParsed,
  treeH, treeHParsed, tabViewWithCaseInsensitive, 
  parsedTabViewWithCaseInsensitive,
} from '../mocks'
import beagleTabViewMiddleware from '../../../src/legacy/tab-view'

describe('TabViewMiddleware', () => {

  it('should parse children tabItems as a component ', () => {
    // Trees with tabView don't respect type BeagleUIElement because 
    // the children in tabViews component lack _beagleComponent_
    // @ts-ignore
    const parsedTree = beagleTabViewMiddleware(simpleTab)
    expect(parsedTree).toEqual(simpleTabParsed)
  })

  it('should parse children tabItems without change other components', () => {
    // @ts-ignore
    const parsedTree = beagleTabViewMiddleware(treeF)
    expect(parsedTree).toEqual(treeFParsed)
  })

  it('should not change if tabview is in the expected structure ', () => {
    const parsedTree = beagleTabViewMiddleware(treeFParsed)
    expect(parsedTree).toEqual(treeFParsed)
  })

  it('should parse children tabItems as a component with multiple children levels ', () => {
    // @ts-ignore
    const parsedTree = beagleTabViewMiddleware(treeH)
    expect(parsedTree).toEqual(treeHParsed)
  })

  it('should parse tabView in the children tabItems array ', () => {
    // @ts-ignore
    const parsedTree = beagleTabViewMiddleware(treeG)
    expect(parsedTree).toEqual(treeGParsed)
  })

  it('should not change tree if no tabview component is present', () => {
    const parsedTree = beagleTabViewMiddleware(treeA)
    expect(parsedTree).toEqual(treeA)
  })

  it('should ignore case insensitive and parse', () => {
    // @ts-ignore
    const parsedTree = beagleTabViewMiddleware(tabViewWithCaseInsensitive)
    expect(parsedTree).toEqual(parsedTabViewWithCaseInsensitive)
  })
})
