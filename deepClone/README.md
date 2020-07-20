# 浅拷贝
创建一个新对象，这个对象有着原始对象属性值的一份精确拷贝。如果属性值为基本类型，则拷贝的就是基本类型的值，如果是引用类型，拷贝的是内存地址，如果一个对象改变了这个地址，就会影响到另一个对象

```
    function clone(target) {
        let cloneTarget = {}
        for(const key in target) {
            cloneTarget[key] = target[key]
        }
    }
```

# 深拷贝
将一个对象从内存中完整的拷贝一份出来，从堆内存中开辟一个新的区域存放新对象，且修改新对象不会影响原对象

### 乞丐版
```
    JSON.parse(JSON.stringfy(target))
```
这种写法非常简单，能应付大多数的场景，但是也有很大的缺陷，比如拷贝其他引用类型，拷贝函数，循环引用等

### 基础版本
+ 如果是原始类型，无需继续拷贝，直接返回
+ 如果是引用类型，创建一个新对象，遍历需要克隆的对象，将需要克隆的属性执行深拷贝之后依次添加到新对象上

```
    function deepClone(target) {
        if (typeof target === 'object') {
            let cloneTarget = {}
            for(const key in target) {
                cloneTarget[key] = deepClone(target[key])
            }
            return cloneTarget
        } else {
            return target
        }
    }
```

### 考虑数组

```
    function deepClone(target) {
        if (typeof target === 'object') {
            let cloneTarget = Array.isArray(target) ? [] : {}
            for(const key in target) {
                cloneTarget[key] = deepClone(target[key])
            }
            return cloneTarget
        } else {
            return target
        }
    }
```

### 考虑循环引用
解决循环引用问题，我们可以额外开辟一个存储空间，来存储当前对象和拷贝对象的对应关系，当需要拷贝当前对象的时候，先去存储空间找，如果有直接返回，如果没有，就继续拷贝，考虑到数据形式为key-value的类型，我们可以使用Map这种数据结构


```
    function deepClone(target, map = new Map()) {
        if (typeof target === 'object') {
            let cloneTarget = Array.isArray(target) ? [] : {}
            if (map.get(target)) {
                return map.get(target)
            }
            map.set(target, cloneTarget)
            for(const key in target) {
                cloneTarget[key] = deepClone(target[key])
            }
            return cloneTarget
        } else {
            return target
        }
    }
```


### 考虑其他类型
上面的代码只考虑数组和对象，实际上的引用类型还有很多

**合理的判断引用类型**

```
    function isObject(target) {
        return target !== null && (typeof target === 'object' || typeof target === 'function')
    }
```

**获取数据类型**
通过toString来判断准确的引用类型

```
    function getType(target) {
        return Object.prototype.toString.call(target)
    }
```
返回的结果一般为[object type]这样的形式，我们可以存储一些常用的类型，到时候来进行比较判断

