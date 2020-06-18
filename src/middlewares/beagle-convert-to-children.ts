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

import { BeagleUIElement } from '../types'

const convertChildToChildren = (uiTree: BeagleUIElement<any>) => {
    if (uiTree.child) {
        const child = uiTree.child
        if (typeof child !== 'object') return uiTree

        const childArray = Array.isArray(child) ? child : [child]
        const children = uiTree.children
        delete uiTree.children
        
        uiTree.children = children ? [...children, ...childArray] : childArray
        delete uiTree.child
    }
        
    return uiTree
}

const beagleLazyComponentMiddleware = (uiTree: BeagleUIElement<any>) => {
  const toLowerCaseName = uiTree._beagleComponent_.toString().toLowerCase()
  if (toLowerCaseName === 'beagle:lazycomponent' && uiTree.initialState) {
      const initialState = uiTree.initialState
      if (typeof initialState !== 'object') return uiTree

      const initialStateArray = Array.isArray(initialState) ? initialState : [initialState]
      const children = uiTree.children
      delete uiTree.children
      
      uiTree.children = children ? [...children, ...initialStateArray] : initialStateArray
      delete uiTree.initialState
  }
      
  return uiTree
}

const beagleConvertToChildrenMiddleware = (uiTree: BeagleUIElement<any>) => {
  uiTree = convertChildToChildren(uiTree)
  uiTree = beagleLazyComponentMiddleware(uiTree)
  
  if (uiTree.children) uiTree.children.forEach(convertChildToChildren)

  return uiTree
}
export default beagleConvertToChildrenMiddleware
