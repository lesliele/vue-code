import { parseHTML } from "./parse.js";
import { generate } from './generate.js';

export function compileToFunctions(template) {
    // html模板 => render函数
    // 1.需要将html代码转为 AST语法树，可以用AST语法树来描述语音本身(虚拟DOM是用对象来描述节点的)

    // 前端必须掌握的数据结构(树)
    let ast = parseHTML(template);
    // 2.优化静态节点

    // 3.通过这颗树，重新生成代码
    // <div id="app" style="color: red;">
    // hello{{name}}
    // <span>hello</span>
    // </div>
    // render () {
    // return _c('div', {
    //     id: 'app',
    //     style: {
    //         color: 'red'
    //     }
    // }, _v('hello' + _s(name)), _c('span', null, _v('hello')))
    // }
    let code = generate(ast);
    // 4.将字符串生成函数 限制取值范围 通过with来取值
    let render = new Function(`with(this){return ${code}}`);
    
    return render;
}