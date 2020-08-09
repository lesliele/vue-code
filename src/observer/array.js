// 数组原型上的方法(原来的方法)
let oldArrayProtoMethods = Array.prototype;

// 继承 __proto__
export let arrayMethods = Object.create(oldArrayProtoMethods);

let methods = [
    'push',
    'pop',
    'shift',
    'unshift',
    'reverse',
    'sort',
    'splice'
]

methods.forEach(method => {
    arrayMethods[method] = function(...args) {
        let result = oldArrayProtoMethods[method].apply(this, args);
        let inserted;
        let ob = this.__ob__;
        switch (method) {
            case 'push': //arr.push({a: 1}, {b: 2})
            case 'unshift': //这两个方法都是追加，追加的内容可能是对象类型,应该再次进行劫持
                inserted = args;
                break;
            case 'splice': //Vue.$set原理
                inserted = args.slice(2); //arr.splice(0, 1, {a: 1})
            default:
                break;
        }
        if (inserted) ob.observeArray(inserted);
        return result;
    }
})