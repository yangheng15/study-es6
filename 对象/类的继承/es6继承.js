class Parent {
    firstName = 'yang';

    speak() {
        console.log('说话', Parent.height);
    }

    static height = 180;
}

class Son extends Parent {}
const son = new Son();
console.log(son);
son.speak()
