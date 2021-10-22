import { RemoteView } from 'beagle-navigator/types'
import { BeagleUIElement } from 'beagle-tree/types'

export interface ViewClient {
  prefetch: (route: RemoteView) => void,
  fetch: (route: RemoteView) => Promise<BeagleUIElement>,
}
