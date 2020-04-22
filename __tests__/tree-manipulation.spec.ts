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

import { addChild, clone, insertIntoTree, replaceInTree } from '../src/utils/tree-manipulation'
import { BeagleUIElement }  from '../src/types'
import { treeA, treeB } from './mocks'
import { last, hasDifferentPointers } from './test-utils'

describe('Utils: tree manipulation', () => {
  it('should clone tree', () => {
    const cloned = clone(treeA)
    expect(cloned).toEqual(treeA)
    expect(hasDifferentPointers(cloned, treeA)).toBe(true)
  })

  it('should prepend child to element', () => {
    const target = clone(treeA)
    addChild(target, treeB, 'prepend')
    expect(target.children[0]).toBe(treeB)
  })

  it('should append child to element', () => {
    const target = clone(treeA)
    addChild(target, treeB, 'append')
    expect(last(target.children)).toBe(treeB)
  })

  it('should append child to element without children', () => {
    const target: BeagleUIElement<any> = { _beagleType_: 'test' }
    addChild(target, treeB, 'append')
    expect(target.children[0]).toBe(treeB)
  })

  it('should append element to tree node', () => {
    const target = clone(treeA)
    const expected = clone(treeA)
    expected.children[1].children[1].children.push(treeB)
    insertIntoTree(target, treeB, 'A.1.1')
    expect(target).toEqual(expected)
  })

  it('should prepend element to tree node', () => {
    const target = clone(treeA)
    const expected = clone(treeA)
    expected.children[1].children.unshift(treeB)
    insertIntoTree(target, treeB, 'A.1', 'prepend')
    expect(target).toEqual(expected)
  })

  it('should replace specific node in tree', () => {
    const target = clone(treeA)
    const expected = clone(treeA)
    expected.children[1].children[0] = treeB
    replaceInTree(target, treeB, 'A.1.0')
    expect(target).toEqual(expected)
  })
})
