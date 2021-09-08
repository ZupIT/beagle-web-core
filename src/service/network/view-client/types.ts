import { RemoteView } from 'beagle-navigator/types'
import { BeagleUIElement } from 'beagle-tree/types'
import { HttpClient } from '../types'

export interface ViewClient {
  preFetch: (httpClient: HttpClient, route: RemoteView) => void,
  fetch: (httpClient: HttpClient, route: RemoteView) => Promise<BeagleUIElement>,
}
