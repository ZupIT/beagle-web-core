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

import { ActionHandler, SendRequestAction } from './types'

interface ParsedResponse {
  data: any,
  status: number,
  statusText: string,
}

const xhr: ActionHandler<SendRequestAction> = async ({
  action,
  handleAction,
  eventContextHierarchy,
  ...otherParameters
}) => {
  const { url, method, data, headers, onSuccess, onError, onFinish } = action

  function handleSuccess(parsedResponse: ParsedResponse) {
    if (!onSuccess) return

    handleAction({
      action: onSuccess,
      eventContextHierarchy: [{ id: 'onSuccess', value: parsedResponse }, ...eventContextHierarchy],
      handleAction,
      ...otherParameters,
    })
  }

  function handleError(error: any) {
    if (!onError) return

    handleAction({
      action: onError,
      eventContextHierarchy: [{ id: 'onError', value: error }, ...eventContextHierarchy],
      handleAction,
      ...otherParameters,
    })
  }

  function handleFinish() {
    if (!onFinish) return

    handleAction({
      action: onFinish,
      eventContextHierarchy,
      handleAction,
      ...otherParameters,
    })
  }

  try {
    const response = await fetch(url, { method, body: JSON.stringify(data), headers })

    const resultText = await response.text()
    const resultData = resultText && JSON.parse(resultText)
    const contextResponse = {
      data: resultData,
      status: response.status,
      statusText: response.statusText,
    }
    
    if (!response.ok) {
      const error = { ...contextResponse, message: 'Erro ao processar requisição' }
      throw error
    }

    handleSuccess(contextResponse)
    
  } catch (error) {
    console.error(error)
    handleError(error)
  } finally {
    handleFinish()
  }
}

export default xhr
