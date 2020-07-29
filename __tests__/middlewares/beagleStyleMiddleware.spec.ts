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

/**
 * Fix me: should reflect Renderer/Styling.ts. Maybe it should be decoupled from Tree.ts.
 */

import * as mocks from '../styles-mocks'
import Tree from '../../src/utils/Tree'
import Styling from '../../src/Renderer/Styling'
import { clone } from '../../src/utils/tree-manipulation'

describe('StyleMiddleware', () => {

  it('should handle size attributes', () => {
    const tree = clone(mocks.treeSize)
    Tree.forEach(tree, Styling.convert)
    expect(tree).toEqual(mocks.treeSizeParsed)
  })

  it('should handle aspect ratio', () => {
    const tree = clone(mocks.treeAspectRatio)
    Tree.forEach(tree, Styling.convert)
    expect(tree).toEqual(mocks.treeAspectRatioParsed)
  })

  it('should handle position attributes', () => {
    const tree = clone(mocks.treePosition)
    Tree.forEach(tree, Styling.convert)
    expect(tree).toEqual(mocks.treePositionParsed)
  })

  it('should handle flex attributes', () => {
    const tree = clone(mocks.treeFlex)
    Tree.forEach(tree, Styling.convert)
    expect(tree).toEqual(mocks.treeFlexParsed)
  })

  it('should handle margin attributes', () => {
    const tree = clone(mocks.treeMargin)
    Tree.forEach(tree, Styling.convert)
    expect(tree).toEqual(mocks.treeMarginParsed)
  })

  it('should handle padding style', () => {
    const tree = clone(mocks.treePadding)
    Tree.forEach(tree, Styling.convert)
    expect(tree).toEqual(mocks.treePaddingParsed)
  })

  it('should keep attributes name and change values to lowerCase', () => {
    const tree = clone(mocks.treeAttributesToKeepName)
    Tree.forEach(tree, Styling.convert)
    expect(tree).toEqual(mocks.treeAttributesToKeepNameParsed)
  })

  it('should not change tree if no style is present', () => {
    const tree = clone(mocks.treeWithoutStyle)
    Tree.forEach(tree, Styling.convert)
    expect(tree).toEqual(mocks.treeWithoutStyle)
  })

  it('should parse multiple styles on the tree', () => {
    const tree = clone(mocks.treeMixStyle)
    Tree.forEach(tree, Styling.convert)
    expect(tree).toEqual(mocks.treeMixStyleParsed)
  })

 it('should keep position if positionType is available otherwise add position:relative', () => {
    const tree = clone(mocks.treeContextValue)
    Tree.forEach(tree, Styling.convert)
    expect(tree).toEqual(mocks.treeContextValueParsed)
  })

  it('should not handle start and end as special margin, padding and position types', () => {
    const tree = clone(mocks.treeStartEndEdgeValue)
    Tree.forEach(tree, Styling.convert)
    expect(tree).toEqual(mocks.treeStartEndEdgeValueParsed)
  })

  it('should reorder margin for the default order when having all attributes', () => {
    const tree = clone(mocks.treeStyleOrder)
    Tree.forEach(tree, Styling.convert)
    expect(tree).toEqual(mocks.treeStyleOrderParsed)
  })

  it('should reorder padding attributes with all having lesser priority', () => {
    const tree = clone(mocks.treeStyleOrderAll)
    Tree.forEach(tree, Styling.convert)
    expect(tree).toEqual(mocks.treeStyleOrderAllParsed)
  })

  it('should reorder position attribute', () => {
    const tree = clone(mocks.treeOrderPosition)
    Tree.forEach(tree, Styling.convert)
    expect(tree).toEqual(mocks.treeOrderPositionParsed)
  })

  it('should handle corner Radius', () => {
    const tree = clone(mocks.treeWithCornerRadius)
    Tree.forEach(tree, Styling.convert)
    expect(tree).toEqual(mocks.treeWithCornerRadiusParsed)
  })
})
