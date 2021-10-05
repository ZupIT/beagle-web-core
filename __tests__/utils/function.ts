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

/**
 * Returns a promise that is resolved as soon as the function mock passed as parameter is called
 * for the nth time, where n is the parameter `times`.
 *
 * The function calls will be checked every 20ms, so when this is resolved, the function might
 * have been called more then desired number of times.
 *
 * If the function is not called the desired number of times before `timeout` ms, the promise is
 * either rejected or it's resolved with an error message logged to the console. The behavior will
 * depend on the parameter `rejectOnTimeout`.
 *
 * @param fn the function mock to check
 * @param times the minimum number of times you wish the function to be called before resolving the
 * promise
 * @param timeout the maximum time (ms) to wait. Default is 500ms.
 * @param rejectOnTimeout default is false. When true, will reject once it times out. When false,
 * will resolve even on timeout, but with an error message logged to the console
 * @returns the promise
 */
export function whenCalledTimes(
  fn: jest.Mock,
  times: number,
  timeout = 500,
  rejectOnTimeout = true,
) {
  const interval = 20
  let attempts = 0

  return new Promise<void>((resolve, reject) => {
    const id = setInterval(() => {
      if (fn.mock.calls.length >= times) {
        clearInterval(id)
        resolve()
      }
      else if (attempts++ * interval >= timeout) {
        clearInterval(id)
        const message = `Timeout while waiting function to be executed ${times} times.`
        if (rejectOnTimeout) reject(message)
        else {
          console.error(message)
          resolve()
        }
      }
    }, 20)
  })
}

/**
 * Gets the nth parameter of the mth call to the function `fn`, where n is `parameterIndex` and m is
 * `callIndex`.
 *
 * @param fn the function mock
 * @param callIndex the index of the call to get parameter from
 * @param parameterIndex the index of the desired parameter
 * @returns the parameter value
 */
export function getParameter(fn: jest.Mock, callIndex = 0, parameterIndex = 0) {
  return fn.mock.calls[callIndex][parameterIndex]
}

/**
 * Gets the nth parameter of all calls to the function `fn`, where n is `parameterIndex`.
 *
 * @param fn the function mock
 * @param parameterIndex the index of the desired parameter
 * @returns an array with the parameter value for each one of the calls
 */
export function getParameterByCalls(fn: jest.Mock, parameterIndex = 0) {
  return fn.mock.calls.map(call => call[parameterIndex])
}
