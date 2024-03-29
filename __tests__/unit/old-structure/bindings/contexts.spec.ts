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

/**
 * FIXME: This test refers to the old structure. It should be reorganized so that both
 * bindings/contexts.spec.ts and bindings/expressions.spec.ts explicitly test the functions of
 * Render/Context.ts and Render/Expression.ts.
 */

import Context from 'beagle-view/render/context'
import Expression from 'beagle-view/render/expression'
import BeagleParseError from 'error/BeagleParseError'
import Tree from 'beagle-tree'
import {
  createMockWithSameIdContexts,
  createSocialMediaData,
  createSocialMediaMock,
  treeWithGlobalContext,
  treeWithValidContext,
  componentWithOnlyImplicitContexts,
  componentWithExplicitAndImplicitContexts,
} from './mocks'
import defaultOperation from 'operation'

describe('Binding expressions: replacing with calculated contexts', () => {
  beforeEach(() => {
    globalMocks.log.mockClear()
  })
  
  it('should use contexts declared in the data structure', () => {
    const socialMediaData = createSocialMediaData()
    const mock = createSocialMediaMock()
    const contexts = Context.evaluate(mock)

    const treeWithValues = Tree.replaceEach(
      mock,
      component => Expression.resolveForComponent(component, contexts[component.id], defaultOperation),
    )

    const profile = Tree.findById(treeWithValues, 'profile')!
    const friendsTitle = Tree.findById(treeWithValues, 'friendsTitle')!
    const friendsPanel = Tree.findById(treeWithValues, 'friendsPanel')!
    const friendModal = Tree.findById(treeWithValues, 'friendDetailsModal')!
    const firstPost = Tree.findById(treeWithValues, 'firstPost')!
    const secondPost = Tree.findById(treeWithValues, 'secondPost')!
    const thirdPost = Tree.findById(treeWithValues, 'thirdPost')!

    expect(profile.name).toBe(socialMediaData.user.name)
    expect(profile.picture).toBe(socialMediaData.user.picture)
    expect(profile.detailsPath).toBe('/users/007')
    expect(friendsTitle.value).toBe('James Bond\'s friends:')
    expect(friendsPanel.friendList).toEqual(socialMediaData.friends)
    expect(friendModal.isOpen).toBe(false)
    expect(firstPost.author).toBe(socialMediaData.posts[0].author)
    expect(firstPost.text).toBe(socialMediaData.posts[0].text)
    expect(secondPost.author).toBe(socialMediaData.posts[1].author)
    expect(secondPost.text).toBe(socialMediaData.posts[1].text)
    expect(thirdPost.author).toBe(socialMediaData.posts[2].author)
    expect(thirdPost.text).toBe(socialMediaData.posts[2].text)
  })

  it('should use closest context if two contexts are declared with the same id', () => {
    const mock = createMockWithSameIdContexts()
    const contexts = Context.evaluate(mock)

    const treeWithValues = Tree.replaceEach(
      mock,
      component => Expression.resolveForComponent(component, contexts[component.id], defaultOperation),
    )

    const text = Tree.findByType(treeWithValues, 'text')[0]
    expect(text).toBeDefined()
    expect(text.value).toBe('jest-2')
  })

  it(
    'should not replace if referred context exists but is not in the current scope (hierarchy)',
    () => {
      const mock = createSocialMediaMock()
      const contexts = Context.evaluate(mock)

      const treeWithValues = Tree.replaceEach(
        mock,
        component => Expression.resolveForComponent(component, contexts[component.id], defaultOperation),
      )

      const postWithWrongContext = Tree.findById(treeWithValues, 'postWithWrongContext')!
      expect(postWithWrongContext.author).toBe(null)
    },
  )

  it('should create implicit contexts', () => {
    const contextMap = Context.evaluate(componentWithOnlyImplicitContexts)
    expect(contextMap.myContainer).toEqual([
      { id: 'implicit1', value: 'hello' },
      { id: 'implicit2', value: 'world' },
    ])
  })

  it('should create both implicit and explicit contexts', () => {
    const contextMap = Context.evaluate(componentWithExplicitAndImplicitContexts)
    expect(contextMap.myContainer).toEqual([
      { id: 'explicit', value: 'hello' },
      { id: 'implicit', value: 'world' },
    ])
  })

  it('should not create implicit contexts', () => {
    const contextMap = Context.evaluate(componentWithExplicitAndImplicitContexts, [], false)
    expect(contextMap.myContainer).toEqual([
      { id: 'explicit', value: 'hello' },
    ])
  })
})

describe('Testing context hierarchy', () => {
  beforeEach(() => {
    globalMocks.log.mockClear()
  })

  it('should throw error if context id is invalid', () => {
    const evaluate = (name: string) => () => Context.evaluate({
      _beagleComponent_: 'container',
      id: '1',
      context: { id: name, value: 0 },
    })
    expect(evaluate('global')).toThrow(expect.any(BeagleParseError))
    expect(evaluate('true')).toThrow(expect.any(BeagleParseError))
    expect(evaluate('false')).toThrow(expect.any(BeagleParseError))
    expect(evaluate('null')).toThrow(expect.any(BeagleParseError))
    expect(evaluate('054545')).toThrow(expect.any(BeagleParseError))
    expect(evaluate('89.47')).toThrow(expect.any(BeagleParseError))
  })

  it('should not emit a warning if valid context id', () => {
    Context.evaluate(treeWithValidContext)
    expect(globalMocks.log).not.toHaveBeenCalled()
  })
})
