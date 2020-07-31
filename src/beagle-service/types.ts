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

export type Lifecycle = 'beforeStart' | 'beforeViewSnapshot' | 'afterViewSnapshot' | 'beforeRender'

export type LifecycleHook = (viewTree: Record<string, any>) => void | Record<string, any>

export type LifecycleHookMap = Record<Lifecycle, {
  global?: (tree: any) => any,
  components: Record<string, LifecycleHook>,
}>

export interface BeagleConfig<Schema> {
  baseUrl: string,
  schemaUrl?: string,
  /**
   * @deprecated Since version 1.2. Will be deleted in version 2.0. Use lifecycles instead.
   */
  middlewares?: Array<BeagleMiddleware<Schema>>,
  strategy?: Strategy,
  fetchData?: typeof fetch,
  analytics?: Analytics,
  components: {
    [K in ComponentName<Schema>]: any
  },
  customActions?: Record<string, ActionHandler>,
  lifecycles?: Partial<Record<Lifecycle, (viewTree: Record<string, any>) => void>>,
  customStorage?: Storage,
  useBeagleHeaders?: boolean,
}
