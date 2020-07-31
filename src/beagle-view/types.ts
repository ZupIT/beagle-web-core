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

import { URLService } from '../network/url'
import { ViewClientService } from '../network/view-client'
import { GlobalContextService } from '../service/global-context'
import { TreeContentService } from '../service/tree-content'
import { ActionHandler } from '../actions/types'
import { LifecycleHookMap } from '../service/types'
import { ChildrenMetadataMap } from '../metadata/types'

export interface BeagleViewParams {
  initialRoute: string,

  // from config
  actionHandlers: Record<string, ActionHandler>,
  lifecycleHooks: LifecycleHookMap,
  childrenMetadata: ChildrenMetadataMap,

  // services
  globalContext: GlobalContextService,
  urlService: URLService,
  viewClient: ViewClientService,
  treeContentService: TreeContentService,
}
