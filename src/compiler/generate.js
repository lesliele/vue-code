const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g; //{{sd}}

function genProps(attrs) {
    // id "app" / style "fontSize:12px;color:red"
    let str = '';
    for (let i = 0; i < attrs.length; i++) {
        let attr = attrs[i];
        if (attr.name === 'style') {
            let obj = {};
            attr.value.split(';').forEach(item => {
                let [key, value] = item.split(":");
                obj[key] = value;
            });
            attr.value = obj;
        }
        str += `${attr.name}:${JSON.stringify(attr.value)},`;
    }
    return `{${str.slice(0, -1)}}`
}

function gen(node) {
    if (node.type == 1) {
        return generate(node); //节点
    } else {
        let text = node.text;

        let tokens = []; //存放每一段的代码
        let lastIndex = defaultTagRE.lastIndex = 0; //正则表达式是全局的，必须每次重置为0
        let match,index; //每次匹配到的结果

        while(match = defaultTagRE.exec(text)) {
            index = match.index; //保存匹配到的索引
            if (index > lastIndex) {
                tokens.push(JSON.stringify(text.slice(lastIndex, index)))
            }
            tokens.push(`_s(${match[1].trim()})`);
            lastIndex = index + match[0].length;
        }
        if (lastIndex < text.length) {
            tokens.push(JSON.stringify(text.slice(lastIndex)));
        }
        return `_v(${tokens.join('+')})`;
    }
}

function genChildren(el) {
    const children = el.children;
    if (children) {
        return children.map(child => gen(child)).join(',');
    }
}

export function generate(el) {
    let children = genChildren(el);
    let code = `_c('${el.tag}',${
        el.attrs.length ? `${genProps(el.attrs)}` : 'undefined'
    }${
        children?`,${children}`:''
    })`;

    return code;
}