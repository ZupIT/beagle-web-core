/*
 * Copyright 2020 ZUP IT SERVICOS EM TECNOLOGIA E INOVACAO SA
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

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
