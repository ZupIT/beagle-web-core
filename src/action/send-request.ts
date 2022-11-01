/*
* Copyright 2020, 2022 ZUP IT SERVICOS EM TECNOLOGIA E INOVACAO SA
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

import logger from 'logger'
import BeagleNetworkError from 'error/BeagleNetworkError'
import { ActionHandler, SendRequestAction } from './types'

interface ParsedResponse {
  data: any,
  status: number,
  statusText: string,
}

const sendRequest: ActionHandler<SendRequestAction> = async ({
  action,
  executeAction,
  beagleView,
}) => {
  const { url, method = 'get', data, headers, onSuccess, onError, onFinish } = action
  const { httpClient, urlBuilder } = beagleView.getBeagleService()

  const contextResponse: Partial<ParsedResponse> = {}

  try {
    const response = await httpClient.fetch(
      urlBuilder.build(url),
      { method, body: JSON.stringify(data), headers },
    )

    const resultText = await response.text()
    contextResponse.status = response.status
    contextResponse.statusText = response.statusText
    contextResponse.data = resultText

    try {
      const resultData = resultText && JSON.parse(resultText)
      contextResponse.data = resultData
    } catch {
      contextResponse.data = resultText
    }
    if (!response.ok) throw new BeagleNetworkError(url, response, response.status, method)
    onSuccess && executeAction(onSuccess, 'onSuccess', contextResponse)
  } catch (error) {
    logger.error(error)
    const event = {
      ...contextResponse,
      message: (error as any).message || 'Unexpected error',
    }
    onError && executeAction(onError, 'onError', event)
  } finally {
    onFinish && executeAction(onFinish)
  }
}

export default sendRequest
