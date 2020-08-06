import { BeagleLogConfig, LogType } from './types'


const logColors = {
    info: '#FF5733',
    success: '#71882A',
    lifecycle: '#BF80FD',
    expression: '#1532C1',
}

function createBeagleLogger() {
    let beagleLogConfig: BeagleLogConfig

    function printLog<T>(message: T, type: LogType): void {
        if (beagleLogConfig.mode === 'development' && beagleLogConfig.debug?.includes(type)) {
            if (type === 'error' || type === 'warn') {
                console[type](`Beagle (${type.toLowerCase()}) : ${message}`)
                return
            }
            console.log(`%c Beagle (${type.toLowerCase()}) : ${message}`, `color: ${logColors[type]}`)
        }
    }

    return {
        setConfig: (logConfig: BeagleLogConfig) => beagleLogConfig = logConfig,
        addType: (type: LogType) => (beagleLogConfig.debug?.push(type)),
        log: printLog,
    }
}

const beagleLogger = createBeagleLogger()

export default beagleLogger
