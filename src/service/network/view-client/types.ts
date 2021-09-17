import { RemoteView } from 'beagle-navigator/types'
import { BeagleUIElement } from 'beagle-tree/types'

export interface ViewClient {
  preFetch: (route: RemoteView) => void,
  fetch: (route: RemoteView) => Promise<BeagleUIElement>,
}
