import { IdentifiableBeagleUIElement, DataContext, BeagleView } from '../types'
import { BeagleAction, ActionHandler } from '../actions/types'
import Expression from './Expression'

const IGNORE = ['id', 'context', 'children', '_beagleComponent_']

interface Parameters {
  component: IdentifiableBeagleUIElement,
  contextHierarchy: DataContext[],
  beagleView: BeagleView,
  actionHandlers: Record<string, ActionHandler>,
}

type ActionOrActionList = BeagleAction | BeagleAction[]

function isBeagleAction(data: any) {
  return (
    data
    && typeof data === 'object'
    && (data._beagleAction_ || (Array.isArray(data) && data[0]._beagleAction_))
  )
}

function deserializeAction(
  actionOrActionList: ActionOrActionList,
  eventName: string,
  params: Parameters,
) {
  const actionList = Array.isArray(actionOrActionList) ? actionOrActionList : [actionOrActionList]

  return function (event: any) {
    const hierarchy = event 
      ? [...params.contextHierarchy, { id: eventName, value: event }]
      : params.contextHierarchy

    // function used to deserialize and execute actions inside another action
    const executeSubAction = (
      actionOrActionList: ActionOrActionList,
      eventName = '',
      event?: any,
    ) => {
      deserializeAction(
        actionOrActionList,
        eventName,
        { ...params, contextHierarchy: hierarchy },
      )(event)
    }

    actionList.forEach((action) => {
      const handler = params.actionHandlers[action._beagleAction_]

      if (!handler) {
        console.warn(`Beagle: couldn't find an action handler for "${action._beagleAction_}"`)
        return
      }

      const isSubAction = (data: any) => (
        data !== action && isBeagleAction(data)
      )
    
      handler({
        action: Expression.resolve(action, hierarchy, isSubAction),
        beagleView: params.beagleView,
        element: params.component,
        executeAction: executeSubAction,
      })
    })
  }
}

function findAndDeserializeActions(data: any, propertyName: string, params: Parameters): any {
  if (isBeagleAction(data)) return deserializeAction(data, propertyName, params)

  if (Array.isArray(data)) {
    return data.map(item => findAndDeserializeActions(item, propertyName, params))
  }

  if (data && typeof data === 'object') {
    const keys = Object.keys(data)
    keys.forEach(key => data[key] = findAndDeserializeActions(data[key], key, params))
  }

  return data
}

/**
 * De-serializes every Beagle Action in the component into a function. If any expression is used
 * inside the Beagle Action, `params.contextHierarchy` will be used as the data source to retrieve
 * the expressions values.
 * 
 * Actions that are properties of another action are not deserialized by this function. This
 * function only de-serializes actions that are part of the component interface. The responsibility
 * to de-serialize an action inside another action is of the action handler. See the example below:
 * 
 * ```json
 * {
 *   "_beagleComponent_": "beagle:button",
 *   "text": "click to send request",
 *   "onPress": {
 *     "_beagleAction_": "beagle:sendRequest",
 *     "url": "https://docs.usebeagle.com",
 *     "onSuccess": {
 *       "_beagleAction_": "beagle:alert",
 *       "message": "Successfully recovered the docs!"
 *     }
 *   }
 * }
 * ```
 * 
 * In the example above, "onPress" is deserialized when running this function, but "onSuccess" is
 * not. The action handler for the action "beagle:sendRequest" is the one responsible for
 * deserializing "onSuccess".
 * 
 * This function alters `params.component`, i.e. this is not a pure function.
 * 
 * @param params set of parameters to perform the de-serialization. The key-value map must contain
 * the following:
 * - `component`: the component whose actions must be deserialized.
 * - `contextHierarchy`: context hierarchy to use for expressions inside a Beagle Action.
 * - `beagleView`: the current BeagleView, needed to perform view updates on certain actions.
 * - `actionHandlers`: map relating each beagle action identifier to an action handler.
 */
function deserialize(params: Parameters) {
  const keys = Object.keys(params.component)
  keys.forEach((key) => {
    if (IGNORE.includes(key)) return
    params.component[key] = findAndDeserializeActions(params.component[key], '', params)
  })
}

export default {
  deserialize,
}
