class Chess {
    a = 1;
    b = 2;
    c = 3;
    //  字段初始化器 es7 相当于在构造器里写
    constructor(props) {
        // this.a = 1;
        // this.b = 2;
        // this.c = 3;
        // this.print = () => {
        //     console.log(this.a);
        // }
    }

    static width = 50; // 字段初始化器 es7

    static height = 50; // 字段初始化器 es7

    static method() {} // es6提供的

    // 有的时候为了绑定this指向 我们会写箭头函数
    print = () => {
        console.log(this.a);
    };

    setColor() {
        console.log('设置棋子的颜色', this.a);
    }
}
const chess = new Chess({a: 1, b: 2, c: 3});
console.log(chess);
const p = chess.print;
p(); // 1
// console.log(Chess.width, Chess.height);
/**
 *
 * print这个是字段初始化器的写法 当前的方法并不再原型上，而是在实例上，
 * 并且每次创建实例的时候都会创建在实例对象中，造成了内存浪费。但可以绑定this
 */
