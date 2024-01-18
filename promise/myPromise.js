const MyPromise = (() => {

    const PENDING = 'pending',
        REJECTED = 'rejected', 
        RESOLVED = 'resolved',
        PromiseState = Symbol('PromiseState'),
        PromiseValue = Symbol('PromiseValue'),
        thenables = Symbol('thenables'), // thenables
        catchables = Symbol('catchables'), // catchables
        changeStatus = Symbol('changeStatus'),
        settleHandle = Symbol('settleHandle'),
        linkPromise = Symbol('linkPromise');


    return class {


        /**
         * 
         * @param {*} newStatus 
         * @param {*} newValue 
         * @param {*执行队列的函数} queue 
         */
        [changeStatus](newStatus, newValue, queue) {
            if(this[PromiseState] !== PENDING) {
                return;
            }
            this[PromiseState] = newStatus;
            this[PromiseValue] = newValue;
            
            //执行相应队列的中的函数
            queue.forEach(handler => handler(newValue))
        }

        constructor(executor) {
            // console.log(executor);
            this[PromiseState] = PENDING;
            this[PromiseValue] = undefined;
            this[thenables] = [];
            this[catchables] = [];

            const resolve = (data) => {
                this[changeStatus](RESOLVED, data, this[thenables]);//执行resove 变成已决状态
            }
            
            const reject = (reason) => {
                this[changeStatus](REJECTED, reason, this[catchables]);
            }

            //如果promise中的函数报错就直接执行reject
            try{
                executor(resolve, reject)
            }
            catch(err) {
                reject(err)
            }
        }

        /**
         * 
         * @param {后续处理函数} handler 
         * @param {需要立即执行的状态} immediatelyStatus 
         * @param {作业队列} queue 
         */
        [settleHandle](handler, immediatelyStatus, queue) {
            if(typeof handler !== 'function') {
                return;
            }
            if(this[PromiseState] === immediatelyStatus) {
                //如果里面是resolved 说明executor函数中没有异步代码
                setTimeout(() => {
                    handler(this[PromiseValue]);
                }, 0);
            }else {
                queue.push(handler)
            }
        }

        [linkPromise](thenable, catchable) {
            return new MyPromise((resolve, reject) => {
                this[settleHandle](data => {
                    try{
                        const result = thenable(data);
                        resolve(result);
                    }
                    catch(err) {
                        reject(err);
                    }
                   
                }, RESOLVED, this[thenables])

                this[settleHandle](data => {
                    try{
                        const result = catchable(data);
                        resolve(result);
                    }
                    catch(err) {
                        reject(err)
                    }
                }, REJECTED, this[catchables])
            })
        }

        then(thenable, catchable) {
            return this[linkPromise](thenable, catchable)
        }

        catch(catchable) {
            return this[linkPromise](undefined, catchable)
        }

    }
})()