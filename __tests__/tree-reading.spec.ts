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

import {
  findByAttribute,
  findById,
  findByType,
  findParentByChildId,
  indexOf,
} from '../src/utils/tree-reading'
import { treeA } from './mocks'

describe('Utils: tree reading', () => {
  it('should find by attribute', () => {
    expect(findByAttribute(treeA, 'style').length).toBe(4)
    expect(findByAttribute(treeA, 'style', 'margin: 10').length).toBe(2)
    expect(findByAttribute(treeA, 'style', 'margin: 20').length).toBe(2)
    expect(findByAttribute(treeA, 'style')[0]).toBe(treeA.children[0])
  })

  it('should not find by attribute', () => {
    expect(findByAttribute(treeA, 'blah').length).toBe(0)
    expect(findByAttribute(treeA, 'style', 'margin: 30').length).toBe(0)
  })

  it('should find by type', () => {
    expect(findByType(treeA, 'type-B').length).toBe(2)
    expect(findByType(treeA, 'type-F').length).toBe(4)
  })

  it('should not find by type', () => {
    expect(findByType(treeA, 'blah').length).toBe(0)
  })

  it('should find by id', () => {
    expect(findById(treeA, 'A')).toBe(treeA)
    expect(findById(treeA, 'A.1')).toBe(treeA.children[1])
    expect(findById(treeA, 'A.1.1.3')).toBe(treeA.children[1].children[1].children[3])
  })

  it('should not find by id', () => {
    expect(findById(treeA, 'blah')).toBe(null)
  })

  it('should find parent by child id', () => {
    expect(findParentByChildId(treeA, 'A.0')).toBe(treeA)
    expect(findParentByChildId(treeA, 'A.2')).toBe(treeA)
    expect(findParentByChildId(treeA, 'A.1.0')).toBe(treeA.children[1])
    expect(findParentByChildId(treeA, 'A.1.1.2')).toBe(treeA.children[1].children[1])
  })

  it('should not find parent by child id', () => {
    expect(findParentByChildId(treeA, 'A')).toBe(null)
    expect(findParentByChildId(treeA, 'blah')).toBe(null)
  })

  it('should return index of child', () => {
    expect(indexOf(treeA, 'A.0')).toBe(0)
    expect(indexOf(treeA, 'A.1')).toBe(1)
    expect(indexOf(treeA, 'A.2')).toBe(2)
  })

  it('should return -1 when child is not found', () => {
    expect(indexOf(treeA, 'A')).toBe(-1)
    expect(indexOf(treeA, 'A.1.0')).toBe(-1)
  })
})
