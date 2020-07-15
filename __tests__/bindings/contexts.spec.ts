/**
 * FIXME: This test refers to the old structure. It should be reorganized so that both
 * bindings/contexts.spec.ts and bindings/expressions.spec.ts explicitly test the functions of
 * Render/Context.ts and Render/Expression.ts.
 */

import Context from '../../src/Renderer/Context'
import Expression from '../../src/Renderer/Expression'
import Tree from '../../src/utils/Tree'
import { findById, findByType } from '../../src/utils/tree-reading'
import { createMockWithSameIdContexts, createSocialMediaData, createSocialMediaMock } from './mocks'

describe('Binding expressions: replacing with calculated contexts', () => {
  it('should use contexts declared in the data structure', () => {
    const socialMediaData = createSocialMediaData()
    const mock = createSocialMediaMock()
    const contexts = Context.evaluate(mock)
    
    const treeWithValues = Tree.replaceEach(
      mock,
      component => Expression.resolveForComponent(component, contexts[component.id]),
    )
  
    const profile = findById(treeWithValues, 'profile')
    const friendsTitle = findById(treeWithValues, 'friendsTitle')
    const friendsPanel = findById(treeWithValues, 'friendsPanel')
    const friendModal = findById(treeWithValues, 'friendDetailsModal')
    const firstPost = findById(treeWithValues, 'firstPost')
    const secondPost = findById(treeWithValues, 'secondPost')
    const thirdPost = findById(treeWithValues, 'thirdPost')
  
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
      component => Expression.resolveForComponent(component, contexts[component.id]),
    )

    const text = findByType(treeWithValues, 'text')[0]
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
        component => Expression.resolveForComponent(component, contexts[component.id]),
      )
      
      const postWithWrongContext = findById(treeWithValues, 'postWithWrongContext')
      expect(postWithWrongContext.author).toBe('@{friends[0].name}')
    },
  )
})
