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

import { IdentifiableBeagleUIElement, BeagleView, DataContext } from '../types'

type HTTPMethod = 'get' | 'post' | 'put' | 'patch' | 'delete'

export interface SendRequestAction {
  _actionType_: 'sendRequest',
  url: string,
  method?: HTTPMethod,
  data?: any,
  headers?: Record<string, string>,
  onSuccess?: BeagleAction,
  onError?: BeagleAction,
  onFinish?: BeagleAction,
}

export interface SetAttributeAction {
  _actionType_: 'setAttribute',
  componentId: string,
  attributeName: string,
  attributeValue: string,
}

export interface AddChildrenAction {
  _actionType_: 'addChildren',
  componentId: string,
  value: IdentifiableBeagleUIElement[],
  mode?: 'append' | 'prepend' | 'replace',
}

export interface SetContextAction {
  _actionType_: 'setContext',
  context?: string,
  path?: string,
  value: string,
}

export interface AlertAction {
  _actionType_: 'alert',
  message: string,
  onPressOk?: BeagleAction,
}

export interface ConfirmAction {
  _actionType_: 'confirm',
  message: string,
  onPressOk?: BeagleAction,
  onPressCancel?: BeagleAction,
}

export interface CustomAction {
  _actionType_: string,
  [key: string]: any,
}

export type BeagleAction = (
  SendRequestAction
  | SetAttributeAction
  | AddChildrenAction
  | SetContextAction
  | AlertAction
  | ConfirmAction
  | CustomAction
)

export interface ActionHandlerParams<Action extends BeagleAction = any> {
  action: Action,
  eventContextHierarchy: DataContext[],
  element: IdentifiableBeagleUIElement,
  beagleView: BeagleView,
  handleAction: ActionHandler<BeagleAction>,
}

export type ActionHandler<Action extends BeagleAction = any> = (
  (params: ActionHandlerParams<Action>) => void
)
