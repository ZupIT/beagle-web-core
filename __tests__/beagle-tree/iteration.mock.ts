/*
 * Copyright 2020 ZUP IT SERVICOS EM TECNOLOGIA E INOVACAO SA
 *
 * Licensed under the Apache License, Version 2.0 (the 'License');
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an 'AS IS' BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { BeagleUIElement } from 'beagle-tree/types'

interface TreeTestMock {
  tree: BeagleUIElement<any>,
  order: BeagleUIElement<any>[],
}

export function createFormTree(): TreeTestMock {
  const zip = {
    _beagleComponent_: 'beagle:textInput',
    placeholder: 'ZIP Code',
    value: '@{address.zip}',
    onChange: [
      {
        _beagleAction_: 'beagle:setContext',
        contextId: 'address',
        path: 'zip',
        value: '@{onChange.value}'
      }
    ],
    onBlur: [
      {
        _beagleAction_: 'beagle:sendRequest',
        url: 'https://viacep.com.br/ws/@{onBlur.value}/json',
        method: 'GET',
        onSuccess: [
          {
            _beagleAction_: 'beagle:setContext',
            contextId: 'address',
            debug: true,
            value: {
              zip: '@{onBlur.value}',
              street: '@{onSuccess.data.logradouro}',
              number: '@{address.number}',
              neighborhood: '@{onSuccess.data.bairro}',
              city: '@{onSuccess.data.localidade}',
              state: '@{onSuccess.data.uf}',
              complement: '@{address.complement}'
            }
          }
        ]
      }
    ],
    style: {
      margin: {
        bottom: {
          value: 15,
          type: 'REAL'
        }
      }
    }
  }

  const street = {
    _beagleComponent_: 'beagle:textInput',
    placeholder: 'Street',
    value: '@{address.street}',
    onChange: [
      {
        _beagleAction_: 'beagle:setContext',
        contextId: 'address',
        path: 'street',
        value: '@{onChange.value}'
      }
    ],
    style: {
      margin: {
        bottom: {
          value: 15,
          type: 'REAL'
        }
      }
    }
  }

  const number = {
    _beagleComponent_: 'beagle:textInput',
    placeholder: 'Number',
    value: '@{address.number}',
    onChange: [
      {
        _beagleAction_: 'beagle:setContext',
        contextId: 'address',
        path: 'number',
        value: '@{onChange.value}'
      }
    ],
    style: {
      margin: {
        bottom: {
          value: 15,
          type: 'REAL'
        }
      }
    }
  }

  const neighborhood = {
    _beagleComponent_: 'beagle:textInput',
    placeholder: 'Neighborhood',
    value: '@{address.neighborhood}',
    onChange: [
      {
        _beagleAction_: 'beagle:setContext',
        contextId: 'address',
        path: 'neighborhood',
        value: '@{onChange.value}'
      }
    ],
    style: {
      margin: {
        bottom: {
          value: 15,
          type: 'REAL'
        }
      }
    }
  }

  const city = {
    _beagleComponent_: 'beagle:textInput',
    placeholder: 'City',
    value: '@{address.city}',
    onChange: [
      {
        _beagleAction_: 'beagle:setContext',
        contextId: 'address',
        path: 'city',
        value: '@{onChange.value}'
      }
    ],
    style: {
      margin: {
        bottom: {
          value: 15,
          type: 'REAL'
        }
      }
    }
  }

  const state = {
    _beagleComponent_: 'beagle:textInput',
    placeholder: 'State',
    value: '@{address.state}',
    onChange: [
      {
        _beagleAction_: 'beagle:setContext',
        contextId: 'address',
        path: 'state',
        value: '@{onChange.value}'
      }
    ],
    style: {
      margin: {
        bottom: {
          value: 15,
          type: 'REAL'
        }
      }
    }
  }

  const complement = {
    _beagleComponent_: 'beagle:textInput',
    placeholder: 'Complement',
    value: '@{address.complement}',
    onChange: [
      {
        _beagleAction_: 'beagle:setContext',
        contextId: 'address',
        path: 'complement',
        value: '@{onChange.value}'
      }
    ]
  }

  const fieldsContainer = {
    _beagleComponent_: 'beagle:container',
    style: {
      flex: {
        direction: 'COLUMN'
      }
    },
    children: [
      zip,
      street,
      number,
      neighborhood,
      city,
      state,
      complement,
    ]
  }

  const button = {
    _beagleComponent_: 'beagle:button',
    text: 'Send',
    onPress: [
      {
        _beagleAction_: 'beagle:submitForm'
      }
    ]
  }

  const buttonContainer = {
    _beagleComponent_: 'beagle:container',
    style: {
      marginTop: '30px'
    },
    children: [button]
  }

  const form = {
    _beagleComponent_: 'beagle:simpleform',
    context: {
      id: 'address',
      value: {
        zip: '',
        street: '',
        number: '',
        neighborhood: '',
        city: '',
        state: '',
        complement: ''
      }
    },
    onSubmit: [
      {
        _beagleAction_: 'beagle:sendRequest',
        url: 'https://beagle-interaction-poc.herokuapp.com/form',
        method: 'POST',
        data: '@{address}',
        onSuccess: [
          {
            _beagleAction_: 'beagle:alert',
            message: 'Address successfully registered.'
          }
        ],
        onError: [
          {
            _beagleAction_: 'beagle:alert',
            message: 'Sorry, a problem has happened while saving the address. Please try again later.'
          }
        ]
      }
    ],
    children: [
      fieldsContainer,
      buttonContainer,
    ]
  }

  return {
    tree: form,
    order: [
      form,
      fieldsContainer,
      zip,
      street,
      number,
      neighborhood,
      city,
      state,
      complement,
      buttonContainer,
      button,
    ]
  }
}

export function createListViewTree(): TreeTestMock {
  const text1 = {
    _beagleComponent_: 'beagle:text',
    text: 'Test 1'
  }

  const text2 = {
    _beagleComponent_: 'beagle:text',
    text: 'Test 2'
  }

  const textContainer = {
    _beagleComponent_: 'beagle:container',
    children: [text1, text2]
  }

  const listView = {
    _beagleComponent_: 'beagle:futurelistview',
    context: {
      id: 'characters',
      value: []
    },
    onInit: [
      {
        _beagleAction_: 'beagle:sendRequest',
        url: 'https://www.npoint.io/documents/40a36b479a05d8929f7a',
        onSuccess: [
          {
            _beagleAction_: 'beagle:setContext',
            value: '@{onSuccess.data.contents}'
          }
        ]
      }
    ],
    direction: 'VERTICAL',
    useParentScroll: true,
    dataSource: '@{characters}',
    template: {
      _beagleComponent_: 'beagle:container',
      style: {
        margin: {
          bottom: {
            value: 20,
            type: 'REAL'
          }
        }
      },
      children: [
        {
          _beagleComponent_: 'beagle:text',
          text: 'Name: @{item.name}'
        },
        {
          _beagleComponent_: 'beagle:text',
          text: 'Race: @{item.race}'
        },
        {
          _beagleComponent_: 'beagle:text',
          text: 'Mistborn: @{item.isMistborn}'
        },
        {
          _beagleComponent_: 'beagle:text',
          text: 'Planet: @{item.planet}'
        },
        {
          _beagleComponent_: 'beagle:text',
          text: 'sex: @{item.sex}'
        },
        {
          _beagleComponent_: 'beagle:text',
          text: 'age: @{item.age}'
        }
      ]
    }
  }

  const container = {
    _beagleComponent_: 'beagle:container',
    children: [textContainer, listView]
  }

  return {
    tree: container,
    order: [container, textContainer, text1, text2, listView]
  }
}
