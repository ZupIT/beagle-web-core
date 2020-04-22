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

import { capitalizeFirstLetter, removePrefix, removeSuffix } from '../src/utils/string'

describe('Utils String', () => {

  it('should remove prefix if found', () => {
    expect(removePrefix('/test', '/')).toEqual('test')
  })

  it('should remove prefix only on the beginning', () => {
    expect(removePrefix('/te/st/', '/')).toEqual('te/st/')
  })

  it('should keep word as is if prefix not found found', () => {
    expect(removePrefix('test', '/')).toEqual('test')
  })

  it('should remove prefix if letter', () => {
    expect(removePrefix('Atest', 'A')).toEqual('test')
  })

  it('should remove prefix if special character', () => {
    expect(removePrefix('#test', '#')).toEqual('test')
  })

  it('should remove prefix if prefix has many characteres', () => {
    expect(removePrefix('#AAAtest', '#AAA')).toEqual('test')
  })

  it('should remove suffix if found', () => {
    expect(removeSuffix('test/', '/')).toEqual('test')
  })

  it('should remove suffix only on the end of the word', () => {
    expect(removeSuffix('/te/st/', '/')).toEqual('/te/st')
  })

  it('should keep word as is if suffix not found found', () => {
    expect(removeSuffix('test', '/')).toEqual('test')
  })

  it('should remove suffix if letter', () => {
    expect(removeSuffix('testI', 'I')).toEqual('test')
  })

  it('should remove suffix if special character', () => {
    expect(removeSuffix('test#', '#')).toEqual('test')
  })

  it('should remove suffix if prefix has many characteres', () => {
    expect(removeSuffix('testING#', 'ING#')).toEqual('test')
  })

  it('capitalizeFirstLetter should handle empty string', () => {
    expect(capitalizeFirstLetter('')).toEqual('')
  })

  it('capitalizeFirstLetter should handle empty string', () => {
    expect(capitalizeFirstLetter('')).toEqual('')
  })

  it('capitalizeFirstLetter should handle string with only one letter', () => {
    expect(capitalizeFirstLetter('a')).toEqual('A')
  })

  it('capitalizeFirstLetter should upperCase only first letter', () => {
    expect(capitalizeFirstLetter('testing')).toEqual('Testing')
  })

  it('capitalizeFirstLetter should upperCase only first letter of the first word', () => {
    expect(capitalizeFirstLetter('testing test')).toEqual('Testing test')
  })

  it('capitalizeFirstLetter should not change uppercase word', () => {
    expect(capitalizeFirstLetter('TESTING')).toEqual('TESTING')
  })

  it('capitalizeFirstLetter should change upperCase only first letter', () => {
    expect(capitalizeFirstLetter('tEsTiNg tEsT')).toEqual('TEsTiNg tEsT')
  })

})
