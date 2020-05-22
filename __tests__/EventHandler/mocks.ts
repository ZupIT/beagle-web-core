import { IdentifiableBeagleUIElement } from '../../src/types'

export function createContainerWithAction(
  eventName: string,
  action?: any
): IdentifiableBeagleUIElement {
  return {
    _beagleComponent_: 'container',
    id: 'container',
    [eventName]: action || {
      _actionType_: 'alert',
      message: 'test message',
    },
  }
}

export function createModalMock(): IdentifiableBeagleUIElement {
  return {
    _beagleComponent_: 'container',
    id: 'container',
    _context_: {
      id: 'isModalOpen',
      value: false,
    },
    children: [
      {
        _beagleComponent_: 'button',
        id: 'btn-open-modal',
        onPress: {
          _actionType_: 'setContext',
          value: true,
        }
      },
      {
        _beagleComponent_: 'modal',
        id: 'modal',
        isOpen: '${isModalOpen}',
        title: 'My Modal',
        onClose: [
          {
            _actionType_: 'setContext',
            value: false,
          },
          {
            _actionType_: 'alert',
            message: 'modal has been closed!',
          },
        ],
        children: [
          {
            _beagleComponent_: 'container',
            id: 'modal-content',
            onInit: {
              _actionType_: 'sendRequest',
              componentId: 'modal',
              url: '/modalContent',
              onSuccess: {
                _actionType_: 'addChildren',
                mode: 'replace',
                value: '${onSuccess.data}',
              },
              onError: {
                _actionType_: 'showErrorMessage',
                text: 'An unexpected error ocurred!',
              },
            },
            children: [
              {
                _beagleComponent_: 'loading',
                id: 'loading',
              },
            ],
          },
        ],
      },
    ],
  }
}
