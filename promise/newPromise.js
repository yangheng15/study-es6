const MyPromise = (() => {
    const PENDING = 'pending',
        REJECTED = 'rejected',
        RESOLVED = 'resolved',
        PromiseState = Symbol('PromiseState'),
        PromiseValue = Symbol('PromiseValue'),
        changeStatus = Symbol('changeStatus'),
        thenables = Symbol('thenables'), // thenables
        catchables = Symbol('catchables'), // catchables
        settleHandle = Symbol('settleHandle'),
        linkPromise = Symbol('linkPromise');

    return class MyPromise {
        [changeStatus](status, value, queue) {
            if (this[PromiseState] !== PENDING) {
                return; // 只有 pending 可以推向 已决状态
            }
            this[PromiseState] = status;
            this[PromiseValue] = value;
            queue.forEach((callback) => {
                callback(value);
            });
        }

        [settleHandle](handler, status, queue) {
            if (typeof handler !== 'function') {
                return;
            }

            if (this[PromiseState] === status) {
                setTimeout(() => {
                    handler(this[PromiseValue]);
                }, 0);
                return;
            }
            queue.push(handler);
        }

        [linkPromise](thenable, catchable) {
            const execu = (data, resolve, reject, handler) => {
                try {
                    const result = handler(data);
                    if (result instanceof MyPromise) {
                        result.then(
                            (val) => {
                                resolve(val);
                            },
                            (err) => {
                                reject(err);
                            }
                        );
                    } else {
                        resolve(result);
                    }
                } catch (e) {
                    reject(e);
                }
            };
            return new MyPromise((resolve, reject) => {
                this[settleHandle](
                    (data) => {
                        execu(data, resolve, reject, thenable);
                    },
                    RESOLVED,
                    this[thenables]
                );
                this[settleHandle](
                    (data) => {
                        execu(data, resolve, reject, catchable);
                    },
                    REJECTED,
                    this[catchables]
                );
            });
        }
        /**
         *
         * @param {*} executor
         */
        constructor(executor) {
            this[PromiseState] = PENDING;
            this[PromiseValue] = undefined;
            this[thenables] = [];
            this[catchables] = [];

            const resolve = (val) => {
                this[changeStatus](RESOLVED, val, this[thenables]);
            };

            const reject = (val) => {
                this[changeStatus](REJECTED, val, this[catchables]);
            };

            try {
                executor(resolve, reject);
            } catch (e) {
                reject(e);
            }
        }

        then(thenable, catchable) {
            // this[settleHandle](thenable, RESOLVED, this[thenables])
            // this.catch(catchable);
            return this[linkPromise](thenable, catchable);
        }

        catch(catchable) {
            // this[settleHandle](catchable, REJECTED, this[catchables]);
            return this[linkPromise](undefined, catchable);
        }

        static resolve(data) {
            if (data instanceof MyPromise) {
                return data;
            } else {
                return new MyPromise((resolve) => {
                    resolve(data);
                });
            }
        }

        static reject(reason) {
            return new MyPromise((resolve, reject) => {
                reject(data)
            })
        }

        static all(params) {
            return new MyPromise((resolve, reject) => {
                const result = params.map((p) => {
                    const obj = {
                        result: undefined,
                        isResolved: false
                    };

                    p.then((res) => {
                        obj.result = res;
                        obj.isResolved = true;
                        const unResolved = result.filter(r => !r.isResolved);
                        if(unResolved.length === 0) {
                            resolve(result.map(item => (item.result)))
                        }
                    }, (err) => {
                        reject(err)
                    })
                    
                    return obj

                })
            })
        }

        static race(params) {
            return new MyPromise((resolve, reject) => {
                params.forEach(p => {
                    p.then(res => {
                        resolve(res)
                    }, reason => {
                        reject(reason)
                    })
                });
            })
        }
    };
})();
