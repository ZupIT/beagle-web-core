/*
  * Copyright 2020 ZUP IT SERVICOS EM TECNOLOGIA E INOVACAO SA
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *  http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
*/

import { HttpMethod, BeagleHeaders } from '../types'
import { getHash } from './beagle-metadata'

function handleBeagleHeaders(useBeagleHeaders?: boolean): BeagleHeaders {
  const beagleHeaders = { 'beagle-platform': 'WEB', 'beagle-hash': '' }
  const useDefaultHeaders = useBeagleHeaders !== undefined ? useBeagleHeaders : true

  async function getBeagleHeaders(url: string, method: HttpMethod) {
    if (!useDefaultHeaders) return {}
    else {
      const hash = await getHash(url, method)
      return { ...beagleHeaders, 'beagle-hash': hash }
    }
  }

  return {
    getBeagleHeaders,
  }
}

export default handleBeagleHeaders
