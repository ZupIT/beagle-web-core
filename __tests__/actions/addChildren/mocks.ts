import { IdentifiableBeagleUIElement } from '../../../src/types'

export function createSimpleMock(): IdentifiableBeagleUIElement {
  return {
    _beagleType_: 'container',
    id: 'container',
    children: [
      {
        _beagleType_: 'container',
        id: 'content',
        children: [
          {
            _beagleType_: 'loading',
            id: 'loading',
          },
        ],
      },
      {
        _beagleType_: 'button',
        id: 'button',
        value: 'click me',
      },
    ],
  }
}
