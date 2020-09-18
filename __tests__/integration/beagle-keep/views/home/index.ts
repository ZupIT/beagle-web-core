import { BeagleUIElement } from 'beagle-tree/types'
import { getNotes } from '../../database/notes'
import { getLabels } from '../../database/labels'
import header from './header'
import menu from './menu'
import noteList from './note-list'

const home: BeagleUIElement = {
  _beagleComponent_: 'beagle:container',
  context: {
    id: 'data',
    value: {
      notes: getNotes(),
      labels: getLabels(),
    },
  },
  children: [
    header,
    {
      _beagleComponent_: 'beagle:component',
      style: {
        flex: {
          flexDirection: 'ROW',
          flex: 1,
        },
      },
      children: [
        menu,
        noteList,
      ],
    },
    {
      _beagleComponent_: 'beagle:button',
      id: 'create-note',
      text: 'Create note',
      onPress: [
        {
          _beagleAction_: 'beagle:setContext',
          contextId: 'global',
          path: 'selectedNote',
          value: null,
        },
        {
          _beagleAction_: 'beagle:pushView',
          route: { url: '/details' },
        },
      ],
      style: {
        positionType: 'ABSOLUTE',
        position: {
          bottom: { value: 20, type: 'REAL' },
          right: { value: 20, type: 'REAL' },
        },
      },
    },
  ],
}

export default home
