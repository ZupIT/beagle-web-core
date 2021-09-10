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

import { uniqueId } from 'lodash'
import BeagleService from 'service/beagle-service'
import Tree from 'beagle-tree'
import createConfig, { ConfigOptions } from './config'

interface ViewParams {
  route?: string,
  initialController?: string,
}

function start(options?: ConfigOptions) {
  const service = BeagleService.create(createConfig(options))

  async function createBeagleRemoteView({ initialController, route }: ViewParams) {
    const view = service.createView(initialController)
    const viewId = uniqueId()
    service.viewContentManagerMap.register(viewId, view)

    const render = jest.fn((tree) => {
      Tree.forEach(tree, (component) => {
        const componentFunction = service.getConfig().components[component._beagleComponent_]
        if (!componentFunction) {
          throw new Error(`Couldn't find component "${component._beagleComponent_}"`)
        }
        const viewContentManager = service.viewContentManagerMap.get(viewId, component.id)
        componentFunction({ ...component, viewContentManager })
      })
    })

    view.subscribe(render)
    if (route) await view.getNavigator().pushView({ url: route })

    return { view, render }
  }

  return { service, createBeagleRemoteView }
}

export default start
