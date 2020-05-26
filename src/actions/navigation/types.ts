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

import { BeagleUIElement } from '../..'

export interface OpenExternalURLAction {
  _beagleAction_: 'openExternalURL',
  url: string,
}

export interface OpenNativeRouteAction {
  _beagleAction_: 'openNativeRoute',
  route: string,
  data?: Record<string, any>,
}

export interface RemoteView {
  url: string,
  fallback?: BeagleUIElement,
  shouldPrefetch?: boolean,
}

export interface LocalView {
  screen: BeagleUIElement,
}

export type Route = LocalView | RemoteView

export interface PushStackAction {
  _beagleAction_: 'pushStack',
  route: Route,
}

export interface PopStackAction {
  _beagleAction_: 'popStack',
}

export interface PushViewAction {
  _beagleAction_: 'pushView',
  route: Route,
}

export interface PopViewAction {
  _beagleAction_: 'popView',
}

export interface PopToViewAction {
  _beagleAction_: 'popToView',
  route: Route,
}

export interface ResetStackAction {
  _beagleAction_: 'resetStack',
  route: Route,
}

export interface ResetApplicationAction {
  _beagleAction_: 'resetApplication',
  route: Route,
}

export type BeagleNavigationAction =
  PushStackAction |
  PopStackAction |
  PushViewAction |
  PopViewAction |
  PopToViewAction |
  ResetStackAction |
  ResetApplicationAction
