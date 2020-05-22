import { IdentifiableBeagleUIElement } from '../../src/types'

export function createContainerWithAction(
  eventName: string,
  action?: any
): IdentifiableBeagleUIElement {
  return {
    _beagleType_: 'container',
    id: 'container',
    [eventName]: action || {
      _beagleAction_: 'alert',
      message: 'test message',
    },
  }
}

export function createModalMock(): IdentifiableBeagleUIElement {
  return {
    _beagleType_: 'container',
    id: 'container',
    _context_: {
      id: 'isModalOpen',
      value: false,
    },
    children: [
      {
        _beagleType_: 'button',
        id: 'btn-open-modal',
        onPress: {
          _beagleAction_: 'setContext',
          value: true,
        }
      },
      {
        _beagleType_: 'modal',
        id: 'modal',
        isOpen: '${isModalOpen}',
        title: 'My Modal',
        onClose: [
          {
            _beagleAction_: 'setContext',
            value: false,
          },
          {
            _beagleAction_: 'alert',
            message: 'modal has been closed!',
          },
        ],
        children: [
          {
            _beagleType_: 'container',
            id: 'modal-content',
            onInit: {
              _beagleAction_: 'sendRequest',
              componentId: 'modal',
              url: '/modalContent',
              onSuccess: {
                _beagleAction_: 'addChildren',
                mode: 'replace',
                value: '${onSuccess.data}',
              },
              onError: {
                _beagleAction_: 'showErrorMessage',
                text: 'An unexpected error ocurred!',
              },
            },
            children: [
              {
                _beagleType_: 'loading',
                id: 'loading',
              },
            ],
          },
        ],
      },
    ],
  }
}
