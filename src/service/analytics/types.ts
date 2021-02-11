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

import { BeagleAction } from 'action/types'
import { IdentifiableBeagleUIElement } from 'beagle-tree/types'
import { LocalView, RemoteView, Route } from 'beagle-view/navigator/types'

export interface AnalyticsConfig {
  /**
   * Default is `true`, when false no analytics will be generated by this system when a screen is
   * loaded.
   */
  enableScreenAnalytics?: boolean,
  /**
   * A map of actions allowed to create analytics records. By default no action creates records.
   * 
   * In this map, each key is a `_beagleAction_`, while the values are array of strings. The value
   * indicates which properties of the action will compose the analytics record. By default, only
   * the `_beagleAction_` is sent as part of the record. If we want to send for instance, the url and
   * method of every "beagle:sendRequest", we must create the entry
   * `{ 'beagle:sendRequest': ['url', 'method'] }`.
   */
  actions: Record<string, string[]>,
}

export interface AnalyticsRecord {
  type: string,
  platform: string,
  [key: string]: any,
  timestamp: number,
}

export interface AnalyticsProvider {
   /**
   * Beagle uses this configuration to know how to handle analytics events. In order to access the
   * most updated global analytics config, this method is called whenever an event is triggered. It
   * can return an `AnalyticsConfig` or `null`. When `null`, the record is temporarily stored in a
   * queue. The enqueued records are processed when `getConfig()` returns a value different than
   * null.
   * 
   * @return an AnalyticsConfig or null
   */
  getConfig: () => (AnalyticsConfig),
  
   /** 
   * This function will be called every time Beagle needs to create a record. If you don't want
   * to send one request for each analytics generated by Beagle, it is a good idea to implement a
   * batch mechanism within this function.
   * 
   * @param record the record to create
   */
  createRecord: (record: AnalyticsRecord) => void,
}

export interface ActionAnalyticsConfig {
  /**
   * The analytics record will expose all attributes of the action present in this array, no
   * matter what `analyticsProvider.getConfig()` says.
   */
  attributes?: string[],
  /**
   * Specifies additional data to be sent in the analytics record.
   */
  additionalEntries?: Record<string, any>,
}

export interface ScreenRecordParams {
  route: LocalView | RemoteView,
  platform?: string,
}

export interface ActionRecordParams {
  action: BeagleAction,
  eventName: string,
  component: IdentifiableBeagleUIElement,
  platform?: string,
  route: Route,
}

export interface AnalyticsService {
  /**
   * Creates a screen record with the given parameters
   * @param params an object of type ScreenRecordParams
   */
  createScreenRecord: (params: ScreenRecordParams) => Promise<void>,

  /**
   * Creates an action record with the given parameters
   * @param params an object of type ActionRecordParams
   */
  createActionRecord: (params: ActionRecordParams) => Promise<void>,
}
