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

import httpClient from '../BeagleHttpClient'
import { ActionHandler, SendRequestAction } from './types'

interface ParsedResponse {
  data: any,
  status: number,
  statusText: string,
}

const sendRequest: ActionHandler<SendRequestAction> = async ({
  action,
  handleAction,
  eventContextHierarchy,
  beagleView,
  ...otherParameters
}) => {
  const { url, method, data, headers, onSuccess, onError, onFinish } = action

  function handleSuccess(parsedResponse: ParsedResponse) {
    if (!onSuccess) return

    handleAction({
      action: onSuccess,
      eventContextHierarchy: [{ id: 'onSuccess', value: parsedResponse }, ...eventContextHierarchy],
      handleAction,
      beagleView,
      ...otherParameters,
    })
  }

  function handleError(error: any) {
    if (!onError) return

    handleAction({
      action: onError,
      eventContextHierarchy: [{ id: 'onError', value: error }, ...eventContextHierarchy],
      handleAction,
      beagleView,
      ...otherParameters,
    })
  }

  function handleFinish() {
    if (!onFinish) return

    handleAction({
      action: onFinish,
      eventContextHierarchy,
      handleAction,
      beagleView,
      ...otherParameters,
    })
  }

  const contextResponse: Partial<ParsedResponse> = {}

  try {
    const urlBuilder = beagleView.getUrlBuilder()
    const response = await httpClient.fetch(
      urlBuilder.build(url),
      { method, body: JSON.stringify(data), headers },
    )

    const resultText = await response.text()
    contextResponse.status = response.status
    contextResponse.statusText = response.statusText
    contextResponse.data = resultText
    const resultData = resultText && JSON.parse(resultText)
    contextResponse.data = resultData
    
    if (!response.ok) throw new Error(contextResponse.statusText)
    handleSuccess(contextResponse as ParsedResponse)
  } catch (error) {
    console.error(error)
    handleError({
      ...contextResponse,
      message: error.message || 'Unexpected error',
    })
  } finally {
    handleFinish()
  }
}

export default sendRequest
