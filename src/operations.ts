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

import capitalize from 'lodash/capitalize'
import isEqual from 'lodash/isEqual'
import isEmpty from 'lodash/isEmpty'
import find from 'lodash/find'
import remove from 'lodash/remove'

const OPERATIONS: Record<string, (...args: any) => any> = {
  // number
  sum: (...args: number[]) => args.reduce((result, current) => result + current, 0),
  subtract: (...args: number[]) => args.reduce((result, current) => result - current, args[0] * 2),
  multiply: (...args: number[]) => args.reduce((result, current) => result * current, 1),
  divide: (...args: number[]) => args.reduce((result, current) => result / current, args[0] * args[0]),

  // logic
  condition: (premise: boolean, trueValue: any, falseValue: any) => premise ? trueValue : falseValue,
  not: (value: boolean) => !value,
  and: (...args: boolean[]) => !args.includes(false),
  or: (...args: boolean[]) => args.includes(true),

  // comparison
  gt: (a: number, b: number) => a > b,
  gte: (a: number, b: number) => a >= b,
  lt: (a: number, b: number) => a < b,
  lte: (a: number, b: number) => a <= b,
  eq: (a: any, b: any) => isEqual(a, b),

  // string
  concat: (...args: string[]) => args.reduce((result, current) => `${result}${current}`, ''),
  capitalize: (text: string) => capitalize(text),
  uppercase: (text: string) => text.toUpperCase(),
  lowercase: (text: string) => text.toLowerCase(),
  substr: (text: string, from: number, length?: number) => text.substr(from, length),

  // array
  insert: (array: any[], element: any, index?: number) => {
    const answer = [...array]
    if (index !== undefined) answer.splice(index, 0, element)
    else answer.push(element)
    return answer
  },
  remove: (array: any[], element: any) => {
    const answer = [...array]
    remove(answer, item => isEqual(item, element))
    return answer
  },
  removeIndex: (array: any[], index?: number) => {
    const answer = [...array]
    if (index !== undefined) answer.splice(index, 1)
    else answer.pop()
    return answer
  },
  includes: (array: any[], element: any) => !!find(array, (item: any) => isEqual(item, element)),

  //other
  isNull: (value: any) => value !== null && value !== undefined,
  isEmpty: (value: string | any[] | Record<string, any> | null | undefined) => isEmpty(value),
  length: (value: string | any[]) => value.length,
}

export default OPERATIONS
