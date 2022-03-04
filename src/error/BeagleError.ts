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

export interface SerializableError {
  message: string,
  [key: string]: any,
}

export default class BeagleError extends Error {
  constructor(message: string) {
    super(`Beagle: ${message}`)
  }

  getSerializableError(): SerializableError | Promise<SerializableError> {
    return { message: this.message }
  }
}

export function isBeagleError(error: Error) {
  return !!(error.message.startsWith('Beagle') && (error as BeagleError).getSerializableError)
}
