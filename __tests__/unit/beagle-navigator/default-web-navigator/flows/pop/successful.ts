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

import { prepare, navigationToStackOperation } from './utils'
import { PopOperation } from './types'

export function successfulPopFlow(type: PopOperation) {
  describe('Successful pop flow', () => {
    const toView = '/test'
    let t: ReturnType<typeof prepare>

    beforeAll(() => {
      t = prepare()
      t.navigator[type]({ route: toView })
    })

    if (type === 'popToView') {
      it('should correctly call the popUntil function and update navigation data structure', () => {
        expect(t.doubleStack.popUntil).toHaveBeenCalledWith(expect.any(Function))
        const predicate = (t.doubleStack.popUntil as jest.Mock).mock.calls[0][0]
        expect(predicate({ screen: { id: "not the page we're looking for" } })).toBe(false)
        expect(predicate({ screen: { id: toView } })).toBe(true)
      })
    } else {
      it('should update navigation data structure', () => {
        expect(t.doubleStack[navigationToStackOperation[type]]).toHaveBeenCalled()
      })
    }

    it('should create analytics record', () => {
      expect(t.service.analyticsService.createScreenRecord).toHaveBeenCalledWith({
        route: t.topItem.screen.id,
        platform: t.service.getConfig().platform,
        rootId: 'test-root',
      })
    })

    it('should run change listeners', () => {
      expect(t.onChange).toHaveBeenCalledWith(t.topItem.screen.content, t.topItem.screen.id)
    })
  })
}

export function successfulPopFlowWithNavigationContext(type: PopOperation) {
  describe('Successful pop flow with navigation context', () => {
    const toView = '/test'
    let setContextSpy: jest.SpyInstance<any>
    let t: ReturnType<typeof prepare>

    describe('when previous path has no navigation context', () => {
      beforeAll(() => {
        t = prepare()
        setContextSpy = jest.spyOn(t.topItemLocalContextsManager, 'setContext')
      })

      it('should set the navigationContext as the one passed on the pop call', () => {
        expect(t.topItemLocalContextsManager.getAllAsDataContext().length).toBe(0)

        t.navigator[type]({ route: toView, navigationContext: { path: 'popPath', value: { pop: 'value' } } })

        expect(setContextSpy).toHaveBeenCalledWith('navigationContext', { pop: 'value' }, 'popPath')
        const dataContexts = t.topItemLocalContextsManager.getAllAsDataContext()
        expect(dataContexts.length).toBe(1)
        expect(dataContexts[0]).toEqual({ id: 'navigationContext', value: { popPath: { pop: 'value' } } })
      })

      afterAll(() => {
        setContextSpy.mockRestore()
      })
    })

    describe('when previous path has navigation context', () => {
      const toView = '/test'

      describe('when none navigation context is provided', () => {
        let setContextSpy: jest.SpyInstance<any>
        let t: ReturnType<typeof prepare>

        beforeAll(() => {
          t = prepare({ useTopItemWithNavigationContext: true })
          setContextSpy = jest.spyOn(t.topItemLocalContextsManager, 'setContext')
        })

        it('should not set the navigation context', () => {
          expect(t.topItemLocalContextsManager.getAllAsDataContext().length).toBe(1)

          t.navigator[type]({ route: toView, navigationContext: undefined })

          expect(setContextSpy).not.toHaveBeenCalled()

          const dataContexts = t.topItemLocalContextsManager.getAllAsDataContext()
          expect(dataContexts.length).toBe(1)
          expect(dataContexts[0]).toEqual({
            id: 'navigationContext',
            value: {
              [t.topItemNavigationContext.path]: t.topItemNavigationContext.value
            }
          })
        })

        afterAll(() => {
          setContextSpy.mockRestore()
        })
      })

      describe('when pop navigation context has path', () => {
        let setContextSpy: jest.SpyInstance<any>
        let t: ReturnType<typeof prepare>

        beforeAll(() => {
          t = prepare({ useTopItemWithNavigationContext: true })
          setContextSpy = jest.spyOn(t.topItemLocalContextsManager, 'setContext')
        })

        it('should merge the navigation context with the one passed on the pop call', () => {
          expect(t.topItemLocalContextsManager.getAllAsDataContext().length).toBe(1)

          t.navigator[type]({ route: toView, navigationContext: { path: 'popPath', value: { pop: 'value' } } })

          expect(setContextSpy).toHaveBeenCalledWith('navigationContext', { pop: 'value' }, 'popPath')

          const dataContexts = t.topItemLocalContextsManager.getAllAsDataContext()
          expect(dataContexts.length).toBe(1)
          expect(dataContexts[0]).toEqual({
            id: 'navigationContext',
            value: {
              [t.topItemNavigationContext.path]: t.topItemNavigationContext.value,
              popPath: {
                pop: 'value'
              }
            }
          })
        })

        afterAll(() => {
          setContextSpy.mockRestore()
        })
      })

      describe('when pop navigation context has no path', () => {
        let setContextSpy: jest.SpyInstance<any>
        let t: ReturnType<typeof prepare>

        beforeAll(() => {
          t = prepare({ useTopItemWithNavigationContext: true })
          setContextSpy = jest.spyOn(t.topItemLocalContextsManager, 'setContext')
        })

        it('should set the navigation context as the one passed on the pop call', () => {
          expect(t.topItemLocalContextsManager.getAllAsDataContext().length).toBe(1)

          t.navigator[type]({ route: toView, navigationContext: { path: '', value: { pop: 'value' } } })

          const dataContexts = t.topItemLocalContextsManager.getAllAsDataContext()
          expect(dataContexts.length).toBe(1)
          expect(dataContexts[0]).toEqual({
            id: 'navigationContext',
            value: {
              pop: 'value'
            }
          })
        })

        afterAll(() => {
          setContextSpy.mockRestore()
        })
      })
    })
  })
}
