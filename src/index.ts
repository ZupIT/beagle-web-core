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

// beagle utilities
import Tree from 'beagle-tree'

export { Tree }

// general utilities
import ObjectUtils from 'utils/object'
import StringUtils from 'utils/string'
import UrlUtils from 'utils/url'
import Automaton from 'utils/automaton'

export { ObjectUtils, StringUtils, UrlUtils, Automaton }

// errors
import BeagleError from 'error/BeagleError'
import BeagleNetworkError from 'service/network/error/BeagleNetworkError'
import BeagleCacheError from 'service/network/error/BeagleCacheError'
import BeagleExpiredCacheError from 'service/network/error/BeagleExpiredCacheError'

export { BeagleError, BeagleNetworkError, BeagleCacheError, BeagleExpiredCacheError }

// service types

import { BeagleView } from 'beagle-view'
import { GlobalContext } from 'service/global-context'
import { TreeContentMapper, BeagleTreeContent } from 'service/tree-content'
import { DefaultHeaders } from 'service/network/default-headers'
import { RemoteCache } from 'service/network/remote-cache'
import { URLBuilder } from 'service/network/url-builder'
import { ViewClient } from 'service/network/view-client'

export {
  BeagleView,
  GlobalContext,
  TreeContentMapper,
  BeagleTreeContent,
  DefaultHeaders,
  RemoteCache,
  URLBuilder,
  ViewClient,
}

// general types

export * from 'action/types'
export * from 'action/navigation/types'
export * from 'beagle-tree/types'
export * from 'beagle-view/types'
export * from 'metadata/types'
export * from 'service/beagle-service/types'
export * from 'service/network/types'

// beagle service: default exportation

import BeagleService from 'service/beagle-service'

export default BeagleService.create
