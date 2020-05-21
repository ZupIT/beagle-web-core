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
} from '../styles-mocks'
import beagleStyleMiddleware from '../../src/middlewares/beagle-style'

describe('StyleMiddleware', () => {

  it('should handle size attributes', () => {
    const parsedTree = beagleStyleMiddleware(treeSize)
    expect(parsedTree).toEqual(treeSizeParsed)
  })

  it('should handle aspect ratio', () => {
    const parsedTree = beagleStyleMiddleware(treeAspectRatio)
    expect(parsedTree).toEqual(treeAspectRatioParsed)
  })

  it('should handle position attributes', () => {
    const parsedTree = beagleStyleMiddleware(treePosition)
    expect(parsedTree).toEqual(treePositionParsed)
  })

  it('should handle flex attributes', () => {
    const parsedTree = beagleStyleMiddleware(treeFlex)
    expect(parsedTree).toEqual(treeFlexParsed)
  })

  it('should handle margin attributes', () => {
    const parsedTree = beagleStyleMiddleware(treeMargin)
    expect(parsedTree).toEqual(treeMarginParsed)
  })

  it('should handle padding style', () => {
    const parsedTree = beagleStyleMiddleware(treePadding)
    expect(parsedTree).toEqual(treePaddingParsed)
  })

  it('should keep attributes name and change values to lowerCase', () => {
    const parsedTree = beagleStyleMiddleware(treeAttributesToKeepName)
    expect(parsedTree).toEqual(treeAttributesToKeepNameParsed)
  })

  it('should not change tree if no style is present', () => {
    const parsedTree = beagleStyleMiddleware(treeWithoutStyle)
    expect(parsedTree).toEqual(treeWithoutStyle)
  })

  it('should parse multiple styles on the tree', () => {
    const parsedTree = beagleStyleMiddleware(treeMixStyle)
    expect(parsedTree).toEqual(treeMixStyleParsed)
  })

})
