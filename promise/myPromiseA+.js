const PENDING = 'pending';
const FULFILLED = 'fulfilled';
const REJECTED = 'rejected';

/**
 * 运行一个为队列任务，把函数放入到为队列
 * @param {Function} callback
 */
function runMicroTask(callback) {
    if (globalThis.process) {
        process.nextTick(callback);
    } else if (MutationObserver) {
        const pDom = document.createElement('p');
        const observer = new MutationObserver(callback);
        observer.observe(pDom, {
            childList: true,
        });
        pDom.innerText = 'somethink';
    }
}

function isPromise(obj) {
    return !!(obj && typeof obj === 'object' && typeof obj.then === 'function');
}

class MyPromise {
    /**
     * 创建一个Promise
     * @param {Function} executor 任务执行器 立即执行
     */
    constructor(executor) {
        this._state = PENDING;
        this._value = undefined;
        this._handlers = []; // 处理函数形成的队列
        try {
            executor(this.#resolve.bind(this), this.#reject.bind(this));
        } catch (error) {
            this.#reject(error);
        }
    }

    /**
     * 将任务推入队列中
     * @param {Function} executor 每个状态需要执行的函数
     * @param {String} state 该函数什么状态下执行
     * @param {Function} 让then函数返回的promise成功
     * @param {Function} 让then函数返回的promise失败
     */
    #pushHandler(executor, state, resolve, reject) {
        this._handlers.push({
            executor,
            state,
            resolve,
            reject,
        });
    }

    /**
     * 执行任务队列
     */
    #runHandlers() {
        if (this._state === PENDING) return;
        while (this._handlers[0]) {
            const handler = this._handlers[0];
            this.#runOneHandler(handler);
            this._handlers.shift();
        }
    }

    /**
     * 处理一个任务
     * @param {Object} handler
     */
    #runOneHandler({ executor, state, resolve, reject }) {
        runMicroTask(() => {
            if (this._state !== state) {
                // 当前处理任务的状态与前面promise的状态不一致时
                return;
            }
            if (typeof executor !== 'function') {
                console.log(this._state);
                // 当前处理函数不是函数时 则表示没有后续处理，与前一个primise状态保持一致
                this._state === FULFILLED ? resolve(this._value) : reject(this._value);
                return;
            }
            try {
                const res = executor(this._value);
                if (isPromise(res)) {
                    res.then(resolve, reject);
                } else {
                    resolve(res);
                }
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     *
     * @param {Function} onFulfilled
     * @param {Function} onRejected
     * @returns
     */
    then(onFulfilled, onRejected) {
        return new MyPromise((resolve, reject) => {
            this.#pushHandler(onFulfilled, FULFILLED, resolve, reject);
            this.#pushHandler(onRejected, REJECTED, resolve, reject);
            this.#runHandlers(); // 如果当前任务状态已经是fulfilled 则执行后续任务
        });
    }

    /**
     * 变更任务状态
     * @param {String} newStatus 新状态
     * @param {any} value 相关数据
     */
    #changeStatus(newStatus, value) {
        if (this._state !== PENDING) {
            return;
        }
        this._state = newStatus;
        this._value = value;
        this.#runHandlers(); // 改变状态时执行后续任务
    }

    /**
     * 标记当前任务完成
     * @param {any} data 任务完成的相关数据
     */
    #resolve(data) {
        this.#changeStatus(FULFILLED, data);
    }

    /**
     * 标记当前任务失败
     * @param {any} reason 任务失败的相关数据
     */
    #reject(reason) {
        this.#changeStatus(REJECTED, reason);
    }
}

const pro = new MyPromise((resolve) => {
    setTimeout(() => {
        resolve(1);
    }, 1000);
});

pro.then((data) => {
    console.log(1);
}).then(() => {
    console.log(2);
});

pro.then((data) => {
    console.log(3);
}).then(() => {
    console.log(4);
});

// pro.then(
//     (data) => {
//         return new Promise((resolve) => {
//             resolve(2)
//         });
//     },
//     () => {}
// ).then((data) => {
//     console.log(data);
// });

// const p = new MyPromise((resolve) => {
//     setTimeout(() => {
//         resolve(1);
//     }, 3000);
// });
// console.log(p.then());

// const p1 = new Promise((resolve) => {
//     resolve(p);
// });
// p1.then((d) => console.log(d));
