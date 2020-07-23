import { BeagleUIElement } from '../../src/types'

export function createPerson() {
  return {
    name: { first: 'Jest', last: 'Oliveira' },
    age: 50,
    phones: ['3455558888', '349885421'],
    isMale: true,
    documents: [
      {
        name: 'rg',
        value: 'MG14235788',
      },
      {
        name: 'cpf',
        value: '012.345.678-90',
      },
    ],
  }
}

export function createSocialMediaData() {
  return {
    user: {
      id: '007',
      name: 'James Bond',
      birthDate: '1963/09/07',
      picture: '/assets/bond.png',
    },
    friends: [
      { name: 'Honey Ryder', id: '008' },
      { name: 'Felix Leiter', id: '009' },
      { name: 'Miss Taro', id: '010' },
    ],
    posts: [
      { id: 'p1', author: 'Honey Ryder', text: 'Hello everybody!' },
      { id: 'p2', author: 'Honey Ryder', text: 'Beagle Rocks!' },
      { id: 'p3', author: 'Miss Taro', text: 'Hello everybody!' },
    ],
  }
}

export function createSocialMediaMock(): BeagleUIElement {
  const data = createSocialMediaData()
  return {
    _beagleComponent_: 'container',
    context: {
      id: 'user',
      value: data.user,
    },
    children: [
      {
        _beagleComponent_: 'profile-card',
        id: 'profile',
        name: '@{user.name}',
        picture: '@{user.picture}',
        detailsPath: '/users/@{user.id}',
      },
      {
        _beagleComponent_: 'container',
        context: {
          id: 'friends',
          value: data.friends,
        },
        children: [
          {
            _beagleComponent_: 'text',
            id: 'friendsTitle',
            value: '@{user.name}\'s friends:',
          },
          {
            _beagleComponent_: 'friends-panel',
            id: 'friendsPanel',
            friendList: '@{friends}',
          },
          {
            _beagleComponent_: 'container',
            context: {
              id: 'isModalOpen',
              value: false,
            },
            children: [
              {
                _beagleComponent_: 'button',
                onPress: {
                  _beagleAction_: 'beagle:setContext',
                  value: true,
                },
              },
              {
                _beagleComponent_: 'modal',
                id: 'friendDetailsModal',
                isOpen: '@{isModalOpen}',
              }
            ],
          }
        ],
      },
      {
        _beagleComponent_: 'container',
        context: {
          id: 'posts',
          value: data.posts,
        },
        children: [
          {
            _beagleComponent_: 'post',
            id: 'firstPost',
            author: '@{posts[0].author}',
            text: '@{posts[0].text}',
          },
          {
            _beagleComponent_: 'post',
            id: 'secondPost',
            author: '@{posts[1].author}',
            text: '@{posts[1].text}',
          },
          {
            _beagleComponent_: 'post',
            id: 'thirdPost',
            author: '@{posts[2].author}',
            text: '@{posts[2].text}',
          },
          {
            _beagleComponent_: 'post',
            id: 'postWithWrongContext',
            author: '@{friends[0].name}',
            text: 'My new post',
          },
        ],
      },
    ],
  }
}

export function createMockWithSameIdContexts(): BeagleUIElement {
  return {
    _beagleComponent_: 'container',
    context: { id: 'ctx', value: 'jest-1' },
    children: [
      {
        _beagleComponent_: 'container',
        context: { id: 'ctx', value: 'jest-2' },
        children: [
          {
            _beagleComponent_: 'text',
            value: '@{ctx}',
          },
        ],
      },
    ],
  }
}

export const treeWithGlobalContext = {
  "context": {
    "id": "global",
    "value": {
      "text": "testing value of context with global id"
    }
  },
  "_beagleComponent_":"beagle:container",
  "children":[
    {
      "_beagleComponent_":"beagle:container",
      "children":[
        {
          "_beagleComponent_":"beagle:text1",
          "text":"@{global.text}"
        },
        {
          "_beagleComponent_":"beagle:text2",
          "text":"@{global.obj.inner.text}"
        }
      ]
    }
  ]
}

export const treeWithValidContext = {
  "context": {
    "id": "contextId",
    "value": {
      "text": "teste"
    }
  },
  "_beagleComponent_":"beagle:container",
  "children":[
    {
      "_beagleComponent_":"beagle:container",
      "children":[
        {
          
          "_beagleComponent_":"beagle:text",
          "text":"@{contextId.text}"
        },
        {
          "_beagleComponent_":"beagle:text",
          "text":"@{global.obj.inner.text}"
        }
      ]
    },
    {
      "_beagleComponent_":"beagle:container",
      "children":[
        {
          "_beagleComponent_":"beagle:text",
          "text":"Hello @{global.user.name}, your current balance is @{global.user.balance}."
        },
        {
          "_beagleComponent_":"beagle:button",
          "text":"Testing set global context",
          "onPress":[
            {
              "_beagleAction_":"beagle:setContext",
              "contextId":"global",
              "path":"user.balance",
              "value":97.87
            }
          ]
        }
      ]
    }
  ]
}