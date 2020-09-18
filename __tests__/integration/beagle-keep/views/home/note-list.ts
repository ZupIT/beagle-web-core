import { BeagleUIElement } from 'beagle-tree/types'

const noteTemplate: BeagleUIElement = {
  _beagleComponent_: 'custom:note',
  id: 'note-list',
  text: '@{item.text}',
  labels: '@{item.labels}',
  onSelect: [
    {
      _beagleAction_: 'beagle:setContext',
      contextId: 'global',
      path: 'selectedNote',
      value: '@{item.id}',
    },
    {
      _beagleAction_: 'beagle:pushView',
      route: { url: '/details' },
    },
  ],
  onRemoveLabel: [
    {
      _beagleAction_: 'beagle:setContext',
      contextId: 'data',
      path: 'notes[@{index}]',
      value: '@{removeLabelFromNote(item, onRemoveLabel.id)}',
    },
    {
      _beagleAction_: 'beagle:sendRequest',
      url: '/note/@{item.id}',
      method: 'PUT',
      data: '@{removeLabelFromNote(item, onRemoveLabel.id)}',
      onError: [
        {
          _beagleAction_: 'custom:feedbackMessage',
          type: 'error',
          text: 'Connection error. Couldn\'t remove the label.'
        },
        {
          _beagleAction_: 'beagle:setContext',
          contextId: 'data',
          path: 'notes[@{index}]',
          value: '@{item}',
        },
      ],
    },
  ],
  onAddLabel: [
    {
      _beagleAction_: 'beagle:setContext',
      contextId: 'data',
      path: 'notes[@{index}]',
      value: '@{addLabelToNote(item, onAddLabel)}',
    },
    {
      _beagleAction_: 'beagle:sendRequest',
      url: '/note/@{item.id}',
      method: 'PUT',
      data: '@{addLabelToNote(item, onAddLabel)}',
      onError: [
        {
          _beagleAction_: 'custom:feedbackMessage',
          type: 'error',
          text: 'Connection error. Couldn\'t add the label.'
        },
        {
          _beagleAction_: 'beagle:setContext',
          contextId: 'data',
          path: 'notes[@{index}]',
          value: '@{item}',
        },
      ],
    },
  ],
  onRemoveNote: [
    {
      _beagleAction_: 'beagle:setContext',
      contextId: 'data',
      path: 'notes',
      value: '@{remove(data.notes, item)}',
    },
    {
      _beagleAction_: 'beagle:sendRequest',
      url: '/note/@{item.id}',
      method: 'DELETE',
      onSuccess: [
        {
          _beagleAction_: 'custom:feedbackMessage',
          type: 'success',
          text: 'Note removed successfully!'
        },
      ],
      onError: [
        {
          _beagleAction_: 'custom:feedbackMessage',
          type: 'error',
          text: 'Connection error. Couldn\'t remove the label.'
        },
        {
          _beagleAction_: 'beagle:setContext',
          contextId: 'data',
          path: 'notes',
          value: '@{insert(data.notes, item, index)}',
        },
      ],
    },
  ],
  style: {
    margin: {
      all: { value: 10, type: 'REAL' },
    },
  },
}

const noteList: BeagleUIElement = {
  _beagleComponent_: 'custom:repeater',
  dataSource: 'data.notes',
  key: 'id',
  template: noteTemplate,
}

export default noteList
