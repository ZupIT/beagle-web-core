import { BeagleUIElement } from 'beagle-tree/types'
import logger from 'logger'
import { ViewClient } from '../view-client/types'
import { PreFetchService } from './types'

function createPreFetchService(viewClient: ViewClient): PreFetchService {
  const views: Record<string, BeagleUIElement> = {}

  async function fetch(url: string) {
    let view: BeagleUIElement | null = null
    const onChangeTree = (v: BeagleUIElement) => view = v
    try {
      await viewClient.load({
        onChangeTree,
        url,
        retry: () => {},
      })
      if (view) views[url] = view
    } catch (errors) {
      logger.warn(`Failed to pre-fetch view ${url}.`, ...errors)
    }
  }

  function recover(url: string) {
    return views[url] || null
  }

  return {
    fetch,
    recover,
  }
}

export default {
  create: createPreFetchService,
}
