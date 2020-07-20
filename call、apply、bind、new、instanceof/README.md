call apply bind new instanceof 这些常见的方法放一起，代码量都不算大

# call
```
    Function.prototype.myCall = function(context) {
        if (typeof this !== 'function') {
            throw new TypeError('error')
        }
        context = context || window
        context.fn = this
        const args = [...arguments].slice(1)
        const result = context.fn(...args)
        delete context.fn
        return result
    }
```
+ 首先context为可选参数，如果不穿值的话默认上下文为window
+ 接下来context创建一个fn属性，并将值设置为需要调用的函数
+ 因为call可以传入多个参数作为调用函数的参数，所以需要把参数剥离出来
+ 然后调用函数并将对象上的函数删除

# apply

```
    Function.prototype.myApply = function(context) {
        if (typeof this !== 'function') {
            throw new TypeError('error')
        }
        context = context || window
        context.fn = this
        let result
        if (arguments[1]) {
            result = context.fn()
        } else {
            result = context.fn(...arguments[1])
        }
        delete context.fn
        return result
    }
```
apply的实现类似，不同的是对参数的处理

# bind

```
    Function.prototype.myBind = function(context) {
        if (typeof this !== 'function') {
            throw new TypeError('error')
        }
        const that = this
        const args = [...arguments].slice(1)
        return function F() {
            if (this instanceof F) {
                return new that(...args, ...arguments)
            }
            return that.apply(context, args.concat(...arguments))
        }
    }
```

+ 前几步实现差不多
+ bind返回一个函数，对于函数来说有两种调用方式，一种是直接调用，另一种是通过new来调用
+ 对于直接调用来说，这里选择了apply的方式实现，但是对于参数情况需要注意以下情况：因为bind可以实现类似
代码 f.bind(obj, 1)(2)，所以我们需要将两边的参数拼接起来，所以就有了这样的实现args.concat(...arguments)
+ 最后来说通过new的方式，我们学习过如果判断this，对于new来说，不会被任何方式改变this，对于这种情况我们需要忽略传入的this

# new

```
    function myNew() {
        let obj = {}
        let con = [].shift.call(arguments)
        obj.__proto__ = con.prototype
        let result = con.apply(obj, arguments)
        return result instanceof Object ? result : obj
    }
```

+ new操作符会返回一个对象，所以我们需要在内部新建一个对象
+ 这个对象，也就是构造函数中的this，可以访问挂载到this上的任意属性
+ 这个对象可以访问到构造函数上的属性，所以需要将构造函数与对象链接起来
+ 返回原始值需要忽略，返回对象需要正常处理

# instanceOf

```
    function myInstanceof(left, right) {
        let prototype = right.prototype
        left = left.__proto__
        while(true) {
            if (left === null || left === undefined) {
            return false
            } 
            if (prototype === left) {
            return true
            }
            left = left.__proto__
        }
    }
```
+ 首先获取类型的原型
+ 然后获得对象的原型
+ 然后一直循环判断对象的原型是否等于类型的原型，直到对象的原型为null，因为原型链最终为null
