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

import createURLBuilder from '../../src/utils/url-builder'

const baseUrl = 'http://teste.com'
const path = '/myview'

describe('URL-Builder', () => {
  let formater

  describe('Builder tests', () => {
    beforeEach(() => {
      formater = createURLBuilder(baseUrl)
    })

    it('should return concatenated baseURL and path', () => {
      const url = `${baseUrl}${path}`
      expect(formater.build(path)).toEqual(url)
    })

    it('should return concatenated custom baseURL and path', () => {
      const customBaseURL = 'http://customBaseURL'
      const url = `${customBaseURL}${path}`
      expect(formater.build(path, customBaseURL)).toEqual(url)
    })

    it('should not use baseURL if path is not relative', () => {
      const customBaseURL = 'http://customBaseURL'
      const customPath = 'https://testeCustomPath.com.br'
      expect(formater.build(customPath, customBaseURL)).toEqual(customPath)
    })

    it('should not concatenate baseURL if custompath do not start with /', () => {
      const customPath = 'testing'
      expect(formater.build(customPath)).toEqual(customPath)
    })

    it('should handle multiple / as a relative path', () => {
      const customPath = '//testing'
      expect(formater.build(customPath)).toEqual(`${baseUrl}${customPath}`)
    })

    it('should return only customPath', () => {
      const customPath = 'https://testeCustomPath.com.br'
      expect(formater.build(customPath)).toEqual(customPath)
    })

    it('should return root of basePath', () => {
      const customPath = '/'
      expect(formater.build(customPath)).toEqual(`${baseUrl}/`)
    })
  })

  describe('Handle Simple Base URL', () => {
    it('should concatenate baseUrl and path if relative path', () => {
      const baseURL = 'http://base.url'
      const path = '/relativePath'
      expect(formater.build(path, baseURL)).toEqual(`${baseURL}${path}`)
    })

    it('should return path without concatening if absolute path', () => {
      const baseURL = 'http://base.url'
      const absolutePath = 'absolutePath'
      expect(formater.build(absolutePath, baseURL)).toEqual(absolutePath)
    })

    it('should concatenate baseURL and path if path has multiple /', () => {
      const baseURL = 'http://base.url'
      const path = '//weirdPath'
      expect(formater.build(path, baseURL)).toEqual(`${baseURL}${path}`)
    })

    it('should handle root path', () => {
      const baseURL = 'http://base.url'
      const path = '/'
      expect(formater.build(path, baseURL)).toEqual(`${baseURL}${path}`)
    })

    it('should return path if path is empty', () => {
      const baseURL = 'http://base.url'
      const path = ''
      expect(formater.build(path, baseURL)).toEqual('')
    })
  })

  describe('Handle Base URL ending with /', () => {
    it('should not duplicate / when both baseUrl and path have it', () => {
      const baseURL = 'http://base.ending.with.slash/'
      const path = '/relativePath'
      expect(formater.build(path, baseURL)).toEqual('http://base.ending.with.slash/relativePath')
    })

    it('should return only path if path doesnt start with / and baseUrl ends with it', () => {
      const baseURL = 'http://base.ending.with.slash/'
      const path = 'absolutePath'
      expect(formater.build(path, baseURL)).toEqual(path)
    })

    it('should remove ending / on baseUrl and keep the / on path', () => {
      const baseURL = 'http://base.ending.with.slash/'
      const path = '//weirdPath'
      expect(formater.build(path, baseURL)).toEqual('http://base.ending.with.slash//weirdPath')
    })

    it('should not duplicate / when both baseUrl and path have it, even if path has only it', () => {
      const baseURL = 'http://base.ending.with.slash/'
      const path = '/'
      expect(formater.build(path, baseURL)).toEqual(baseURL)
    })

    it('should return path when path is empty', () => {
      const baseURL = 'http://base.ending.with.slash/'
      const path = ''
      expect(formater.build(path, baseURL)).toEqual('')
    })
  })

  describe('Handle Base URL that already has a path', () => {
    const baseURL = 'http://base.url/withPath'

    beforeEach(() => {
      formater = createURLBuilder(baseURL)
    })

    it('should concatenate if baseURL has already a path and received path is relative', () => {
      const path = '/relativePath'
      expect(formater.build(path)).toEqual(`${baseURL}${path}`)
    })

    it('should keep only absolutePath if it doesnt start with /', () => {
      const absolutePath = 'absolutePath'
      expect(formater.build(absolutePath)).toEqual(absolutePath)
    })

    it('should concatenate baseURL with relative path path ', () => {
      const path = '//weirdPath'
      expect(formater.build(path)).toEqual(`${baseURL}${path}`)
    })

    it('should handle root path ', () => {
      const path = '/'
      expect(formater.build(path)).toEqual(`${baseURL}${path}`)
    })

    it('should return empty path if received one', () => {
      const path = ''
      expect(formater.build(path)).toEqual('')
    })
  })

  describe('Handle empty baseURL', () => {
    const baseURL = null

    beforeEach(() => {
      formater = createURLBuilder(baseURL)
    })

    it('should handle relative path when baseURL is empty', () => {
      const path = '/relativePath'
      expect(formater.build(path)).toEqual(path)
    })

    it('should handle absolute path when baseURL is empty', () => {
      const absolutePath = 'absolutePath'
      expect(formater.build(absolutePath)).toEqual(absolutePath)
    })
  
    it('should handle relative path with multiple / when baseURL is empty', () => {
      const path = '//weirdPath'
      expect(formater.build(path)).toEqual(path)
    })
  
    it('should handle root path when baseURL is empty', () => {
      const path = '/'
      expect(formater.build(path)).toEqual('/')
    })

    it('should handle empty path when baseURL is empty', () => {
      const path = ''
      expect(formater.build(path)).toEqual('')
    })
  })
  describe('check encode URL', () => {
    const encodedUrl = 'https://www.guiaviagensbrasil.com/imagens/Imagem%20do%20mar%20calma%20e%20belo%20da%20Praia%20da%20Engenhoca-Itacar%C3%A9-Bahia-BA.jpg'
    const notEncodedUrl = 'https://www.guiaviagensbrasil.com/imagens/Imagem do mar calma e belo da Praia da Engenhoca-Itacaré-Bahia-BA.jpg'
    it('should not encode URL', () => {
      formater = createURLBuilder(encodedUrl)
      expect(formater.build(encodedUrl)).toEqual(encodedUrl)
    })
    it('should encode URL', () => {
      formater = createURLBuilder(notEncodedUrl)
      expect(formater.build(notEncodedUrl)).toEqual(encodedUrl)
    })
  })
})
