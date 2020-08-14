import logger from 'logger'

describe('logger', () => {
  beforeEach(() => {
    globalMocks.log.mockClear()
  })

  it('should log warning and error messages by default', () => {
    logger.log('warn', 'test warning')
    expect(globalMocks.log).toHaveBeenLastCalledWith('warn', 'test warning')
    const error = new Error('test')
    logger.log('error', 'test error', error)
    expect(globalMocks.log).toHaveBeenLastCalledWith('error', 'test error', error)
  })

  it('should disable/enable logger', () => {
    logger.disable()
    logger.log('warn', 'test')
    expect(globalMocks.log).not.toHaveBeenCalled()
    logger.enable()
    logger.log('warn', 'test')
    expect(globalMocks.log).toHaveBeenCalled()
  })

  it('should not log info, expression or lifecycle messages by default', () => {
    logger.log('info', 'test info')
    logger.log('expression', 'test expression')
    logger.log('lifecycle', 'test lifecycle')
    expect(globalMocks.log).not.toHaveBeenCalled()
  })

  it('should change types to log', () => {
    logger.setTypesToLog(['expression', 'info', 'lifecycle'])
    logger.log('warn', 'test')
    logger.log('error', 'test')
    expect(globalMocks.log).not.toHaveBeenCalled()
    logger.log('info', 'test info')
    expect(globalMocks.log).toHaveBeenLastCalledWith('info', 'test info')
    logger.log('expression', 'test expression')
    expect(globalMocks.log).toHaveBeenLastCalledWith('expression', 'test expression')
    logger.log('lifecycle', 'test lifecycle')
    expect(globalMocks.log).toHaveBeenLastCalledWith('lifecycle', 'test lifecycle')
    logger.setTypesToLog(null)
  })

  it('should log info using the shortcut function', () => {
    logger.setTypesToLog(['info'])
    logger.info('msg1', { test: 'a' })
    expect(globalMocks.log).toHaveBeenLastCalledWith('info', 'msg1', { test: 'a' })
    logger.setTypesToLog(null)
  })

  it('should log warning using the shortcut function', () => {
    logger.warn('msg1', { test: 'a' })
    expect(globalMocks.log).toHaveBeenLastCalledWith('warn', 'msg1', { test: 'a' })
  })

  it('should log error using the shortcut function', () => {
    logger.error('msg1', { test: 'a' })
    expect(globalMocks.log).toHaveBeenLastCalledWith('error', 'msg1', { test: 'a' })
  })

  it('should use custom log function', () => {
    const custom = jest.fn()
    logger.setCustomLogFunction(custom)
    logger.log('warn', 'testing custom log function')
    expect(globalMocks.log).not.toHaveBeenCalled()
    expect(custom).toHaveBeenCalledWith('warn', 'testing custom log function')
    logger.setCustomLogFunction(null)
  })
})
