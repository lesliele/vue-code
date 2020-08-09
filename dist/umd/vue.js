(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Vue = factory());
}(this, (function () { 'use strict';

  function _typeof(obj) {
    "@babel/helpers - typeof";

    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function (obj) {
        return typeof obj;
      };
    } else {
      _typeof = function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
  }

  function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
  }

  function _iterableToArrayLimit(arr, i) {
    if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return;
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"] != null) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
  }

  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;

    for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

    return arr2;
  }

  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  // 数组原型上的方法(原来的方法)
  var oldArrayProtoMethods = Array.prototype; // 继承 __proto__

  var arrayMethods = Object.create(oldArrayProtoMethods);
  var methods = ['push', 'pop', 'shift', 'unshift', 'reverse', 'sort', 'splice'];
  methods.forEach(function (method) {
    arrayMethods[method] = function () {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      var result = oldArrayProtoMethods[method].apply(this, args);
      var inserted;
      var ob = this.__ob__;

      switch (method) {
        case 'push': //arr.push({a: 1}, {b: 2})

        case 'unshift':
          //这两个方法都是追加，追加的内容可能是对象类型,应该再次进行劫持
          inserted = args;
          break;

        case 'splice':
          //Vue.$set原理
          inserted = args.slice(2);
      }

      if (inserted) ob.observeArray(inserted);
      return result;
    };
  });

  var Observer = /*#__PURE__*/function () {
    function Observer(value) {
      _classCallCheck(this, Observer);

      // 使用defineProperty重新定义熟悉，区分数组
      // 判断一个对象是否被观测 __ob__
      Object.defineProperty(value, '__ob__', {
        enumerable: false,
        //不可枚举
        configurable: false,
        value: this
      });

      if (Array.isArray(value)) {
        // 调用push,shift,unshift,sort,reverse pop
        // 函数劫持，切片编程
        value.__proto__ = arrayMethods; // 观测数组中的对象类型，对象变化也要监测

        this.observeArray(value);
      } else {
        this.walk(value);
      }
    }

    _createClass(Observer, [{
      key: "observeArray",
      value: function observeArray(value) {
        value.forEach(function (item) {
          observe(item); //观测数组中的对象类型
        });
      }
    }, {
      key: "walk",
      value: function walk(data) {
        var keys = Object.keys(data);
        keys.forEach(function (key) {
          defineReactive(data, key, data[key]);
        });
      }
    }]);

    return Observer;
  }();

  function defineReactive(data, key, value) {
    observe(value); //如果值是对象继续监测

    Object.defineProperty(data, key, {
      get: function get() {
        return value;
      },
      set: function set(newValue) {
        if (newValue == value) return;
        observe(newValue); //如果用户将值设置为对象继续监测

        value = newValue;
      }
    });
  }

  function observe(data) {
    // data不能是非对象或者为null
    if (_typeof(data) !== 'object' || data === null) {
      return data;
    }

    if (data.__ob__) {
      return data;
    }

    return new Observer(data);
  }

  function initState(vm) {
    var opts = vm.$options;

    if (opts.props) ;

    if (opts.methods) ;

    if (opts.data) {
      initData(vm);
    }

    if (opts.computed) ;

    if (opts.watch) ;
  }

  function proxy(vm, data, key) {
    Object.defineProperty(vm, key, {
      get: function get() {
        return vm[data][key];
      },
      set: function set(newValue) {
        vm[data][key] = newValue;
      }
    });
  }

  function initData(vm) {
    //数据的初始化操作
    var data = vm.$options.data;
    vm._data = data = typeof data == 'function' ? data.call(this) : data; // 数据的劫持方案 对象Object,defineProperty
    // 数组 单独处理
    // 当在vm取属性时，将值代理到vm._data上

    for (var key in data) {
      proxy(vm, '_data', key);
    }

    observe(data);
  }

  var ncname = "[a-zA-Z_][\\-\\.0-9_a-zA-Z]*"; //标签名 
  // ?:匹配不捕获

  var qnameCapture = "((?:".concat(ncname, "\\:)?").concat(ncname, ")"); //my:xx命名空间

  var startTagOpen = new RegExp("^<".concat(qnameCapture)); //标签开头的正则表达式 <name

  var endTag = new RegExp("^<\\/".concat(qnameCapture, "[^>]*>")); //匹配标签结尾 </div>
  // 匹配属性 aaa="aaa" a='aa' a=aaa

  var attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`])))/;
  var startTagClose = /^\s*(\/?)>/; //匹配标签结束的 /> >

  function parseHTML(html) {
    // 数据结构 树，栈，链表，队列
    function createASTElement(tagName, attrs) {
      return {
        tag: tagName,
        type: 1,
        children: [],
        attrs: attrs,
        parent: null
      };
    }

    var root;
    var currentParent;
    var stack = []; // 检测标签是否符合预期 <div>123<span><p></p></span></div> [div, span, p]

    function start(tagName, attrs) {
      var element = createASTElement(tagName, attrs);

      if (!root) {
        root = element;
      }

      currentParent = element;
      stack.push(element);
    }

    function end(tagName) {
      //创建父子关系
      var element = stack.pop(); //取出栈中最后一个

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
          text: text
        });
      }
    }

    while (html) {
      //只要html不为空字符串
      var textEnd = html.indexOf('<');

      if (textEnd == 0) {
        // 肯定是标签
        var startTagMatch = parseStartTag();

        if (startTagMatch) {
          start(startTagMatch.tagName, startTagMatch.attrs);
          continue;
        }
      }

      var endTagMatch = html.match(endTag);

      if (endTagMatch) {
        advance(endTagMatch[0].length);
        end(endTagMatch[1]);
        continue;
      }

      var text = void 0;

      if (textEnd > 0) {
        //是文本
        text = html.substring(0, textEnd);
      }

      if (text) {
        advance(text.length);
        chars(text);
      }
    }

    function advance(n) {
      //字符串截取
      html = html.substring(n);
    }

    function parseStartTag() {
      var start = html.match(startTagOpen);

      if (start) {
        var match = {
          tagName: start[1],
          attrs: []
        };
        advance(start[0].length); //删除开始标签 

        var _end;

        var attr; // 不是结尾标签 能匹配到属性

        while (!(_end = html.match(startTagClose)) && (attr = html.match(attribute))) {
          match.attrs.push({
            name: attr[1],
            value: attr[3] || attr[4] || attr[5] //3种情况

          });
          advance(attr[0].length); //去掉当前属性
        }

        if (_end) {
          advance(_end[0].length);
          return match;
        }
      }
    }

    return root;
  }

  var defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g; //{{sd}}

  function genProps(attrs) {
    // id "app" / style "fontSize:12px;color:red"
    var str = '';

    for (var i = 0; i < attrs.length; i++) {
      var attr = attrs[i];

      if (attr.name === 'style') {
        (function () {
          var obj = {};
          attr.value.split(';').forEach(function (item) {
            var _item$split = item.split(":"),
                _item$split2 = _slicedToArray(_item$split, 2),
                key = _item$split2[0],
                value = _item$split2[1];

            obj[key] = value;
          });
          attr.value = obj;
        })();
      }

      str += "".concat(attr.name, ":").concat(JSON.stringify(attr.value), ",");
    }

    return "{".concat(str.slice(0, -1), "}");
  }

  function gen(node) {
    if (node.type == 1) {
      return generate(node); //节点
    } else {
      var text = node.text;
      var tokens = []; //存放每一段的代码

      var lastIndex = defaultTagRE.lastIndex = 0; //正则表达式是全局的，必须每次重置为0

      var match, index; //每次匹配到的结果

      while (match = defaultTagRE.exec(text)) {
        index = match.index; //保存匹配到的索引

        if (index > lastIndex) {
          tokens.push(JSON.stringify(text.slice(lastIndex, index)));
        }

        tokens.push("_s(".concat(match[1].trim(), ")"));
        lastIndex = index + match[0].length;
      }

      if (lastIndex < text.length) {
        tokens.push(JSON.stringify(text.slice(lastIndex)));
      }

      return "_v(".concat(tokens.join('+'), ")");
    }
  }

  function genChildren(el) {
    var children = el.children;

    if (children) {
      return children.map(function (child) {
        return gen(child);
      }).join(',');
    }
  }

  function generate(el) {
    var children = genChildren(el);
    var code = "_c('".concat(el.tag, "',").concat(el.attrs.length ? "".concat(genProps(el.attrs)) : 'undefined').concat(children ? ",".concat(children) : '', ")");
    return code;
  }

  function compileToFunctions(template) {
    // html模板 => render函数
    // 1.需要将html代码转为 AST语法树，可以用AST语法树来描述语音本身(虚拟DOM是用对象来描述节点的)
    // 前端必须掌握的数据结构(树)
    var ast = parseHTML(template); // 2.优化静态节点
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

    var code = generate(ast); // 4.将字符串生成函数 限制取值范围 通过with来取值

    var render = new Function("with(this){return ".concat(code, "}"));
    return render;
  }

  function patch(old, vnode) {
    var el = createEle(vnode);
    var parentElm = old.parentNode;
    parentElm.insertBefore(el, old.nextSibling);
    parentElm.removeChild(old);
  }

  function createEle(vnode) {
    var tag = vnode.tag,
        children = vnode.children,
        key = vnode.key,
        data = vnode.data,
        text = vnode.text;

    if (typeof tag === 'string') {
      vnode.el = document.createElement(tag);
      children.forEach(function (child) {
        vnode.el.appendChild(createEle(child));
      });
    } else {
      vnode.el = document.createTextNode(text);
    }

    return vnode.el;
  }

  function lifecycleMixin(Vue) {
    Vue.prototype._update = function (vnode) {
      var vm = this;
      patch(vm.$el, vnode);
    };
  }
  function mountComponent(vm, el) {
    // 调用render方法去渲染
    // 先调用render方法创建虚拟节点，再将虚拟节点渲染到页面
    vm._update(vm._render());
  }

  function initMixin(Vue) {
    Vue.prototype._init = function (options) {
      var vm = this;
      vm.$options = options; // 数据做劫持
      // vue组件很多状态 data props watch

      initState(vm); // vue的核心特性 响应式数据原理
      // Vue是一个什么样的框架，不是MVVM框架，是借鉴MVVM框架
      // 数据变化视图会更新，视图变化数据会被影响
      // (MVVM)是指不能跳过数据去更新视图,但是vue有类似$ref直接去修改视图内容
      // 如果当前有el属性说明要渲染模板

      if (vm.$options.el) {
        vm.$mount(vm.$options.el);
      }
    };

    Vue.prototype.$mount = function (el) {
      // 挂载操作
      var vm = this;
      var options = vm.$options;
      el = document.querySelector(el);
      vm.$el = el;

      if (!options.render) {
        var template = options.template;

        if (!template && el) {
          template = el.outerHTML;
        } // 编译原理，将模板编译成render


        var render = compileToFunctions(template);
        options.render = render;
      }

      mountComponent(vm);
    };
  }

  function renderMixin(Vue) {
    Vue.prototype._c = function () {
      //创建元素
      return createElement.apply(void 0, arguments);
    };

    Vue.prototype._s = function (val) {
      return val == null ? '' : _typeof(val) == 'object' ? JSON.stringify(val) : val;
    };

    Vue.prototype._v = function (text) {
      //创建文本元素
      return createTextVnode(text);
    };

    Vue.prototype._render = function () {
      var vm = this;
      var render = vm.$options.render;
      var vnode = render.call(vm);
      console.log(render);
      console.log(vnode);
      return vnode;
    };
  }

  function createElement(tag) {
    var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    for (var _len = arguments.length, children = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
      children[_key - 2] = arguments[_key];
    }

    return vnode(tag, data, data.key, children);
  }

  function createTextVnode(text) {
    return vnode(undefined, undefined, undefined, undefined, text);
  }

  function vnode(tag, data, key, children, text) {
    return {
      tag: tag,
      data: data,
      key: key,
      children: children,
      text: text
    };
  }

  function Vue(options) {
    this._init(options); //入口方法，初始化操作

  } //写成插件进行扩展


  initMixin(Vue);
  lifecycleMixin(Vue);
  renderMixin(Vue);

  return Vue;

})));
//# sourceMappingURL=vue.js.map
