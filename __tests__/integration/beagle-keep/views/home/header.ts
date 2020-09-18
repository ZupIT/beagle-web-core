import { BeagleUIElement } from 'beagle-tree/types'

const header: BeagleUIElement = {
  _beagleComponent_: 'beagle:container',
  style: {
    margin: {
      bottom: { value: 10, type: 'REAL' },
    },
    flex: {
      flexDirection: 'ROW',
      justifyContent: 'SPACE-BETWEEN',
    },
  },
  children: [
    {
      _beagleComponent_: 'beagle:image',
      path: {
        _beagleImagePath_: 'local',
        url: '/assets/logo',
      },
    },
    {
      _beagleComponent_: 'beagle:image',
      path: {
        _beagleImagePath_: 'remote',
        url: 'https://www.test.com/profile/picture.png',
      },
    },
  ]
}

export default header
