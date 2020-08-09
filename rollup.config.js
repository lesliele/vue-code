import babel from '@rollup/plugin-babel';
import serve from 'rollup-plugin-serve';

export default {
    input: './src/index.js', //入口 以这个入口打包库 new Vue
    output: {
        format: 'umd', //模块化的类型 esModule,commonjs模块
        name: 'Vue', //全局变量名字
        file: 'dist/umd/vue.js',
        sourcemap: true
    },
    plugins: [
        babel({
            exclude: 'node_modules/**'
        }),
        serve({
            open: false, //默认false,不自动打开
            port: 3000,
            contentBase: '', //当前目录
            openPage: 'index.html'
        })
    ]
}