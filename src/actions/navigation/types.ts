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

export interface OpenExternalURLAction {
  _actionType_: 'openExternalURL',
  url: string,
}

export interface OpenNativeRouteAction {
  _actionType_: 'openNativeRoute',
  route: string,
  data?: Record<string, any>,
}

export type BeagleNavigationAction =
  PushStackAction |
  PopStackAction |
  PushViewAction |
  PopViewAction |
  PopToViewAction |
  ResetStackAction |
  ResetApplicationAction

export interface PushStackAction {
  _actionType_: 'pushStack',
  route: string,
}

export interface PopStackAction {
  _actionType_: 'popStack',
}

export interface PushViewAction {
  _actionType_: 'pushView',
  route: string,
}

export interface PopViewAction {
  _actionType_: 'popView',
}

export interface PopToViewAction {
  _actionType_: 'popToView',
  route: string,
}

export interface ResetStackAction {
  _actionType_: 'resetStack',
  route: string,
}

export interface ResetApplicationAction {
  _actionType_: 'resetApplication',
  route: string,
}
