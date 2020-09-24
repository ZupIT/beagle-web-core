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
