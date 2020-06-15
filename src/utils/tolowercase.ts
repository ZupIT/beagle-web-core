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
  console.log(lowercaseKeyMap)
  console.log(name)
  const originalKey = lowercaseKeyMap[(name as string).toLowerCase()]
  return values[originalKey]
}
