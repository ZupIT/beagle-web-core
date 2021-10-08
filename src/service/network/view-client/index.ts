import { RemoteView } from 'beagle-navigator/types'
import { BeagleUIElement } from 'beagle-tree/types'
import logger from 'logger'
import { HttpClient } from '../types'
import { URLBuilder } from '../url-builder/types'
import { ViewClient } from './types'

function createViewClient(httpClient: HttpClient, urlBuilder: URLBuilder): ViewClient {
  const preFetched: Record<string, BeagleUIElement> = {}

  async function fetchView(route: RemoteView): Promise<BeagleUIElement> {
    const url = urlBuilder.build(route.url)
    const response = await httpClient.fetch(url, route.httpAdditionalData)
    if (!response.ok) throw new Error(`${response.status}: ${response.statusText}`)
    return await response.json()
  }

  return {
    prefetch: async (route) => {
      try {
        preFetched[route.url] = await fetchView(route)
      } catch (error) {
        logger.error(`Error while pre-fetching view: ${route.url}`, error)
      }
    },
    fetch: async (route) => {
      if (preFetched[route.url]) {
        const result = preFetched[route.url]
        delete preFetched[route.url]
        return result
      }
      return await fetchView(route)
    },
  }
}

export default {
  create: createViewClient,
}
