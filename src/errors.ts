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

export class BeagleError extends Error {
  constructor(message: string) {
    super(`Beagle: ${message}`)
  }
}

export class BeagleCacheError extends BeagleError {
  constructor(path: string) {
    super(`cache for ${path} has not been found.`)
  }
}

export class BeagleExpiredCacheError extends BeagleError {
  constructor(path: string) {
    super(`cache for ${path} has expired.`)
  }
}


export class BeagleNetworkError extends BeagleError {
  public response: Response

  constructor(path: string, response: Response) {
    super(`network error while trying to access ${path}.`)
    this.response = response
  }
}

export class BeagleParseError extends BeagleError {
  constructor(message: string) {
    super(`parse error: ${message}`)
  }
}

export class BeagleNotFoundError extends BeagleError {
  constructor(message: string) {
    super(`not found error: ${message}`)
  }
}
