import { RemoteView } from 'beagle-navigator/types'
import { BeagleUIElement } from 'index'
import logger from 'logger'
import { HttpClient } from '../types'
import { ViewClient } from './types'

function createViewClient(): ViewClient {
  const preFetched: Record<string, BeagleUIElement> = {}

  async function fetchView(httpClient: HttpClient, route: RemoteView): Promise<BeagleUIElement> {
    const { method, body, headers } = route.httpAdditionalData || {}
    const response = await httpClient.fetch(route.url, { method, body, headers })
    if (!response.ok) throw new Error(`${response.status}: ${response.statusText}`)
    return await response.json()
  }

  return {
    preFetch: async (httpClient, route) => {
      try {
        preFetched[route.url] = await fetchView(httpClient, route)
      } catch (error) {
        logger.error(`Error while pre-fetching view: ${route.url}`, error)
      }
    },
    fetch: async (httpClient, route) => {
      if (preFetched[route.url]) {
        const result = preFetched[route.url]
        delete preFetched[route.url]
        return result
      }
      return await fetchView(httpClient, route)
    },
  }
}

export default {
  create: createViewClient,
}
