class Animal {
    constructor(type, name, age, sex) {
        this.type = type;
        this.name = name;
        this.age = age;
        this.sex = sex;
    }

    get age() {
        return this._age + '岁';
    }

    set age(age) {
        if (age < 0) {
            age = 0;
        } else if (age > 1000) {
            age = 1000;
        }
        this._age = age; // 必须使用另一个属性来接受 直接设置age会导致无限循环
    }

    // 也可以通过get 设置公共属性
    get jiao() {
        return function () {
            console.log('叫叫叫');
        };
    }
}
const an = new Animal('狗', '旺财', 3, '男');
console.log(an);
an.jiao()
