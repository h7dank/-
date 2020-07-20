function _call(context) {
    if (typeof this !== 'function') {
        throw new TypeError('not a function')
    }

    context = context || window
    
    const tag = Symbol()
    context[tag] = this

    let args = [...arguments].slice(1)

    let res = context[tag](...args)

    delete context[tag]

    return res
}