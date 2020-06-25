import { IdentifiableBeagleUIElement } from '../../../src/types'

export function createSingleContextMock(
  ctxId = 'ctx_a',
  btnId = 'button',
): IdentifiableBeagleUIElement {
  return {
    _beagleComponent_: 'container_@{ctxId}',
    id: 'container',
    context: {
      id: ctxId,
      value: `value of ${ctxId}`,
    },
    children: [
      {
        _beagleComponent_: 'button',
        id: btnId,
        value: `@{${ctxId}}`,
      },
    ],
  }
}

export function createDoubleContextMock(): IdentifiableBeagleUIElement {
  const mock = createSingleContextMock()
  mock.children = [createSingleContextMock('ctx_b')]
  return mock
}

export function createMockWithDistantContext(): IdentifiableBeagleUIElement {
  return {
    _beagleComponent_: 'container',
    id: 'containerA',
    context: {
      id: 'ctx_a',
      value: 'value of ctx_a',
    },
    children: [
      {
        _beagleComponent_: 'container',
        id: 'containerB',
        children: [
          {
            _beagleComponent_: 'container',
            id: 'containerC',
            children: [
              {
                _beagleComponent_: 'container',
                id: 'containerD',
                children: [
                  {
                    _beagleComponent_: 'button',
                    id: 'button',
                    value: '@{ctx_a}',
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  }
}

export function createSameLevelContextMock(
  value: any = 'value of ctx_a',
): IdentifiableBeagleUIElement {
  return {
    _beagleComponent_: 'text',
    id: 'text',
    context: {
      id: 'ctx_a',
      value,
    },
    value: '@{ctx_a}',
  }
}

export function createMultipleScopesMock() {
  return {
    _beagleComponent_: 'container',
    id: 'container',
    children: [
      createSingleContextMock('ctx_a', 'btn_a'),
      createSingleContextMock('ctx_b', 'btn_b'),
    ],
  }
}
