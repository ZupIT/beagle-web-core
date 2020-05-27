import { IdentifiableBeagleUIElement } from '../../../src/types'

export function createSimpleMock(): IdentifiableBeagleUIElement {
  return {
   _beagleComponent_: 'container',
    id: 'container',
    children: [
      {
        _beagleComponent_: 'container',
        id: 'content',
        children: [
          {
            _beagleComponent_: 'custom:loading',
            id: 'loading',
          },
        ],
      },
      {
        _beagleComponent_: 'button',
        id: 'button',
        value: 'click me',
      },
    ],
  }
}
