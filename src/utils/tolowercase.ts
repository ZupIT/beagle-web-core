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

import { ComponentName } from '../types'
import { BeagleAction } from '../actions/types'

type BeagleKeyName<Schema> = ComponentName<Schema> | BeagleAction['_beagleAction_']
type BeagleValues<Schema> = Record<BeagleKeyName<Schema>, any>

function createMapOfKeys<Schema> (values: BeagleValues<Schema>) {
  const keys = Object.keys(values)
  return keys.reduce((result, key) => ({ ...result, [key.toLowerCase()]: key }), {})
}

const getLowercaseMapOfKeys = (<Schema>() => {
  type ComponentKeyMap = Record<string, BeagleKeyName<Schema>>
  const memo: Map<BeagleValues<Schema>, ComponentKeyMap> = new Map()

  return (components: BeagleValues<Schema>) => {
    if (!memo.has(components)) memo.set(components, createMapOfKeys(components))
    return memo.get(components)
  }
})()

export const getValueByCaseInsentiveKey = <Schema> (
  values: BeagleValues<Schema>, 
  name:  BeagleKeyName<Schema>
) => {
  const lowercaseKeyMap = getLowercaseMapOfKeys(values) || {}
  const originalKey = lowercaseKeyMap[(name as string).toLowerCase()]
  return values[originalKey]
}
