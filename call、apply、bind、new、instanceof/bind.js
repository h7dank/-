function _bind(context) {
    if (typeof this !== 'function') {
        throw new TypeError('not a function')
    }
    const fn = this
    let args = [...arguments].slice(1)
    return function F() {
        if (this instanceof F) {
            return new fn(...args, ...arguments)
        }
        let res = fn.apply(context, args.concat(...arguments))
        return res
    }
}