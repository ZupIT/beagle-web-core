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

/**
 * fixme: should follow the new organization and test Renderer/Component.ts. Maybe it would be
 * better not to couple this with the utils "Tree".
 */

import Tree from 'beagle-tree'
import Component from 'beagle-view/render/component'
import {  treeWithChild, treeWithChildAndChildren, treeTestChild } from '../mocks'

describe('ChildToChildren Middleware', () => {
  it('should transform child attributes to children attributes', () => {
    const mock = Tree.clone(treeWithChild)
    Tree.forEach(mock, component => Component.formatChildrenProperty(component))
    expect(mock).toEqual(treeTestChild)
  })

  it('should return same tree when no child is found', () => {
    const mock = Tree.clone(treeTestChild)
    Tree.forEach(mock, component => Component.formatChildrenProperty(component))
    expect(mock).toEqual(treeTestChild)
  })

  it('should return only one children attribute when both child and children are found', () => {
    const mock = Tree.clone(treeWithChildAndChildren)
    Tree.forEach(mock, component => Component.formatChildrenProperty(component))
    expect(mock).toEqual(treeTestChild)
  })
})
