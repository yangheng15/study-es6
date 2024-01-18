// Question 1
// const promise = new Promise((resolve, reject) => {
//     console.log(1);
//     resolve();
//     console.log(2);
// })

// promise.then(() => {
//     console.log(3);
// })

// console.log(4);

// Question 2
// const promise = new Promise((resolve, reject) => {
//     console.log(1);
//     setTimeout(() => {
//         console.log(2);
//         resolve();
//         console.log(3);
//     });
// });

// promise.then(() => {
//     console.log(4);
// });

// console.log(5);
// // 1 => 5 => 2 => 3 => 4

// Question 3
// const promise1 = new Promise((resolve, reject) => {
//     setTimeout(() => {
//         resolve();
//     }, 1000);
// });
// const promise2 = promise1.catch(() => {
//     return 2;
// });

// console.log('promise1', promise1);
// console.log('promise2', promise2);

// setTimeout(() => {
//     console.log('promise1', promise1);
//     console.log('promise2', promise2);
// }, 2000);
// 
// Question 4