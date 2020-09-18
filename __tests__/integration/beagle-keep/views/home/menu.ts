import { BeagleUIElement } from 'beagle-tree/types'
import { BeagleAction } from 'action/types'

export interface MenuItem {
  icon: string,
  label: string,
  onPress: BeagleAction[],
}

function createMenu(items: MenuItem[]): BeagleUIElement {
  return {
    _beagleComponent_: 'custom:menu',
    id: 'menu',
    context: {
      id: 'menu',
      value: {
        items,
        active: 'Notes'
      },
    },
    items: '@{union(menu.items, labelsToMenuItems(labels))}',
    active: '@{menu.active}',
    style: {
      margin: {
        right: { value: 20, type: 'REAL' },
      },
    },
  }
}

export default createMenu([
  {
    icon: 'light-bulb',
    label: 'Notes',
    onPress: [
      {
        _beagleAction_: 'beagle:setContext',
        contextId: 'menu',
        path: 'active',
        value: 'Notes',
      },
      {
        _beagleAction_: 'beagle:setContext',
        contextId: 'filteredLabel',
        value: null,
      },
    ],
  },
  {
    icon: 'pencil',
    label: 'Edit labels',
    onPress: [
      {
        _beagleAction_: 'beagle:pushView',
        route: {
          url: '/labels'
        }
      },
    ],
  }
])
