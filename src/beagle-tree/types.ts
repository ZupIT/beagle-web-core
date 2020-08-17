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

export type DefaultSchema = Record<string, Record<string, any>>

export type ComponentName<Schema> = keyof Schema | 'custom:error' | 'custom:loading'

export type TreeInsertionMode = 'prepend' | 'append' | 'replace'

export type TreeUpdateMode = TreeInsertionMode | 'replaceComponent'

export type Style = Record<string, any>

export interface ErrorComponentParams {
  retry: () => void,
  errors: string[],
}

export interface DataContext {
  id: string,
  value?: any,
}

export interface BeagleUIElement<Schema = DefaultSchema> {
  _beagleComponent_: ComponentName<Schema>,
  context?: DataContext,
  _implicitContexts_?: DataContext[],
  children?: Array<BeagleUIElement<Schema>>,
  style?: Style,
  [key: string]: any,
}

export interface IdentifiableBeagleUIElement<Schema = DefaultSchema>
  extends BeagleUIElement<Schema> {
  id: string,
  children?: Array<IdentifiableBeagleUIElement<Schema>>,
}
