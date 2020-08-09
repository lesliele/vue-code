import { arrayMethods } from './array.js';

class Observer{
    constructor(value) {
        // 使用defineProperty重新定义熟悉，区分数组
        
        // 判断一个对象是否被观测 __ob__
        Object.defineProperty(value, '__ob__', {
            enumerable: false, //不可枚举
            configurable: false,
            value: this
        })
        if (Array.isArray(value)) {
            // 调用push,shift,unshift,sort,reverse pop
            // 函数劫持，切片编程
            value.__proto__ = arrayMethods;
            // 观测数组中的对象类型，对象变化也要监测
            this.observeArray(value);
        } else {
            this.walk(value);
        }
    }
    observeArray (value) {
        value.forEach(item => {
            observe(item); //观测数组中的对象类型
        })
    }
    walk(data) {
        let keys = Object.keys(data);
        keys.forEach(key => {
            defineReactive(data, key, data[key]);
        });
    }
}

function defineReactive(data, key, value) {
    observe(value); //如果值是对象继续监测
    Object.defineProperty(data, key, {
        get () {
            return value;
        },
        set (newValue) {
            if (newValue == value) return;
            observe(newValue); //如果用户将值设置为对象继续监测
            value = newValue;
        }
    })
}

export function observe (data) {
    // data不能是非对象或者为null
    if (typeof data !== 'object' || data === null) {
        return data;
    }
    if (data.__ob__) {
        return data;
    }
    return new Observer(data);
}