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
  treeSize, treeSizeParsed,
  treeAspectRatio, treeAspectRatioParsed,
  treePositionParsed, treePosition,
  treeFlex, treeFlexParsed,
  treeMargin, treeMarginParsed, 
  treePadding, treePaddingParsed,
  treeAttributesToKeepName, treeAttributesToKeepNameParsed,
  treeWithoutStyle, treeMixStyle, treeMixStyleParsed,
  treeAttributesToKeepNameWithContext,
  treeMixStyleWithContext, treeMixStyleWithContextParsed, 
  treeContextValue, treeContextValueParsed,
  treeContextType, treeContextTypeParsed, 
  notValidContext, notValidContextParsed,
  treeStartEndEdgeValue, treeStartEndEdgeValueParsed,
  treeStyleOrder, treeStyleOrderParsed, treeStyleOrderAll, treeStyleOrderAllParsed, 
  treeUnsupportedSingleProperties, treeUnsupportedSinglePropertiesParsed, treeOrderPositionParsed, treeOrderPosition,
  treeWithCornerRadius, treeWithCornerRadiusParsed
} from '../styles-mocks'
import beagleStyleMiddleware from '../../src/middlewares/beagle-style'
import { clone } from '../../src/utils/tree-manipulation'

describe('StyleMiddleware', () => {

  it('should handle size attributes', () => {
    const tree = clone(treeSize)
    const parsedTree = beagleStyleMiddleware(tree)
    expect(parsedTree).toEqual(treeSizeParsed)
  })

  it('should handle aspect ratio', () => {
    const tree = clone(treeAspectRatio)
    const parsedTree = beagleStyleMiddleware(tree)
    expect(parsedTree).toEqual(treeAspectRatioParsed)
  })

  it('should handle position attributes', () => {
    const tree = clone(treePosition)
    const parsedTree = beagleStyleMiddleware(tree)
    expect(parsedTree).toEqual(treePositionParsed)
  })

  it('should handle flex attributes', () => {
    const tree = clone(treeFlex)
    const parsedTree = beagleStyleMiddleware(tree)
    expect(parsedTree).toEqual(treeFlexParsed)
  })

  it('should handle margin attributes', () => {
    const tree = clone(treeMargin)
    const parsedTree = beagleStyleMiddleware(tree)
    expect(parsedTree).toEqual(treeMarginParsed)
  })

  it('should handle padding style', () => {
    const tree = clone(treePadding)
    const parsedTree = beagleStyleMiddleware(tree)
    expect(parsedTree).toEqual(treePaddingParsed)
  })

  it('should keep attributes name and change values to lowerCase', () => {
    const tree = clone(treeAttributesToKeepName)
    const parsedTree = beagleStyleMiddleware(tree)
    expect(parsedTree).toEqual(treeAttributesToKeepNameParsed)
  })

  it('should not change tree if no style is present', () => {
    const tree = clone(treeWithoutStyle)
    const parsedTree = beagleStyleMiddleware(tree)
    expect(parsedTree).toEqual(treeWithoutStyle)
  })

  it('should parse multiple styles on the tree', () => {
    const tree = clone(treeMixStyle)
    const parsedTree = beagleStyleMiddleware(tree)
    expect(parsedTree).toEqual(treeMixStyleParsed)
  })

  it('should not change already parsed style', () => {
    let tree = clone(treeSizeParsed)
    let parsedTree = beagleStyleMiddleware(tree)
    expect(parsedTree).toEqual(tree)
    
    tree = clone(treeAspectRatioParsed)
    parsedTree = beagleStyleMiddleware(tree)
    expect(parsedTree).toEqual(tree)
    
    tree = clone(treePositionParsed)
    parsedTree = beagleStyleMiddleware(tree)
    expect(parsedTree).toEqual(tree)

    tree = clone(treeFlexParsed)
    parsedTree = beagleStyleMiddleware(tree)
    expect(parsedTree).toEqual(tree)

    tree = clone(treeMarginParsed)
    parsedTree = beagleStyleMiddleware(tree)
    expect(parsedTree).toEqual(tree)

    tree = clone(treePaddingParsed)
    parsedTree = beagleStyleMiddleware(tree)
    expect(parsedTree).toEqual(tree)

    tree = clone(treeAttributesToKeepNameParsed)
    parsedTree = beagleStyleMiddleware(tree)
    expect(parsedTree).toEqual(tree)

    tree = clone(treeMixStyleParsed)
    parsedTree = beagleStyleMiddleware(tree)
    expect(parsedTree).toEqual(tree)
  })

  it('should not change context variable', () => {
    const tree = clone(treeAttributesToKeepNameWithContext)
    const parsedTree = beagleStyleMiddleware(tree)
    expect(parsedTree).toEqual(treeAttributesToKeepNameWithContext)
  })

  it('should parse object mixed with context without changing context', () => {
    const tree = clone(treeMixStyleWithContext)
    const parsedTree = beagleStyleMiddleware(tree)
    expect(parsedTree).toEqual(treeMixStyleWithContextParsed)
  })

 it('should keep position if positionType available otherwise add position:relative', () => {
    const tree = clone(treeContextValue)
    const parsedTree = beagleStyleMiddleware(tree)
    expect(parsedTree).toEqual(treeContextValueParsed)
  })

  it('should parse object with context on type without changing it', () => {
    const tree = clone(treeContextType)
    const parsedTree = beagleStyleMiddleware(tree)
    expect(parsedTree).toEqual(treeContextTypeParsed)
  })

  it('should not keep values if invalid context format', () => {
    const tree = clone(notValidContext)
    const parsedTree = beagleStyleMiddleware(tree)
    expect(parsedTree).toEqual(notValidContextParsed)
  })

  it('should keep already parsed tree with context', () => {
    const tree = clone(treeMixStyleWithContextParsed)
    const parsedTree = beagleStyleMiddleware(tree)
    expect(parsedTree).toEqual(treeMixStyleWithContextParsed)
  })

  it('should not handle start and end as special margin, padding and position types', () => {
    const tree = clone(treeStartEndEdgeValue)
    const parsedTree = beagleStyleMiddleware(tree)
    expect(parsedTree).toEqual(treeStartEndEdgeValueParsed)
  })

  it('should ignore invalid single property', () => {
    const tree = clone(treeUnsupportedSingleProperties)
    const parsedTree = beagleStyleMiddleware(tree)
    expect(parsedTree).toEqual(treeUnsupportedSinglePropertiesParsed)
  })

  it('should reorder margin for the default order when having all attributes', () => {
    const tree = clone(treeStyleOrder)
    const parsedTree = beagleStyleMiddleware(tree)
    expect(parsedTree).toStrictEqual(treeStyleOrderParsed)
  })

  it('should reorder padding attributes with all having lesser priority', () => {
    const tree = clone(treeStyleOrderAll)
    const parsedTree = beagleStyleMiddleware(tree)
    expect(parsedTree).toStrictEqual(treeStyleOrderAllParsed)
  })

  it('should reorder position attribute', () => {
    const tree = clone(treeOrderPosition)
    const parsedTree = beagleStyleMiddleware(tree)
    expect(parsedTree).toStrictEqual(treeOrderPositionParsed)
  })

  it('should handle corner Radius', () => {
    const tree = clone(treeWithCornerRadius)
    const parsedTree = beagleStyleMiddleware(tree)
    expect(parsedTree).toEqual(treeWithCornerRadiusParsed)
  })
})
