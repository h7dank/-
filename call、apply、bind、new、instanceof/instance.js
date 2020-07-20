function _instanceOf(L, R) {
    L = L.__proto__
    R = R.prototype
    while(L) {
        if (L === R) {
            return true
        }
        L = L.__proto__
    }
    return false
}