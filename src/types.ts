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

/* compatibility mode: older versions of Typescript that must be supported by Beagle (>= 3.1.1)
don't have "Omit" natively */
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>

/* The following 4 types have been copied from the original ES6 module definition and slightly
altered. This must be done because we must target ES5 in our build, which doesn't have support to
iterators. It's true that iterators won't work in ES5 environments, but we don't want to limit
Beagle for people using ES6 or later. */
export interface IteratorYieldResult<TYield> {
  done?: false,
  value: TYield,
}

export interface IteratorReturnResult {
  done: true,
  value: any,
}

export type IteratorResult<T> = IteratorYieldResult<T> | IteratorReturnResult

export interface Iterator<T> {
  next(...args: []): IteratorResult<T>,
  return?(value?: any): IteratorResult<T>,
  throw?(e?: any): IteratorResult<T>,
}


