import { BeagleUIElement, IdentifiableBeagleUIElement } from '../../src/types'

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

export function createSocialMediaMock(): IdentifiableBeagleUIElement {
  const data = createSocialMediaData()
  return {
    _beagleComponent_: 'container',
    id: 'container1',
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
        id: 'container2',
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
            id: 'container3',
            context: {
              id: 'isModalOpen',
              value: false,
            },
            children: [
              {
                _beagleComponent_: 'button',
                id: 'btn1',
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
        id: 'container4',
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

export function createMockWithSameIdContexts(): IdentifiableBeagleUIElement {
  return {
    _beagleComponent_: 'container',
    id: 'container1',
    context: { id: 'ctx', value: 'jest-1' },
    children: [
      {
        _beagleComponent_: 'container',
        id: 'container2',
        context: { id: 'ctx', value: 'jest-2' },
        children: [
          {
            _beagleComponent_: 'text',
            id: 'text',
            value: '@{ctx}',
          },
        ],
      },
    ],
  }
}