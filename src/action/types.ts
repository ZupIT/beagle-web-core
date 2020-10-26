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

import { IdentifiableBeagleUIElement } from 'beagle-tree/types'
import { BeagleView } from 'beagle-view/types'
import { HttpMethod } from 'service/network/types'
import { BeagleNavigationAction } from './navigation/types'

export interface SendRequestAction {
  _beagleAction_: 'beagle:sendRequest',
  url: string,
  method?: HttpMethod,
  data?: any,
  headers?: Record<string, string>,
  onSuccess?: BeagleAction | BeagleAction[],
  onError?: BeagleAction | BeagleAction[],
  onFinish?: BeagleAction | BeagleAction[],
}

export interface AddChildrenAction {
  _beagleAction_: 'beagle:addChildren',
  componentId: string,
  value: IdentifiableBeagleUIElement[],
  mode?: 'append' | 'prepend' | 'replace',
}

export interface SetContextAction {
  _beagleAction_: 'beagle:setContext',
  contextId?: string,
  path?: string,
  value: any,
}

export interface AlertAction {
  _beagleAction_: 'beagle:alert',
  message: string | Record<any, any>,
  onPressOk?: BeagleAction | BeagleAction[],
}

export interface ConfirmAction {
  _beagleAction_: 'beagle:confirm',
  message: string,
  onPressOk?: BeagleAction | BeagleAction[],
  onPressCancel?: BeagleAction | BeagleAction[],
}

export interface SubmitFormAction {
  _beagleAction_: 'beagle:submitForm',
}

export interface ConditionAction {
  _beagleAction_: 'beagle:condition',
  condition: boolean,
  onTrue?: BeagleAction | BeagleAction[],
  onFalse?: BeagleAction | BeagleAction[],
}

export interface CustomAction {
  _beagleAction_: string,
  [key: string]: any,
}

export type BeagleDefaultAction = (
  SendRequestAction
  | AddChildrenAction
  | SetContextAction
  | AlertAction
  | ConfirmAction
  | BeagleNavigationAction
  | SubmitFormAction
  | ConditionAction
)

export type BeagleAction = BeagleDefaultAction | CustomAction

export interface ActionHandlerParams<Action extends BeagleAction = any> {
  action: Action,
  element: IdentifiableBeagleUIElement,
  beagleView: BeagleView,
  executeAction: (
    actionOrActionList: BeagleAction | BeagleAction[],
    eventName?: string,
    event?: any,
  ) => void,
}

export type ActionHandler<Action extends BeagleAction = any> = (
  (params: ActionHandlerParams<Action>) => void | Promise<void>
)
