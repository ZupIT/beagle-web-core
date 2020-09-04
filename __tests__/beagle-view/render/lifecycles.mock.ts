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

import { LifecycleHookMap } from 'service/beagle-service/types'
import Tree from 'beagle-tree'

export function createLifecycleMap(global: boolean, components: boolean): LifecycleHookMap {
  const lf: LifecycleHookMap = {
    beforeStart: {
      components: {
        'beagle:container': jest.fn(),
        'beagle:text': jest.fn(),
      },
      global: jest.fn(),
    },
    beforeViewSnapshot: {
      components: {
        'beagle:text': jest.fn(),
      },
      global: jest.fn(),
    },
    afterViewSnapshot: {
      components: {
        'beagle:image': jest.fn(),
        'beagle:text': jest.fn(),
      },
      global: jest.fn(),
    },
    beforeRender: {
      components: {
        'beagle:text': jest.fn(),
      },
      global: jest.fn(),
    },
  }

  if (!global) {
    delete lf.beforeStart.global
    delete lf.beforeViewSnapshot.global
    delete lf.afterViewSnapshot.global
    delete lf.beforeRender.global
  }

  if (!components) {
    lf.beforeStart.components = {}
    lf.beforeViewSnapshot.components = {}
    lf.afterViewSnapshot.components = {}
    lf.beforeRender.components = {}
  }

  return lf
}

export function createLifecycleMapWithModificationsToTree(shouldClone: boolean): LifecycleHookMap {
  return {
    beforeStart: {
      components: {
        'beagle:container': jest.fn((container: any) => {
          const modified = shouldClone ? Tree.clone(container) : container
          modified.beforeStart = 'container'
          return shouldClone ? modified : undefined
        }),
        'beagle:text': jest.fn((text: any) => {
          const modified = shouldClone ? Tree.clone(text) : text
          modified.beforeStart = 'text'
          return shouldClone ? modified : undefined
        }),
      },
      global: jest.fn((tree: any) => {
        const modified = shouldClone ? Tree.clone(tree) : tree
        modified.globalBeforeStart = 'global'
        return shouldClone ? modified : undefined
      }),
    },
    beforeViewSnapshot: {
      components: {
        'beagle:text': jest.fn((text: any) => {
          const modified = shouldClone ? Tree.clone(text) : text
          modified.beforeViewSnapshot = 'text'
          return shouldClone ? modified : undefined
        }),
      },
      global: jest.fn((tree: any) => {
        const modified = shouldClone ? Tree.clone(tree) : tree
        modified.globalBeforeViewSnapshot = 'global'
        return shouldClone ? modified : undefined
      }),
    },
    afterViewSnapshot: {
      components: {
        'beagle:image': jest.fn((image: any) => {
          const modified = shouldClone ? Tree.clone(image) : image
          modified.afterViewSnapshot = 'image'
          return shouldClone ? modified : undefined
        }),
        'beagle:text': jest.fn((text: any) => {
          const modified = shouldClone ? Tree.clone(text) : text
          modified.afterViewSnapshot = 'text'
          return shouldClone ? modified : undefined
        }),
      },
      global: jest.fn((tree: any) => {
        const modified = shouldClone ? Tree.clone(tree) : tree
        modified.globalAfterViewSnapshot = 'global'
        return shouldClone ? modified : undefined
      }),
    },
    beforeRender: {
      components: {
        'beagle:text': jest.fn((text: any) => {
          const modified = shouldClone ? Tree.clone(text) : text
          modified.beforeRender = 'text'
          return shouldClone ? modified : undefined
        }),
      },
      global: jest.fn((tree: any) => {
        const modified = shouldClone ? Tree.clone(tree) : tree
        modified.globalBeforeRender = 'global'
        return shouldClone ? modified : undefined
      }),
    },
  }
}

export function createTreeWithContainerTextAndImage() {
  return {
    _beagleComponent_: 'beagle:container',
    id: "container",
    children: [
      {
        _beagleComponent_: 'beagle:text',
        id: "text",
        text: 'test',
      },
      {
        _beagleComponent_: 'beagle:container',
        id: 'imageContainer',
        children: [
          {
            _beagleComponent_: 'beagle:image',
            id: "image",
            url: 'http://test.com',
          }
        ]
      }
    ],
  }
}

export function createTreeWithContainerAndText() {
  return {
    _beagleComponent_: 'beagle:container',
    id: "container",
    children: [
      {
        _beagleComponent_: 'beagle:text',
        id: "text",
        text: 'test',
      },
    ],
  }
}

export function createExpectationsForExecutionOrderTests() {
  let global: any = createTreeWithContainerTextAndImage()
  let text = Tree.findById(global, 'text')
  let imageContainer = Tree.findById(global, 'imageContainer')
  let image = Tree.findById(global, 'image')
  const beforeStart = {
    global,
    container: { ...global, globalBeforeStart: 'global' },
    text,
    imageContainer,
    image,
  }

  global = {
    ...global,
    globalBeforeStart: 'global',
    beforeStart: 'container',
    children: [
      { ...text, beforeStart: 'text' },
      { ...imageContainer, beforeStart: 'container' },
    ],
  }

  text = Tree.findById(global, 'text')
  imageContainer = Tree.findById(global, 'imageContainer')
  image = Tree.findById(global, 'image')
  const beforeViewSnapshot = { global, container: global, text, imageContainer, image }

  global = {
    ...global,
    globalBeforeViewSnapshot: 'global',
    children: [
      { ...text, beforeViewSnapshot: 'text' },
      imageContainer,
    ],
  }

  text = Tree.findById(global, 'text')
  imageContainer = Tree.findById(global, 'imageContainer')
  image = Tree.findById(global, 'image')
  const afterViewSnapshot = { global, container: global, text, imageContainer, image }

  global = {
    ...global,
    globalAfterViewSnapshot: 'global',
    children: [
      { ...text, afterViewSnapshot: 'text' },
      {
        ...imageContainer,
        children: [
          { ...image, afterViewSnapshot: 'image' },
        ],
      }
    ]
  }

  text = Tree.findById(global, 'text')
  imageContainer = Tree.findById(global, 'imageContainer')
  image = Tree.findById(global, 'image')
  const beforeRender = { global, container: global, text, imageContainer, image }

  global = {
    ...global,
    globalBeforeRender: 'global',
    children: [
      { ...text, beforeRender: 'text' },
      imageContainer,
    ]
  }

  text = Tree.findById(global, 'text')
  imageContainer = Tree.findById(global, 'imageContainer')
  image = Tree.findById(global, 'image')
  const renderToScreen = { global, container: global, text, imageContainer, image }

  return { beforeStart, beforeViewSnapshot, afterViewSnapshot, beforeRender, renderToScreen }
}
