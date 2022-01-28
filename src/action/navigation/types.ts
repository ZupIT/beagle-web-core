/*
 * Copyright 2020, 2022 ZUP IT SERVICOS EM TECNOLOGIA E INOVACAO SA
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

import { BaseAction } from 'action/types'
import { Route, NavigationContext } from 'beagle-navigator/types'

export interface OpenExternalURLAction extends BaseAction {
  _beagleAction_: 'beagle:openExternalURL',
  url: string,
}

export interface OpenNativeRouteAction extends BaseAction {
  _beagleAction_: 'beagle:openNativeRoute',
  route: string,
  data?: Record<string, any>,
}

export interface PushStackAction extends BaseAction {
  _beagleAction_: 'beagle:pushStack',
  route: Route,
  navigationContext?: NavigationContext,
}

export interface PopStackAction extends BaseAction {
  _beagleAction_: 'beagle:popStack',
  navigationContext?: NavigationContext,
}

export interface PushViewAction extends BaseAction {
  _beagleAction_: 'beagle:pushView',
  route: Route,
  controllerId?: string,
  navigationContext?: NavigationContext,
}

export interface PopViewAction extends BaseAction {
  _beagleAction_: 'beagle:popView',
  navigationContext?: NavigationContext,
}

export interface PopToViewAction extends BaseAction {
  _beagleAction_: 'beagle:popToView',
  route: string,
  navigationContext?: NavigationContext,
}

export interface ResetStackAction extends BaseAction {
  _beagleAction_: 'beagle:resetStack',
  route: Route,
  controllerId?: string,
  navigationContext?: NavigationContext,
}

export interface ResetApplicationAction extends BaseAction {
  _beagleAction_: 'beagle:resetApplication',
  route: Route,
  controllerId?: string,
  navigationContext?: NavigationContext,
}

export interface GenericNavigationAction extends BaseAction {
  _beagleAction_: string,
  route?: Route | string,
  controllerId?: string,
  url?: string,
  data?: Record<string, any>,
  navigationContext?: NavigationContext,
}

export type BeagleNavigationAction = (
  PushStackAction |
  PopStackAction |
  PushViewAction |
  PopViewAction |
  PopToViewAction |
  ResetStackAction |
  ResetApplicationAction
)
