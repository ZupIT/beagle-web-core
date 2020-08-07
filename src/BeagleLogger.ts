import { BeagleLogConfig, LogType } from './types'

type consoleType = 'error' | 'warn' | 'log'

interface LogInterface {
    error: consoleType,
    warn: consoleType,
    info: consoleType,
    success: consoleType,
    lifecycle: consoleType,
    expression: consoleType,
}

const log: LogInterface = {
    error: 'error',
    warn: 'warn',
    info: 'log',
    success: 'log',
    lifecycle: 'log',
    expression: 'log',
}

const logColors = {
    info: '#FF5733',
    success: '#71882A',
    lifecycle: '#BF80FD',
    expression: '#1532C1',
    error: '#AF0F0F',
    warn: '#DBCA1C',
}

function createBeagleLogger() {
    let beagleLogConfig: BeagleLogConfig

    function printLog<T>(type: LogType, ...logItens: T[]): void {
        if (beagleLogConfig.mode === 'development' && beagleLogConfig.debug && beagleLogConfig.debug.includes(type)) {
            console.groupCollapsed(`%c Beagle (${type.toLowerCase()})`, `color: ${logColors[type]}`)
            logItens.forEach(i => console[log[type]](i))
            console.groupEnd()
        }
    }

    return {
        setConfig: (logConfig: BeagleLogConfig) => beagleLogConfig = logConfig,
        addType: (type: LogType) => (beagleLogConfig.debug && !beagleLogConfig.debug.includes(type) ? beagleLogConfig.debug.push(type) : null),
        log: printLog,
    }
}

const beagleLogger = createBeagleLogger()

export default beagleLogger
