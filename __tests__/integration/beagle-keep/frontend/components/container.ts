/*
 * Copyright 2020, 2022 ZUP IT SERVICOS EM TECNOLOGIA E INOVACAO SA
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

import {
  BeforeStart,
  BeforeRender,
} from 'metadata/decorator'
import { Component, ContainerProps } from './types'

let isInitialized: Record<string, boolean> = {}
let containerIdCounter = 0

const Container: Component<ContainerProps> = ({
  id,
  onInit,
}) => {
  function handleInit() {
    if (!isInitialized[id]) {
      if (onInit) onInit()
      isInitialized[id] = true
    }
  } 

  /* the setTimeout here is to simulate angular and react lifecycles, "onInit", for instance. This
  lets the current render finish and makes the next one an actual new render. */
  setTimeout(handleInit, 10)
}

BeforeStart((container) => {
  container.id = `container:${containerIdCounter++}`
})(Container)

BeforeRender((container) => {
  container.style = container.style || {}
  container.style.color = '#FFF'
})(Container)

export default Container
