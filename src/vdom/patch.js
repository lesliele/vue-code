export function patch(old, vnode) {

    let el = createEle(vnode);
    let parentElm = old.parentNode;
    parentElm.insertBefore(el, old.nextSibling);
    parentElm.removeChild(old);
}

function createEle(vnode) {
    let {tag, children, key, data, text} = vnode;
    if (typeof tag === 'string') {
        vnode.el = document.createElement(tag);
        children.forEach(child => {
            vnode.el.appendChild(createEle(child));
        })
    } else {
        vnode.el = document.createTextNode(text);
    }
    return vnode.el;
}