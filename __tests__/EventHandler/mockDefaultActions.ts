import * as actions from '../../src/actions'

const original = actions.default

function mockDefaultActions() {
  const keys = Object.keys(original)
  const mocked = keys.reduce((result, key) => {
    return { ...result, [key]: jest.fn() }
  }, {})
  // @ts-ignore
  actions.default = mocked
}

export function unmockDefaultActions() {
  // @ts-ignore
  actions.default = original
}

mockDefaultActions()
