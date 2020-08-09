import { observe } from "./observer/index";

export function initState (vm) {
    const opts = vm.$options;
    if (opts.props) {
        initProps(vm);
    }
    if (opts.methods) {
        initMethods(vm);
    }
    if (opts.data) {
        initData(vm);
    }
    if (opts.computed) {
        initComputed(vm);
    }
    if (opts.watch) {
        initWatch(vm);
    }
}
function initProps() {}
function initMethods() {}
function proxy (vm, data, key) {
    Object.defineProperty(vm, key, {
        get () {
            return vm[data][key];
        },
        set (newValue) {
            vm[data][key] = newValue;
        }
    })
}
function initData(vm) { //数据的初始化操作
    let data = vm.$options.data;
    vm._data = data = typeof data == 'function' ? data.call(this) : data;

    // 数据的劫持方案 对象Object,defineProperty
    // 数组 单独处理
    // 当在vm取属性时，将值代理到vm._data上
    for (let key in data) {
        proxy(vm, '_data', key);
    }

    observe(data);
}
function initComputed() {}
function initWatch() {}