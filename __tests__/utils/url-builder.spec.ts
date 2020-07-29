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

import URLBuilder from '../../src/UrlBuilder'

describe('URL-Builder', () => {
  describe('Builder tests', () => {
    const baseURL = 'http://teste.com'
    const path = '/myview'

    beforeAll(() => {
      URLBuilder.setBaseUrl(baseURL)
    })

    it('should return concatenated baseURL and path', () => {
      const url = `${baseURL}${path}`
      expect(URLBuilder.build(path)).toEqual(url)
    })

    it('should not concatenate baseURL if custompath do not start with /', () => {
      const customPath = 'testing'
      expect(URLBuilder.build(customPath)).toEqual(customPath)
    })

    it('should handle multiple / as a relative path', () => {
      const customPath = '//testing'
      expect(URLBuilder.build(customPath)).toEqual(`${baseURL}${customPath}`)
    })

    it('should return only customPath', () => {
      const customPath = 'https://testeCustomPath.com.br'
      expect(URLBuilder.build(customPath)).toEqual(customPath)
    })

    it('should return root of basePath', () => {
      const customPath = '/'
      expect(URLBuilder.build(customPath)).toEqual(`${baseURL}/`)
    })
  })

  describe('Handle Simple Base URL', () => {
    const baseURL = 'http://base.url'
  
    beforeAll(() => {
      URLBuilder.setBaseUrl(baseURL)
    })
    
    it('should concatenate baseUrl and path if relative path', () => {
      const path = '/relativePath'
      expect(URLBuilder.build(path)).toEqual(`${baseURL}${path}`)
    })

    it('should return path without concatenating if absolute path', () => {
      const absolutePath = 'absolutePath'
      expect(URLBuilder.build(absolutePath)).toEqual(absolutePath)
    })

    it('should concatenate baseURL and path if path has multiple /', () => {
      const path = '//weirdPath'
      expect(URLBuilder.build(path)).toEqual(`${baseURL}${path}`)
    })

    it('should handle root path', () => {
      const path = '/'
      expect(URLBuilder.build(path)).toEqual(`${baseURL}${path}`)
    })

    it('should return path if path is empty', () => {
      const path = ''
      expect(URLBuilder.build(path)).toEqual('')
    })
  })

  describe('Handle Base URL ending with /', () => {
    const baseURL = 'http://base.ending.with.slash/'
  
    beforeAll(() => {
      URLBuilder.setBaseUrl(baseURL)
    })

    it('should not duplicate / when both baseUrl and path have it', () => {
      const path = '/relativePath'
      expect(URLBuilder.build(path)).toEqual('http://base.ending.with.slash/relativePath')
    })

    it('should return only path if path doesnt start with / and baseUrl ends with it', () => {
      const path = 'absolutePath'
      expect(URLBuilder.build(path)).toEqual(path)
    })

    it('should remove ending / on baseUrl and keep the / on path', () => {
      const path = '//weirdPath'
      expect(URLBuilder.build(path)).toEqual('http://base.ending.with.slash//weirdPath')
    })

    it('should not duplicate / when both baseUrl and path have it, even if path has only it', () => {
      const path = '/'
      expect(URLBuilder.build(path)).toEqual(baseURL)
    })

    it('should return path when path is empty', () => {
      const path = ''
      expect(URLBuilder.build(path)).toEqual('')
    })
  })

  describe('Handle Base URL that already has a path', () => {
    const baseURL = 'http://base.url/withPath'

    beforeAll(() => {
      URLBuilder.setBaseUrl(baseURL)
    })

    it('should concatenate if baseURL has already a path and received path is relative', () => {
      const path = '/relativePath'
      expect(URLBuilder.build(path)).toEqual(`${baseURL}${path}`)
    })

    it('should keep only absolutePath if it doesnt start with /', () => {
      const absolutePath = 'absolutePath'
      expect(URLBuilder.build(absolutePath)).toEqual(absolutePath)
    })

    it('should concatenate baseURL with relative path path ', () => {
      const path = '//weirdPath'
      expect(URLBuilder.build(path)).toEqual(`${baseURL}${path}`)
    })

    it('should handle root path ', () => {
      const path = '/'
      expect(URLBuilder.build(path)).toEqual(`${baseURL}${path}`)
    })

    it('should return empty path if received one', () => {
      const path = ''
      expect(URLBuilder.build(path)).toEqual('')
    })
  })

  describe('Handle empty baseURL', () => {
    const baseURL = null

    beforeAll(() => {
      URLBuilder.setBaseUrl(baseURL)
    })

    it('should handle relative path when baseURL is empty', () => {
      const path = '/relativePath'
      expect(URLBuilder.build(path)).toEqual(path)
    })

    it('should handle absolute path when baseURL is empty', () => {
      const absolutePath = 'absolutePath'
      expect(URLBuilder.build(absolutePath)).toEqual(absolutePath)
    })
  
    it('should handle relative path with multiple / when baseURL is empty', () => {
      const path = '//weirdPath'
      expect(URLBuilder.build(path)).toEqual(path)
    })
  
    it('should handle root path when baseURL is empty', () => {
      const path = '/'
      expect(URLBuilder.build(path)).toEqual('/')
    })

    it('should handle empty path when baseURL is empty', () => {
      const path = ''
      expect(URLBuilder.build(path)).toEqual('')
    })
  })
  describe('check encode URL', () => {
    const encodedUrl = 'https://www.guiaviagensbrasil.com/imagens/Imagem%20do%20mar%20calma%20e%20belo%20da%20Praia%20da%20Engenhoca-Itacar%C3%A9-Bahia-BA.jpg'
    const notEncodedUrl = 'https://www.guiaviagensbrasil.com/imagens/Imagem do mar calma e belo da Praia da Engenhoca-Itacaré-Bahia-BA.jpg'
    it('should not encode URL', () => {
      expect(URLBuilder.build(encodedUrl)).toEqual(encodedUrl)
    })
    it('should encode URL', () => {
      expect(URLBuilder.build(notEncodedUrl)).toEqual(encodedUrl)
    })
  })
})
