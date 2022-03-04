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

export interface URLBuilder {
  /**
   * Builds a safe url based on your `baseUrl`.
   * 
   * If path starts with `/`, it's considered to be relative to the base url. i.e. the path passed
   * as parameter is appended to the `baseUrl`.
   * 
   * Otherwise, the url is considered to be absolute and it doesn't use the baseUrl to be built.
   * 
   * In any case, paths with special characters gets encoded.
   * 
   * @param path the path to generate the URL to
   * @returns the final url
   */
  build: (path: string) => string,
}
