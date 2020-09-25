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

import StringUtils from 'utils/string'

describe('Utils String', () => {

  it('should remove prefix if found', () => {
    expect(StringUtils.removePrefix('/test', '/')).toEqual('test')
  })

  it('should remove prefix only on the beginning', () => {
    expect(StringUtils.removePrefix('/te/st/', '/')).toEqual('te/st/')
  })

  it('should keep word as is if prefix not found found', () => {
    expect(StringUtils.removePrefix('test', '/')).toEqual('test')
  })

  it('should remove prefix if letter', () => {
    expect(StringUtils.removePrefix('Atest', 'A')).toEqual('test')
  })

  it('should remove prefix if special character', () => {
    expect(StringUtils.removePrefix('#test', '#')).toEqual('test')
  })

  it('should remove prefix if prefix has many characteres', () => {
    expect(StringUtils.removePrefix('#AAAtest', '#AAA')).toEqual('test')
  })

  it('should remove suffix if found', () => {
    expect(StringUtils.removeSuffix('test/', '/')).toEqual('test')
  })

  it('should remove suffix only on the end of the word', () => {
    expect(StringUtils.removeSuffix('/te/st/', '/')).toEqual('/te/st')
  })

  it('should keep word as is if suffix not found found', () => {
    expect(StringUtils.removeSuffix('test', '/')).toEqual('test')
  })

  it('should remove suffix if letter', () => {
    expect(StringUtils.removeSuffix('testI', 'I')).toEqual('test')
  })

  it('should remove suffix if special character', () => {
    expect(StringUtils.removeSuffix('test#', '#')).toEqual('test')
  })

  it('should remove suffix if prefix has many characteres', () => {
    expect(StringUtils.removeSuffix('testING#', 'ING#')).toEqual('test')
  })

  it('capitalizeFirstLetter should handle empty string', () => {
    expect(StringUtils.capitalizeFirstLetter('')).toEqual('')
  })

  it('capitalizeFirstLetter should handle empty string', () => {
    expect(StringUtils.capitalizeFirstLetter('')).toEqual('')
  })

  it('capitalizeFirstLetter should handle string with only one letter', () => {
    expect(StringUtils.capitalizeFirstLetter('a')).toEqual('A')
  })

  it('capitalizeFirstLetter should upperCase only first letter', () => {
    expect(StringUtils.capitalizeFirstLetter('testing')).toEqual('Testing')
  })

  it('capitalizeFirstLetter should upperCase only first letter of the first word', () => {
    expect(StringUtils.capitalizeFirstLetter('testing test')).toEqual('Testing test')
  })

  it('capitalizeFirstLetter should not change uppercase word', () => {
    expect(StringUtils.capitalizeFirstLetter('TESTING')).toEqual('TESTING')
  })

  it('capitalizeFirstLetter should change upperCase only first letter', () => {
    expect(StringUtils.capitalizeFirstLetter('tEsTiNg tEsT')).toEqual('TEsTiNg tEsT')
  })

  it('should add the prefix if string does not have it', () => {
    expect(StringUtils.addPrefix('test', '/')).toEqual('/test')
  })

  it('should not add the prefix if string already has it', () => {
    expect(StringUtils.addPrefix('/test', '/')).toEqual('/test')
  })

  it('should handle empty string', () => {
    expect(StringUtils.addPrefix('', '/')).toEqual('/')
  })
  
  it('should not change string if it already has prefix', () => {
    expect(StringUtils.addPrefix('/t/e/s/t', '/')).toEqual('/t/e/s/t')
  })

  it('should add prefix and not change inner string', () => {
    expect(StringUtils.addPrefix('t/e/s/t/', '/')).toEqual('/t/e/s/t/')
  })

})
