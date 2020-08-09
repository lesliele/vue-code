const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*`; //标签名 
// ?:匹配不捕获
const qnameCapture = `((?:${ncname}\\:)?${ncname})`; //my:xx命名空间
const startTagOpen = new RegExp(`^<${qnameCapture}`); //标签开头的正则表达式 <name
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`); //匹配标签结尾 </div>
// 匹配属性 aaa="aaa" a='aa' a=aaa
const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`])))/;
const startTagClose = /^\s*(\/?)>/; //匹配标签结束的 /> >
const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g; //{{sd}}

export function parseHTML(html) {
    // 数据结构 树，栈，链表，队列
    function createASTElement(tagName, attrs) {
        return {
            tag: tagName,
            type: 1,
            children: [],
            attrs,
            parent: null
        }
    }
    let root;
    let currentParent;
    let stack = [];
    // 检测标签是否符合预期 <div>123<span><p></p></span></div> [div, span, p]
    function start(tagName, attrs) {
        let element = createASTElement(tagName, attrs);
        if (!root) {
            root = element;
        }
        currentParent = element;
        stack.push(element);
    }

    function end(tagName) { //创建父子关系
        let element = stack.pop(); //取出栈中最后一个
        currentParent = stack[stack.length - 1];
        if (currentParent) {
            element.parent = currentParent;
            currentParent.children.push(element);
        }
    }

    function chars(text) {
        text = text.trim();
        if (text) {
            currentParent.children.push({
                type: 3,
                text
            })
        }
    }
    while (html) { //只要html不为空字符串
        let textEnd = html.indexOf('<');
        if (textEnd == 0) {
            // 肯定是标签
            let startTagMatch = parseStartTag();
            if (startTagMatch) {
                start(startTagMatch.tagName, startTagMatch.attrs);
                continue;
            }
        }
        const endTagMatch = html.match(endTag);
        if (endTagMatch) {
            advance(endTagMatch[0].length);
            end(endTagMatch[1]);
            continue;
        }
        let text;
        if (textEnd > 0) { //是文本
            text = html.substring(0, textEnd);
        }
        if (text) {
            advance(text.length);
            chars(text);
        }
    }
    function advance(n) { //字符串截取
        html = html.substring(n);
    }
    function parseStartTag() {
        const start = html.match(startTagOpen);
        if (start) {
            const match = {
                tagName: start[1],
                attrs: []
            }
            advance(start[0].length); //删除开始标签 
            let end;
            let attr;
            // 不是结尾标签 能匹配到属性
            while (!(end = html.match(startTagClose)) && (attr = html.match(attribute))) {
                match.attrs.push({
                    name: attr[1],
                    value: attr[3] || attr[4] || attr[5] //3种情况
                });
                advance(attr[0].length); //去掉当前属性
            }
            if (end) {
                advance(end[0].length);
                return match;
            }
        }
    }
    return root;
}