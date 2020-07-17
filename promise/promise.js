const FULLFILLED = 'fullfilled'
const REJECTED = 'rejected'
const PENDING = 'pending'

function promise(executor) {
    const that = this
    that.status = PENDING
    that.resolveCallbacks = []
    that.rejectedCallbacks = []

    function resolve(value) {
        setTimeout(() => {
            if (that.status === PENDING) {
                that.status = FULLFILLED
                that.value = value
                that.resolveCallbacks.forEach(fn => fn(that.value))
            }   
        });
    }

    function reject(reason) {
        setTimeout(() => {
            if (that.status === PENDING) {
                that.status = REJECTED
                that.reason = reason
                that.rejectedCallbacks.forEach(fn => fn(that.vallue))
            }   
        });
    }

    try {
        executor(resolve, reject)
    } catch (e) {
        reject(e)
    }
}

promise.prototype.then = function(onFullfilled, onRejectd) {
    const that = this
    onFullfilled = typeof onFullfilled === 'function' ? onFullfilled : v => v
    onRejectd = typeof onRejectd === 'function' ? onRejectd : r => { throw r }

    let promise2 = new promise((resolve, reject) => {
        if (that.status === FULLFILLED) {
            setTimeout(() => {
                try {
                    let x = onFullfilled(that.value)
                    resolvePromise(promsie2, x, resolve, reject)
                } catch (e) {
                    reject(e)
                }
            });
        } else if (that.status === REJECTED) {
            setTimeout(() => {
                try {
                    let x = onRejectd(that.reason)
                    resolvePromise(promsie2, x, resolve, reject)
                } catch (e) {
                    reject(e)
                }
            });
        } else if (that.status === PENDING) {
            that.resolveCallbacks.push(() => {
                setTimeout(() => {
                    try {
                        let x = onFullfilled(that.value)
                        resolvePromise(promsie2, x, resolve, reject)
                    } catch (e) {
                        reject(e)
                    }
                });
            })
            that.rejectedCallbacks.push(() => {
                setTimeout(() => {
                    try {
                        let x = onRejectd(that.reason)
                        resolvePromise(promsie2, x, resolve, reject)
                    } catch (e) {
                        reject(e)
                    }
                });
            })
        }
    })

    return promise2
}

function resolvePromise(promise2, x, resolve, reject) {
    if (promise2 === x) {
        throw new TypeError('chain cycle')
    }

    if (x && typeof x === 'object' || typeof x === 'function') {
        let used
        try {
            let then = x.then
            if (typeof then === 'function') {
                then.call(x, y => {
                    if (used) return
                    used = true
                    resolvePromise(promsie2, y, resolve, reject)
                }, r => {
                    if (used) return
                    used = true
                    reject(r)
                })
            } else {
                if (used) return
                used = true
                resolve(x)
            }
        } catch(e) {
            if (used) return
            used = true
            reject(e)
        }
    } else {
        resolve(x)
    }
}

promise.resolve(value) = function(value) {
    if (value instanceof promise) {
        return value
    }
    return new promise((resolve, reject) => {
        if (value && value.then && typeof value.then === 'function') {
            setTimeout(() => {
                value.then(resolve, reject)
            });
        } else  {
            resolve()
        }
    })
}

promise.reject = function(reason) {
    return new promise((resolve, reject) => {
        reject(reason)
    })
}

promise.prototype.catch = function(onRejectd) {
    return this.then(null, onRejectd)
}

promise.prototype.finally = function(callback) {
    return this.then(value => {
        return new promise(callback()).then(() => {
            return value
        })
    }, reason => {
        return new promise(callback()).then(() => {
            throw { reason }
        })
    })
}

promise.all = function(promises) {
    promises = Array.from(promises)
    return new promise((resolve, reject) => {
        let result = []
        let index = 0
        if (promises.length === 0) {
            resolve(result)
        }

        function processPromise(data, i) {
            result[i] = data
            if (++index === promises.length) {
                resolve(result)
            }
        }

        for(let i = 0; i < promises.length; i++) {
            promise.resolve(promises[i]).then(value => {
                processPromise(value, i)
            }, err => {
                reject(err)
                return
            })
        }
    })
}

promise.race = function(promises) {
    promises = Array.from(promises)

    return new promise((resolve, reject) => {
        if (promises.length === 0) {
            return
        }
        for(let i = 0; i < promises.length; i++) {
            promise.resolve(promises[i]).then(value => {
                resolve(value)
                return
            }, err => {
                reject(err)
                return
            })
        }
    })
}