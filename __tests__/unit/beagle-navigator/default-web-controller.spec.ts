import defaultWebController from 'beagle-navigator/default-web-controller'
import { createBeagleViewMock } from '../old-structure/utils/test-utils'

describe('Default navigation controller for web applications', () => {
  it('should render the loading component', () => {
    const view = createBeagleViewMock()
    const loadingComponent = { _beagleComponent_: 'custom:loading' }
    defaultWebController.onLoading(view, jest.fn())
    expect(view.getRenderer().doFullRender).toHaveBeenCalledWith(loadingComponent)
  })

  it('should complete the navigation on loading', () => {
    const view = createBeagleViewMock()
    const completeNavigation = jest.fn()
    defaultWebController.onLoading(view, completeNavigation)
    expect(completeNavigation).toHaveBeenCalled()
  })

  it('should render the error component with details and retry option', () => {
    const view = createBeagleViewMock()
    const error = new Error('test')
    const retry = jest.fn()
    const errorComponent = { _beagleComponent_: 'custom:error', errors: [error], retry }
    defaultWebController.onError(view, error, retry, jest.fn())
    expect(view.getRenderer().doFullRender).toHaveBeenCalledWith(errorComponent)
  })

  it('should render the resulting UI', () => {
    const view = createBeagleViewMock()
    const result = { _beagleComponent_: 'beagle:container' }
    defaultWebController.onSuccess(view, result)
    expect(view.getRenderer().doFullRender).toHaveBeenCalledWith(result)
  })
})
