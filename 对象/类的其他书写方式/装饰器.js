// 装饰器
class Test {
    @Obsolete
    print() {
        console.warn('print方法已被废弃');
        console.log('print方法。。。');
    }
}

function Obsolete(terget, methodName, descriptror) {
    // function Test
    // print
    // {value: function print() {}, ...}
    // console.log(terget, methodName, descriptro);
    const oldFunc = descriptror.value;
    descriptror.value = function (...args) {
        console.warn('print方法已被废弃');
        oldFunc.apply(this, args);
    };
}
