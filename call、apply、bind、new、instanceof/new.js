function _new(executor) {
    let args = [...arguments].slice(1)
    let obj = Object.create(null)
    obj.__proto__ = executor.prototype
    let res = executor.apply(obj, args)
    return res instanceof Object ? res : obj
}