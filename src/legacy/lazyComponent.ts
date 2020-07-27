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

// fixme: this should not be in the core library

import Component from '../Renderer/Component'
import { BeagleUIElement } from '../types'

const transformLazyComponent = (uiTree: BeagleUIElement<any>) => {
  const toLowerCaseName = uiTree._beagleComponent_ && uiTree._beagleComponent_.toString().toLowerCase()
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

const beagleLazyComponentMiddleware = (uiTree: BeagleUIElement<any>) => {
  Component.formatChildrenProperty(uiTree)
  uiTree = transformLazyComponent(uiTree)
  if (uiTree.children) uiTree.children.forEach(beagleLazyComponentMiddleware)
  return uiTree
}

export default beagleLazyComponentMiddleware
