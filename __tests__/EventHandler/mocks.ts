import { IdentifiableBeagleUIElement } from '../../src/types'

export function createContainerWithAction(
  eventName: string,
  action?: any
): IdentifiableBeagleUIElement {
  return {
    _beagleComponent_: 'container',
    id: 'container',
    [eventName]: action || {
      _beagleAction_: 'beagle:alert',
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
          _beagleAction_: 'beagle:setContext',
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
            _beagleAction_: 'beagle:setContext',
            value: false,
          },
          {
            _beagleAction_: 'beagle:alert',
            message: 'modal has been closed!',
          },
        ],
        children: [
          {
            _beagleComponent_: 'container',
            id: 'modal-content',
            onInit: {
              _beagleAction_: 'beagle:sendRequest',
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
                _beagleComponent_: 'custom:loading',
                id: 'loading',
              },
            ],
          },
        ],
      },
    ],
  }
}
