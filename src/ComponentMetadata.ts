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
  BeagleConfig,
  ComponentMetadata,
  Lifecycle,
  LifecycleHook,
  ChildrenMetadata,
} from './types'

export interface ExtractedMetadata {
  children: Record<string, ChildrenMetadata>,
  lifecycles: Record<Lifecycle, Record<string, LifecycleHook>>,
}

function extract(components: BeagleConfig<any>['components']) {
  const keys = Object.keys(components)
  const extractedMetadata: ExtractedMetadata = {
    children: {},
    lifecycles: {
      afterViewSnapshot: {},
      beforeRender: {},
      beforeStart: {},
      beforeViewSnapshot: {},
    },
  }

  keys.forEach((key) => {
    const component = components[key]
    const metadata: ComponentMetadata | undefined = component.beagleMetadata
    if (!metadata) return
    if (metadata.children) extractedMetadata.children[key] = metadata.children
    if (metadata.lifecycles) {
      const lifecycleKeys = Object.keys(metadata.lifecycles) as Lifecycle[]
      lifecycleKeys.forEach(lifecycleKey => {
        const hook = metadata.lifecycles![lifecycleKey]
        if (!hook) return
        extractedMetadata.lifecycles[lifecycleKey][key] = hook
      })
    }
  })

  return extractedMetadata
}

export default {
  extract,
}
