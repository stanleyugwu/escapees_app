const timeoutRejector = (timeout = 1000) => {
    return new Promise((_,reject) => {
        setTimeout(() => {
            reject('__REQUEST_TIMEOUT__')
        }, timeout)
    })
}

export default timeoutRejector