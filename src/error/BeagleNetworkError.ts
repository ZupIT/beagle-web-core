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

import BeagleError from './BeagleError'

export type SerializableResponse = (
  Pick<Response, 'headers' | 'ok' | 'redirected' | 'status' | 'statusText' | 'type' | 'url'>
  & {
    text: string,
    json?: any,
  }
)

export interface SerializableNetworkError {
  message: string,
  response?: SerializableResponse,
}

function buildMessage(path: string, responseOrMessage?: Response | string) {
  const additionalMessage = typeof responseOrMessage === 'string' ? ` ${responseOrMessage}` : ''
  return `network error while trying to access ${path}.${additionalMessage}`
}

export default class BeagleNetworkError extends BeagleError {
  public response?: Response

  constructor(path: string, responseOrMessage: Response | string) {
    super(buildMessage(path, responseOrMessage))
    this.response = typeof responseOrMessage === 'string' ? undefined : responseOrMessage
  }

  async getSerializableError(): Promise<SerializableNetworkError> {
    if (!this.response) return super.getSerializableError()

    const text = await this.response.text()
    let json: any
    try {
      json = JSON.parse(text)
    } catch {}

    return {
      message: this.message,
      response: {
        status: this.response.status,
        statusText: this.response.statusText,
        ok: this.response.ok,
        type: this.response.type,
        redirected: this.response.redirected,
        url: this.response.url,
        headers: this.response.headers,
        text,
        json,
      },
    }
  }
}
