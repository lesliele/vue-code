import { initState } from "./state.js";
import { compileToFunctions } from './compiler/index';
import { mountComponent } from './lifecycle.js';

export function initMixin(Vue) {
    Vue.prototype._init = function (options) {
        const vm = this;
        vm.$options = options;
        // 数据做劫持
        // vue组件很多状态 data props watch
        initState(vm);
        // vue的核心特性 响应式数据原理
        // Vue是一个什么样的框架，不是MVVM框架，是借鉴MVVM框架
        // 数据变化视图会更新，视图变化数据会被影响
        // (MVVM)是指不能跳过数据去更新视图,但是vue有类似$ref直接去修改视图内容

        // 如果当前有el属性说明要渲染模板
        if (vm.$options.el) {
            vm.$mount(vm.$options.el)
        }
    }
    Vue.prototype.$mount = function(el) {
        // 挂载操作
        const vm = this;
        const options = vm.$options;
        el = document.querySelector(el);
        vm.$el = el;

        if (!options.render) {
            let template = options.template;
            if (!template && el) {
                template = el.outerHTML;
            }
            // 编译原理，将模板编译成render
            const render = compileToFunctions(template);
            options.render = render;
        }
        mountComponent(vm, el);
    }
}