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

import { ActionHandler, CustomAction } from './actions/types'
import createEventHandler, { EventHandler } from './EventHandler'
import { replaceBindings } from './bindings'
import createBeagleUIView from './BeagleUIView'
import BeagleContext from './BeagleContext'
import createXMLConverter from './XMLConverter'
import { loadFromCache, loadFromServer } from './utils/tree-fetching'
import {
  DefaultSchema,
  BeagleConfig,
  LoadParams,
  BeagleUIElement,
  IdentifiableBeagleUIElement,
  BeagleUIService,
  XmlOptions,
  HttpMethod,
  BeagleMiddleware,
  BeagleView,
  Strategy,
} from './types'
import { convertComponentsToCustom } from './utils/tree-manipulation'

function createBeagleUIService<
  Schema = DefaultSchema,
  ConfigType extends BeagleConfig<Schema> = BeagleConfig<Schema>
> (config: ConfigType): BeagleUIService<Schema, ConfigType> {

  config.components = convertComponentsToCustom(config.components)

  const xmlConverter = createXMLConverter(config.components)

  return {
    loadBeagleUITreeFromServer: loadFromServer,
    loadBeagleUITreeFromCache: loadFromCache,
    convertBeagleUiTreeToXml: xmlConverter.convertBeagleUiTreeToXml,
    createView: (initialRoute: string) => createBeagleUIView<Schema>(config, initialRoute),
    getConfig: () => config,
  }
}

export default createBeagleUIService

export {
  DefaultSchema,
  BeagleConfig,
  LoadParams,
  BeagleUIElement,
  IdentifiableBeagleUIElement,
  BeagleUIService,
  XmlOptions,
  HttpMethod,
  BeagleMiddleware,
  BeagleView,
  Strategy,
  BeagleContext,
  ActionHandler,
  CustomAction,
  createEventHandler,
  EventHandler,
  replaceBindings,
  convertComponentsToCustom
}
