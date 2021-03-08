// 引入全局实例
import _CodeMirror from 'codemirror'

// 核心样式
import 'codemirror/lib/codemirror.css'
// 引入主题后还需要在 options 中指定主题才会生效
import 'codemirror/theme/cobalt.css'

// 需要引入具体的语法高亮库才会有对应的语法高亮效果
// codemirror 官方其实支持通过 /addon/mode/loadmode.js 和 /mode/meta.js 来实现动态加载对应语法高亮库
// 但 vue 貌似没有无法在实例初始化后再动态加载对应 JS ，所以此处才把对应的 JS 提前引入
import 'codemirror/mode/javascript/javascript.js'
import 'codemirror/mode/css/css.js'
import 'codemirror/mode/xml/xml.js'
import 'codemirror/mode/clike/clike.js'
import 'codemirror/mode/markdown/markdown.js'
import 'codemirror/mode/python/python.js'
import 'codemirror/mode/r/r.js'
import 'codemirror/mode/shell/shell.js'
import 'codemirror/mode/sql/sql.js'
import 'codemirror/mode/swift/swift.js'
import 'codemirror/mode/vue/vue.js'

// 尝试获取全局实例
const CodeMirror = window.CodeMirror || _CodeMirror

// const components = {
//     codemirror
// }

function data() {
    return {
        // 内部真实的内容
        code: '',
        // 默认的语法类型
        mode: 'javascript',
        // 编辑器实例
        coder: null,
        // 默认配置
        options: {
            // 缩进格式
            tabSize: 2,
            // 主题，对应主题库 JS 需要提前引入
            theme: 'cobalt',
            // 显示行号
            lineNumbers: true,
            line: true
        },
        // 支持切换的语法高亮类型，对应 JS 已经提前引入
        // 使用的是 MIME-TYPE ，不过作为前缀的 text/ 在后面指定时写死了
        modes: [{
            value: 'css',
            label: 'CSS'
        }, {
            value: 'javascript',
            label: 'Javascript'
        }, {
            value: 'html',
            label: 'XML/HTML'
        }, {
            value: 'x-java',
            label: 'Java'
        }, {
            value: 'x-objectivec',
            label: 'Objective-C'
        }, {
            value: 'x-python',
            label: 'Python'
        }, {
            value: 'x-rsrc',
            label: 'R'
        }, {
            value: 'x-sh',
            label: 'Shell'
        }, {
            value: 'x-sql',
            label: 'SQL'
        }, {
            value: 'x-swift',
            label: 'Swift'
        }, {
            value: 'x-vue',
            label: 'Vue'
        }, {
            value: 'markdown',
            label: 'Markdown'
        }]
    }
}

function mounted() {
    // codemirror.;
}

const methods = {
    execCommand(name, args = null) {
        console.log(CodeMirror.fromTextArea)
        // var html = '<codemirror v-model="code" :options="options"></codemirror>';
        if (name == "insertFieldset") {
            var sel, range;
            // console.log(window.getSelection)
            if (window.getSelection) {
                sel = window.getSelection();
                if (sel.getRangeAt && sel.rangeCount) {
                    range = sel.getRangeAt(0);
                    range.deleteContents();
                    var el = document.createElement("div");
                    // let refid = new Date().getTime();
                    // el.innerHTML = `<div ref="refid"></div>`;
                    CodeMirror(el, {
                        value: "",
                        // 缩进格式
                        tabSize: 2,
                        // 主题，对应主题库 JS 需要提前引入
                        theme: 'cobalt',
                        // 显示行号
                        lineNumbers: true,
                        line: true
                    })
                    // // 编辑器赋值
                    // this.coder.setValue(this.value || this.code)
                    // 支持双向绑定
                    // this.coder.on('change', (coder) => {
                    //     this.code = coder.getValue()

                    //     if (this.$emit) {
                    //         this.$emit('input', this.code)
                    //     }
                    // })
                    // // 尝试从父容器获取语法类型
                    // if (this.language) {
                    //     // 获取具体的语法类型对象
                    //     let modeObj = this._getLanguage(this.language)

                    //     // 判断父容器传入的语法是否被支持
                    //     if (modeObj) {
                    //         this.mode = modeObj.label
                    //     }
                    // }

                    // var ec = document.createElement("codemirror");
                    // console.log(ec)
                    // ec.options = this.options;
                    // el.appendChild(ec)
                    var frag = document.createDocumentFragment(), node, lastNode;
                    console.log(frag)
                    while ((node = el.firstChild)) {
                        lastNode = frag.appendChild(node);
                    }
                    range.insertNode(frag);
                    if (lastNode) {
                        range = range.cloneRange();
                        range.setStartAfter(lastNode);
                        range.collapse(true);
                        sel.removeAllRanges();
                        sel.addRange(range);
                    }

                    // this.coder = CodeMirror(el, {
                    //     value: "",
                    //     // 缩进格式
                    //     tabSize: 2,
                    //     // 主题，对应主题库 JS 需要提前引入
                    //     theme: 'cobalt',
                    //     // 显示行号
                    //     lineNumbers: true,
                    //     line: true
                    // })
                    // this.coder.setValue(this.value || this.code)
                }
            } else if (document.selection && document.selection.type != "Control") {
                // IE < 9
                // document.selection.createRange().pasteHTML(html);
            }

        } else {
            document.execCommand(name, false, args);
        }
    },
    // 获取当前语法类型
    _getLanguage(language) {
        // 在支持的语法类型列表中寻找传入的语法类型
        return this.modes.find((mode) => {
            // 所有的值都忽略大小写，方便比较
            let currentLanguage = language.toLowerCase()
            let currentLabel = mode.label.toLowerCase()
            let currentValue = mode.value.toLowerCase()

            // 由于真实值可能不规范，例如 java 的真实值是 x-java ，所以讲 value 和 label 同时和传入语法进行比较
            return currentLabel === currentLanguage || currentValue === currentLanguage
        })
    },
    // 更改模式
    changeMode(val) {
        // 修改编辑器的语法配置
        this.coder.setOption('mode', `text/${val}`)

        // 获取修改后的语法
        let label = this._getLanguage(val).label.toLowerCase()

        // 允许父容器通过以下函数监听当前的语法值
        this.$emit('language-change', label)
    }
}

export default {
    // components: components,
    data: data,
    mounted: mounted,
    methods: methods,

}