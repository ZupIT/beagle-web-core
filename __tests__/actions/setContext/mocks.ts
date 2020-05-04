import { IdentifiableBeagleUIElement } from '../../../src/types'

export function createSingleContextMock(
  ctxId = 'ctx_a',
  btnId = 'button',
): IdentifiableBeagleUIElement {
  return {
    _beagleType_: 'container_${ctxId}',
    id: 'container',
    _context_: {
      id: ctxId,
      value: `value of ${ctxId}`,
    },
    children: [
      {
        _beagleType_: 'button',
        id: btnId,
        value: `\${${ctxId}}`,
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
    _beagleType_: 'container',
    id: 'containerA',
    _context_: {
      id: 'ctx_a',
      value: 'value of ctx_a',
    },
    children: [
      {
        _beagleType_: 'container',
        id: 'containerB',
        children: [
          {
            _beagleType_: 'container',
            id: 'containerC',
            children: [
              {
                _beagleType_: 'container',
                id: 'containerD',
                children: [
                  {
                    _beagleType_: 'button',
                    id: 'button',
                    value: '${ctx_a}',
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
    _beagleType_: 'text',
    id: 'text',
    _context_: {
      id: 'ctx_a',
      value,
    },
    value: '${ctx_a}',
  }
}

export function createMultipleScopesMock() {
  return {
    _beagleType_: 'container',
    id: 'container',
    children: [
      createSingleContextMock('ctx_a', 'btn_a'),
      createSingleContextMock('ctx_b', 'btn_b'),
    ],
  }
}
