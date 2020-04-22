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
import { treeA } from '../mocks'
import { treeE, treeEParsed } from '../styles-mocks'
import beagleStyleClassMiddleware from '../../src/middlewares/beagle-style-class'

describe('StyleClassMiddleware', () => {

  it('should transform style to kebab-case and add in the styleClass prop', () => {
    const parsedTree = beagleStyleClassMiddleware(treeE)
    expect(parsedTree).toEqual(treeEParsed)
  })

  it('should keep the tree if no style is present', () => {
    const parsedTree = beagleStyleClassMiddleware(treeA)
    expect(parsedTree).toEqual(treeA)
  })

  it('should not change style if already in kebab-case and on styleClass prop', () => {
    const parsedTree = beagleStyleClassMiddleware(treeEParsed)
    expect(parsedTree).toEqual(treeEParsed)
  })

})
