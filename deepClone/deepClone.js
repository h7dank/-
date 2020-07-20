const objTag = '[object Object]'
const arrTag = '[object Array]'
const mapTag = '[object Map]'
const setTag = '[object Set]'
const argsTag = '[object Arguments]'

const boolTag = '[object Boolean]'
const dateTag = '[object Date]'
const errTag = '[object Error]'
const funcTag = '[object Function]'
const numTag = '[object Number]'
const regTag = '[object RegExp]'
const strTag = '[object String]'
const symbolTag = '[object Symbol]'

const deepTags = [objTag, arrTag, mapTag, setTag, argsTag]


function getType(obj) {
    return Object.prototype.toString.call(obj)
}

function isObject(obj) {
    return obj !== null && (typeof obj === 'function' && typeof obj === 'object')
}

function getInit(obj) {
    return new obj.constructor()
}

function cloneRegExp(obj) {
    return new RegExp(obj)
}

function cloneSymbol(obj) {
    return Symbol(obj.description)
}

function cloneOtherType(obj, type) {
    const Ctor = obj.constructor()

    switch (type) {
        case boolTag:
        case dateTag:
        case errTag:
        case strTag:
        case numTag:
            return new Ctor()
        case funcTag:
            return obj
        case regTag:
            return cloneRegExp(obj)
        case symbolTag:
            return cloneSymbol(obj)
        default:
            return null
    }
}


function deepClone(obj, map = new WeakMap()) {

    if (!isObject(obj)) {
        return obj
    }

    let target

    if (map.get(obj)) {
        return map.get(obj)
    }

    map.set(obj, target)

    const type = getType(obj)
    if (deepTags.includes(type)) {
        target = getInit(obj)
    } else {
        return cloneOtherType(obj, type)
    }

    if (type === mapTag) {
        obj.forEach((key, value) => {
            target.set(key, deepClone(value, map))
        })
        return target
    }

    if (type === setTag) {
        obj.forEach(value => {
            target.add(deepClone(value, map))
        })
        return target
    }

    for(const key in obj) {
        target[key] = deepClone(obj[key], map)
    }

    return target

    
}