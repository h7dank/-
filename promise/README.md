# 符合Promise/A+Promise

### Promise源码的实现

1. new Promise的时候，需要传递一个executor执行器， 执行器立即执行
2. executor 接受两个参数：resolve和reject
3. promise 有三个状态：pending, fullfilled, rejected
4. promise 只能从 pending 到 rejected，或者从 pending 到 resolved，状态一旦确定就不会改变
5. promise 都有 then 方法，then接受两个参数，分别是 promise 成功的回调 onFullfilled， 失败的回调 onRejected
6. 如果调用 then 时，promise 已经成功，则执行 onFullfilled，并将 promise 的值作为参数传递进去
                    如果 promise 已经失败，则执行 onRejected，并将 promise 失败的原因作为参数传递进去
                    如果 promise 状态为 pending，则需要将 onFullfilled 和 onRejected 函数存放起来，等状态确定好后再依次调用
7. then 的参数 onFullfilled 和 onRejected 可以缺省
8. promise 可以 then 很多次，promise 的 then 方法返回一个 promise
9. 如果 then 返回的是一个结果，那么就会把这个结果作为参数，传递给下一个 then 的成功的回调（onFullfilled）
10. 如果 then 中抛出了异常，那么就会把这个异常作为参数，传递给下一个 then 的失败的回调（onRejected）
11. 如果 then 返回的是一个 promise，那么会等这个 promise 执行完，promise 如果成功，就走下一个 then 的成功，如果失败，就走下一个 then 的失败



### promise的其它方法的源码实现

**Promise.resolve**
Promise.resovle(value)返回一个给定值解析后的Promise对象
1. 如果value是一个thenable对象，返回的promise会"跟随"这个thenable对象，采用它的最终形态
2. 如果传入的value本身就是promise对象，那么Promise.resolve将不做任何修改、原封不动地返回这个promise对象
3. 其它情况，直接返回以该值为成功状态的promise对象

**Promise.reject**
Promise.reject方法和Promise.resolve方法不同，Promise.reject()方法的参数，会原封不动地作为reject的理由，变为后续方法的参数

**Promise.prototype.catch**
Promise.prototype.catch用于指定出错时的回调，是特殊的then方法，catch之后，可以继续then

**Promise.prototype.finally**
不管是成功还是失败，都会走到finally中，并且finally之后还可以继续then。并且会将值原封不动的传递给后面的then

**Promise.all**
Promise.all(promises)返回一个promise对象
1. 如果传入的参数是一个空的可迭代对象，那么此promise对象回调完成(resolve)，只有此情况是同步执行，其他情况是异步执行
2. 如果传入的参数不包含任何promise，则返回一个异步完成
3. promises中所有promise在 所有promise都完成 或者 参数中不包括promise的时候回调完成
4. 如果传参数中有一个promise失败，那么Promise.all返回的promise对象失败
5. 在任何情况下返回的完成状态为一个数组

**Promise.race**
Promise.race函数返回一个Promise，它将于第一个传递的promise相同的方式被完成
如果传递数组为空，则永远等待




