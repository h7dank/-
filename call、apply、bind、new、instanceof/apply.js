function _apply(context) {
    if (typeof this !== 'function') {
        throw new TypeError('not a function')
    }

    context = context || window
    const tag = Symbol()
    context[tag] = this

    let args = [...arguments].slice(1)

    let res
    if (args.length === 0) {
        res = context[tag]()
    } else {
        res = context[tag](...args)
    }

    return res

}