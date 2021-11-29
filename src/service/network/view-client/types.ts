import { RemoteView } from 'beagle-navigator/types'
import { BeagleUIElement } from 'beagle-tree/types'

export interface ViewClient {
  fetch: (route: RemoteView) => Promise<BeagleUIElement>,
}
