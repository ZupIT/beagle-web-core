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
        if (beagleLogConfig.mode === 'development' && beagleLogConfig.debug && beagleLogConfig.debug.includes(type)) {
            const parsedMessage = typeof(message) === 'object' ? JSON.stringify(message) : message
            if (type === 'error' || type === 'warn') {
                console[type](`Beagle (${type.toLowerCase()}) : ${parsedMessage}`)
                return
            }
            console.group(`%c Beagle (${type.toLowerCase()})`, `color: ${logColors[type]}`)
            console.log(parsedMessage)
            console.groupEnd()
        }
    }

    return {
        setConfig: (logConfig: BeagleLogConfig) => beagleLogConfig = logConfig,
        addType: (type: LogType) => (beagleLogConfig.debug ? beagleLogConfig.debug.push(type) : null),
        log: printLog,
    }
}

const beagleLogger = createBeagleLogger()

export default beagleLogger
