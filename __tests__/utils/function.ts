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
 * rejected.
 * 
 * @param fn the function mock to check
 * @param times the minimum number of times you wish the function to be called before resolving the
 * promise
 * @param timeout the maximum time (ms) to wait. Default is 100ms.
 * @returns the promise
 */
export function whenCalledTimes(fn: jest.Mock, times: number, timeout = 100) {
  const interval = 20
  let attempts = 0

  return new Promise((resolve, reject) => {
    const id = setInterval(() => {
      if (fn.mock.calls.length >= times) resolve()
      else if (attempts++ * interval >= timeout) {
        clearInterval(id)
        reject(`Timeout while waiting function to be executed ${times} times.`)
      }
    }, 20)
  })
}
