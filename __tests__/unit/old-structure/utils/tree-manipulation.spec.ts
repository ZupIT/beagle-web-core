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

import { addChild, clone, insertIntoTree, replaceInTree } from 'beagle-tree/manipulation'
import { forEach } from 'beagle-tree/iteration'
import Component from 'beagle-view/render/component'
import { BeagleUIElement } from 'beagle-tree/types'
import Configuration from 'service/beagle-service/configuration' 
import { treeA, treeB, configComponentsWrong } from '../mocks'
import { last, hasDifferentPointers } from './test-utils'
import {
  treeAWithNull,
  cleanedTreeA,
  cleanedTreeB,
  treeBWithNull,
  treeCWithNull,
  cleanedTreeC,
  treeDWithNull,
  cleanedTreeD,
  treeEWithNull,
  cleanedTreeE,
} from './mock-tree-null'

describe('Utils: tree manipulation', () => {
  it('should clone tree', () => {
    const cloned = clone(treeA)
    expect(cloned).toEqual(treeA)
    expect(hasDifferentPointers(cloned, treeA)).toBe(true)
  })

  it('should prepend child to element', () => {
    const target = clone(treeA)
    addChild(target, treeB, 'prepend')
    expect(target.children![0]).toBe(treeB)
  })

  it('should append child to element', () => {
    const target = clone(treeA)
    addChild(target, treeB, 'append')
    expect(last(target.children!)).toBe(treeB)
  })

  it('should append child to element without children', () => {
    const target: BeagleUIElement<any> = { _beagleComponent_: 'test' }
    addChild(target, treeB, 'append')
    expect(target.children![0]).toBe(treeB)
  })

  it('should append element to tree node', () => {
    const target = clone(treeA)
    const expected = clone(treeA)
    expected.children![1].children![1].children!.push(treeB)
    insertIntoTree(target, treeB, 'A.1.1')
    expect(target).toEqual(expected)
  })

  it('should prepend element to tree node', () => {
    const target = clone(treeA)
    const expected = clone(treeA)
    expected.children![1]!.children!.unshift(treeB)
    insertIntoTree(target, treeB, 'A.1', 'prepend')
    expect(target).toEqual(expected)
  })

  it('should replace children of tree node', () => {
    const target = clone(treeA)
    const expected = clone(treeA)
    expected.children![1]!.children = [treeB]
    insertIntoTree(target, treeB, 'A.1', 'replace')
    expect(target).toEqual(expected)
  })

  it('should replace specific node in tree', () => {
    const target = clone(treeA)
    const expected = clone(treeA)
    expected.children![1].children![0] = treeB
    replaceInTree(target, treeB, 'A.1.0')
    expect(target).toEqual(expected)
  })

  // fixme: this test is out of place
  it('should insert custom word', () => {
    expect(() => Configuration.validate(configComponentsWrong)).toThrow(
      new Error(
        `Beagle: Please check your config. The button is not a valid name. Yours components or actions should always start with "beagle:" if it\'s overwriting a default component or an action, "custom:" if it\'s a custom component or an action`,
        )
      )
    }
  )

  // fixme: move to Render/Component
  it('should remove null values', () => {
    const mock = clone(treeAWithNull)
    forEach(mock, Component.eraseNullProperties)
    expect(mock).toStrictEqual(cleanedTreeA)
  })

  // fixme: move to Render/Component
  it('should remove null values from object props', () => {
    const mock = clone(treeBWithNull)
    forEach(mock, Component.eraseNullProperties)
    expect(mock).toStrictEqual(cleanedTreeB)
  })

  // fixme: move to Render/Component
  it('should remove null values from children items', () => {
    const mock = clone(treeCWithNull)
    forEach(mock, Component.eraseNullProperties)
    expect(mock).toStrictEqual(cleanedTreeC)
  })

  // fixme: move to Render/Component
  it('should remove null values from array items', () => {
    const mock = clone(treeDWithNull)
    forEach(mock, Component.eraseNullProperties)
    expect(mock).toStrictEqual(cleanedTreeD)
  })

  // fixme: move to Render/Component
  it('should parse correctly tree with multiple levels', () => {
    const mock = clone(treeEWithNull)
    forEach(mock, Component.eraseNullProperties)
    expect(mock).toStrictEqual(cleanedTreeE)
  })
})
