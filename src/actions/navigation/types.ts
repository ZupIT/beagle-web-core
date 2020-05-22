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
  _beagleAction_: 'openExternalURL',
  url: string,
}

export interface OpenNativeRouteAction {
  _beagleAction_: 'openNativeRoute',
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
  _beagleAction_: 'pushStack',
  route: string,
}

export interface PopStackAction {
  _beagleAction_: 'popStack',
}

export interface PushViewAction {
  _beagleAction_: 'pushView',
  route: string,
}

export interface PopViewAction {
  _beagleAction_: 'popView',
}

export interface PopToViewAction {
  _beagleAction_: 'popToView',
  route: string,
}

export interface ResetStackAction {
  _beagleAction_: 'resetStack',
  route: string,
}

export interface ResetApplicationAction {
  _beagleAction_: 'resetApplication',
  route: string,
}
