import { BeagleUIElement } from 'beagle-tree/types'

export interface PreFetchService {
  /**
   * Pre-fetches the view for future use. If the request fails a warning is logged, but no error is
   * thrown.
   * 
   * @param url the URL of the view to pre-fetch (GET)
   * @returns a promise that resolves when the pre-fetch finishes.
   */
  fetch: (url: string) => Promise<void>,
  /**
   * Recovers the view that has been previously pre-fetched. If there's no pre-fetched view for the
   * URL, null is returned.
   * 
   * @param the URL of the view to recover
   * @returns the pre-fetched view or null if no pre-fetched view exists for the given url.
   */
  recover: (url: string) => BeagleUIElement | null,
}
