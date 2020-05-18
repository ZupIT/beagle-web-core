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
  treePositionParsed, treePosition,
  treeFlex, treeFlexParsed,
  treeMargin, treeMarginParsed, treePadding, treePaddingParsed, 
  treeColorSize, treeColorSizeParsed
} from '../styles-mocks'
import beagleStyleMiddleware from '../../src/middlewares/beagle-style'

describe('StyleMiddleware', () => {

  it('should handle size attributes', () => {
    const parsedTree = beagleStyleMiddleware(treeSize)
    expect(parsedTree).toEqual(treeSizeParsed)
  })

  it('should handle position attributes', () => {
    const parsedTree = beagleStyleMiddleware(treePosition)
    expect(parsedTree).toEqual(treePositionParsed)
  })

  it('should handle flex attributes', () => {
    const parsedTree = beagleStyleMiddleware(treeFlex)
    expect(parsedTree).toEqual(treeFlexParsed)
  })

  // it('should transform margin attributes', () => {
  //   const parsedTree = beagleStyleMiddleware(treeMargin)
  //   expect(parsedTree).toEqual(treeMarginParsed)
  // })

  // it('should transform padding style', () => {
  //   const parsedTree = beagleStyleMiddleware(treePadding)
  //   expect(parsedTree).toEqual(treePaddingParsed)
  // })

  // it('should transform color and size attributes', () => {
  //   const parsedTree = beagleStyleMiddleware(treeColorSize)
  //   expect(parsedTree).toEqual(treeColorSizeParsed)
  // })



})
