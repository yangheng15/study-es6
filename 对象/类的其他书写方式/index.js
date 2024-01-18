class Test {
    a = 123; // 实例上的属性
    #b = 345; // 实例上的私有属性
    static #c = 567; // Test方法上的静态私有属性
    static #stmethod() { // Test方法上的静态私有方法
        console.log(this.#c);
        console.log('这是私有静态方法');
    }
    static print() { // Test方法上的静态方法
        this.#stmethod();
    }

    #method() { // 实例上的私有方法
        console.log('这是私有方法');
    }
    print() { // 原型上的共有方法
        console.log(this.#b);
        this.#method();
    }
}
const test = new Test();
console.log(test);
console.dir(Test);
Test.print()
