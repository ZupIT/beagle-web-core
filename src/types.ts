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

export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>

// todo: legacy code, remove with v2.0
import { ClickEvent as CE, ScreenEvent as SE } from 'service/beagle-service/types'

/**
 * @deprecated Since version 1.2. Will be removed in version 2.0. Import it from the root instead
 * (`import { ClickEvent } from '@zup-it/beagle-web'`).
 */
export type ClickEvent = CE

/**
 * @deprecated Since version 1.2. Will be removed in version 2.0. Import it from the root instead
 * (`import { ScreenEvent } from '@zup-it/beagle-web'`).
 */
export type ScreenEvent = SE
