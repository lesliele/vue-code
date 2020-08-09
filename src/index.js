import {initMixin} from './init.js';
import { lifecycleMixin } from './lifecycle.js';
import { renderMixin } from './vdom/index.js';

function Vue(options) {
    this._init(options); //入口方法，初始化操作
}

//写成插件进行扩展
initMixin(Vue);
lifecycleMixin(Vue);
renderMixin(Vue);

export default Vue;