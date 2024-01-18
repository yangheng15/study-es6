// var arr = new Array(1000).fill(1);
// 可迭代对象
var obj = {
    [Symbol.iterator]() {
        return {
            i: 0,
            next: function () {
                const value = this.i;
                const res = {
                    value,
                    done: value > 10 ? true : false
                };
                this.i++;
                return res;
            }
        }
    }
}
for (const it of obj) {
    console.log(it)
}

console.time();
// for (let i = 0; i < arr.length; i++) {
//     console.log(i);
// }
// arr.forEach((element, i) => {
//     console.log(i)
// });
// arr.reduce((total, cur) => {
//     console.log(cur)
// }, null)
console.timeEnd();