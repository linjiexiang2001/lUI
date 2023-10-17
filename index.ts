// 引入全局mixin
import mixin from './libs/mixin/mixin';

// // $u挂载到uni对象上
// uni.$u = $u

const install = (Vue) => {
	Vue.mixin(mixin)
}

export default { install }