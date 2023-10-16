<script lang="ts" setup name="l-numberbox">
	import { computed, nextTick, reactive, watch } from "vue";
	/**
	 * numberBox 步进器
	 * @description 该组件一般用于商城购物选择物品数量的场景。注意：该输入框只能输入大于或等于0的整数，不支持小数输入
	 * @tutorial https://www.uviewui.com/components/numberBox.html
	 * @property {Number} value 输入框初始值（默认1）
	 * @property {String} bg-color 输入框和按钮的背景颜色（默认#F2F3F5）
	 * @property {Number} min 用户可输入的最小值（默认0）
	 * @property {Number} max 用户可输入的最大值（默认99999）
	 * @property {Number} step 步长，每次加或减的值（默认1）
	 * @property {Number} stepFirst 步进值，首次增加或最后减的值(默认step值和一致）
	 * @property {Boolean} disabled 是否禁用操作，禁用后无法加减或手动修改输入框的值（默认false）
	 * @property {Boolean} disabled-input 是否禁止输入框手动输入值（默认false）
	 * @property {Boolean} positive-integer 是否只能输入正整数（默认true）
	 * @property {String | Number} size 输入框文字和按钮字体大小，单位rpx（默认26）
	 * @property {String} color 输入框文字和加减按钮图标的颜色（默认#323233）
	 * @property {String | Number} input-width 输入框宽度，单位rpx（默认80）
	 * @property {String | Number} input-height 输入框和按钮的高度，单位rpx（默认50）
	 * @property {String | Number} index 事件回调时用以区分当前发生变化的是哪个输入框
	 * @property {Boolean} long-press 是否开启长按连续递增或递减(默认true)
	 * @property {String | Number} press-time 开启长按触发后，每触发一次需要多久，单位ms(默认250)
	 * @property {String | Number} cursor-spacing 指定光标于键盘的距离，避免键盘遮挡输入框，单位rpx（默认200）
	 * @event {Function} change 输入框内容发生变化时触发，对象形式
	 * @event {Function} blur 输入框失去焦点时触发，对象形式
	 * @event {Function} minus 点击减少按钮时触发(按钮可点击情况下)，对象形式
	 * @event {Function} plus 点击增加按钮时触发(按钮可点击情况下)，对象形式
	 * @example <u-numberbox :min="1" :max="100"></u-numberbox>
	 */
	const emits = defineEmits(["update:modelValue", "input", "change", "blur", "plus", "minus"]);
	const props = defineProps({
		// 预显示的数字
		value: {
			type: Number,
			default: 1
		},
		modelValue: {
			type: Number,
			default: 1
		},
		// 是否显示加减按钮
		isBtns: {
			type: Boolean,
			default: true
		},
		// 背景颜色
		bgColor: {
			type: String,
			default: "#fff"
		},
		// 最小值
		min: {
			type: Number,
			default: 0
		},
		// 最大值
		max: {
			type: Number,
			default: 99999
		},
		// 步进值，每次加或减的值
		step: {
			type: Number,
			default: 1
		},
		// 步进值，首次增加或最后减的值
		stepFirst: {
			type: Number,
			default: 0
		},
		// 是否只能输入 step 的倍数
		stepStrictly: {
			type: Boolean,
			default: false
		},
		// 是否禁用加减操作
		disabled: {
			type: Boolean,
			default: false
		},
		// input的字体大小，单位rpx
		size: {
			type: [Number, String],
			default: 24
		},
		// 加减图标的颜色
		color: {
			type: String,
			default: "#323233"
		},
		// input宽度，单位rpx
		inputWidth: {
			type: [Number, String],
			default: 50
		},
		// input高度，单位rpx
		inputHeight: {
			type: [Number, String],
			default: 40
		},
		// index索引，用于列表中使用，让用户知道是哪个numberbox发生了变化，一般使用for循环出来的index值即可
		index: {
			type: [Number, String],
			default: ""
		},
		// 是否禁用输入框，与disabled作用于输入框时，为OR的关系，即想要禁用输入框，又可以加减的话
		// 设置disabled为false，disabledInput为true即可
		disabledInput: {
			type: Boolean,
			default: false
		},
		// 输入框于键盘之间的距离
		cursorSpacing: {
			type: [Number, String],
			default: 100
		},
		// 是否开启长按连续递增或递减
		longPress: {
			type: Boolean,
			default: true
		},
		// 开启长按触发后，每触发一次需要多久
		pressTime: {
			type: [Number, String],
			default: 250
		},
		// 是否只能输入大于或等于0的整数(正整数)
		positiveInteger: {
			type: Boolean,
			default: true
		}
	})
	const state = reactive({
		inputVal: 1, // 输入框中的值，不能直接使用props中的value，因为应该改变props的状态
		timer: null, // 用作长按的定时器
		changeFromInner: false, // 值发生变化，是来自内部还是外部
		innerChangeTimer: null, // 内部定时器
	})
	const getCursorSpacing = computed(() => {
		// 先将值转为px单位，再转为数值
		return Number(uni.upx2px(props.cursorSpacing));
	})
	const valueCom = computed(() => {
		return props.modelValue;
	})


	state.inputVal = Number(valueCom.value);
	watch(() => valueCom, (v1, v2) => {
		// 只有value的改变是来自外部的时候，才去同步inputVal的值，否则会造成循环错误
		if (!state.changeFromInner) {
			state.inputVal = v1;
			// 因为inputVal变化后，会触发this.handleChange()，在其中changeFromInner会再次被设置为true，
			// 造成外面修改值，也导致被认为是内部修改的混乱，这里进行this.$nextTick延时，保证在运行周期的最后处
			// 将changeFromInner设置为false
			nextTick(() => {
				state.changeFromInner = false;
			})
		}
	})
	watch(() => state.inputVal, (v1, v2) => {
		// 为了让用户能够删除所有输入值，重新输入内容，删除所有值后，内容为空字符串
		if (v1 == "") return;
		let value = 0;
		// 首先判断是否数值，并且在min和max之间，如果不是，使用原来值
		let tmp = isNumber(v1);
		if (tmp && v1 >= props.min && v1 <= props.max) value = v1;
		else value = v2;
		// 判断是否只能输入大于等于0的整数
		if (props.positiveInteger) {
			// 小于0，或者带有小数点，
			if (v1 < 0 || String(v1).indexOf(".") !== -1) {
				value = v2;
				// 双向绑定input的值，必须要使用$nextTick修改显示的值
				nextTick(() => {
					state.inputVal = v2;
				})
			}
		}
		// 发出change事件
		handleChange(value, "change");
	})
	watch(() => props.min, (v1) => {
		if (v1 !== undefined && v1 != "" && valueCom.value < v1) {
			emits('update:modelValue', v1)
		}
	})
	watch(() => props.max, (v1) => {
		if (v1 !== undefined && v1 != "" && valueCom.value > v1) {
			emits('update:modelValue', v1)
		}
	})
	// 点击退格键
	function btnTouchStart(callback) {
		// 先执行一遍方法，否则会造成松开手时，就执行了clearTimer，导致无法实现功能
		this[callback]();
		// 如果没开启长按功能，直接返回
		if (!props.longPress) return;
		clearInterval(state.timer); //再次清空定时器，防止重复注册定时器
		state.timer = null;
		state.timer = setInterval(() => {
			// 执行加或减函数
			this[callback]();
		}, props.pressTime);
	}
	function clearTimer() {
		nextTick(() => {
			clearInterval(state.timer);
			state.timer = null;
		})
	}
	function minus() {
		computeVal("minus");
	}
	function plus() {
		computeVal("plus");
	}
	// 为了保证小数相加减出现精度溢出的问题
	function calcPlus(num1, num2) {
		let baseNum, baseNum1, baseNum2;
		try {
			baseNum1 = num1.toString().split(".")[1].length;
		} catch (e) {
			baseNum1 = 0;
		}
		try {
			baseNum2 = num2.toString().split(".")[1].length;
		} catch (e) {
			baseNum2 = 0;
		}
		baseNum = Math.pow(10, Math.max(baseNum1, baseNum2));
		let precision = baseNum1 >= baseNum2 ? baseNum1 : baseNum2; //精度
		return ((num1 * baseNum + num2 * baseNum) / baseNum).toFixed(precision);
	}
	// 为了保证小数相加减出现精度溢出的问题
	function calcMinus(num1, num2) {
		let baseNum, baseNum1, baseNum2;
		try {
			baseNum1 = num1.toString().split(".")[1].length;
		} catch (e) {
			baseNum1 = 0;
		}
		try {
			baseNum2 = num2.toString().split(".")[1].length;
		} catch (e) {
			baseNum2 = 0;
		}
		baseNum = Math.pow(10, Math.max(baseNum1, baseNum2));
		let precision = baseNum1 >= baseNum2 ? baseNum1 : baseNum2;
		return ((num1 * baseNum - num2 * baseNum) / baseNum).toFixed(precision);
	}
	function computeVal(type) {
		uni.hideKeyboard();
		if (props.disabled) return;
		let value = 0;
		// 新增stepFirst开始
		// 减
		if (type === "minus") {
			if (props.stepFirst > 0 && state.inputVal == props.stepFirst) {
				value = props.min;
			} else {
				value = calcMinus(state.inputVal, props.step);
			}
		} else if (type === "plus") {
			if (props.stepFirst > 0 && state.inputVal < props.stepFirst) {
				value = props.stepFirst;
			} else {
				value = calcPlus(state.inputVal, props.step);
			}
		}
		if (props.stepStrictly) {
			let strictly = value % props.step;
			if (strictly > 0) {
				value -= strictly;
			}
			if (props.stepFirst > 0 && value > 0 && value < props.stepFirst) {
				if (type === "minus") {
					value = 0;
				} else if (type === "plus") {
					value = props.stepFirst + (props.step - (props.stepFirst % props.step));
				}
			}
		}
		if (value > props.max) {
			value = props.max;
		} else if (value < props.min) {
			value = props.min;
		}
		// 新增stepFirst结束
		state.inputVal = value;
		handleChange(value, type);
	}
	// 处理用户手动输入的情况
	function onBlur(event) {
		let val = 0;
		let value = event.detail.value;
		// 如果为非0-9数字组成，或者其第一位数值为0，直接让其等于min值
		// 这里不直接判断是否正整数，是因为用户传递的props min值可能为0
		if (!/(^\d+$)/.test(value) || value[0] == 0) val = props.min;
		val = +value;

		// 新增stepFirst开始
		if (props.stepFirst > 0 && state.inputVal < props.stepFirst && state.inputVal > 0) {
			val = props.stepFirst;
		}
		// 新增stepFirst结束
		if (props.stepStrictly) {
			let strictly = val % props.step;
			if (strictly > 0) {
				val -= strictly;
			}
			if (props.stepFirst > 0 && val > 0 && val < props.stepFirst) {
				val = props.stepFirst + (props.step - (props.stepFirst % props.step));
			}
		}
		if (val > props.max) {
			val = props.max;
		} else if (val < props.min) {
			val = props.min;
		}
		nextTick(() => {
			state.inputVal = val;
		})
		handleChange(val, "blur");
	}
	function handleChange(value, type) {
		if (props.disabled) return;
		// 清除定时器，避免造成混乱
		if (state.innerChangeTimer) {
			clearTimeout(state.innerChangeTimer);
			state.innerChangeTimer = null;
		}
		// 发出input事件，修改通过v-model绑定的值，达到双向绑定的效果
		state.changeFromInner = true;
		// 一定时间内，清除changeFromInner标记，否则内部值改变后
		// 外部通过程序修改value值，将会无效
		state.innerChangeTimer = setTimeout(() => {
			state.changeFromInner = false;
		}, 150);
		emits("input", Number(value));
		emits("update:modelValue", Number(value));
		emits(type, {
			// 转为Number类型
			value: Number(value),
			index: props.index
		});
	}
	/**
	 * 验证十进制数字
	 */
	function isNumber(value) {
		return /^(?:-?\d+|-?\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/.test(value);
	}
</script>
<template>
	<view class="u-numberbox">
		<view v-if="props.isBtns" class="u-icon-minus" @click.stop.prevent="" @touchstart.stop="btnTouchStart('minus')" @touchend.stop.prevent="clearTimer" :class="{ 'u-icon-disabled': props.disabled || state.inputVal <= props.min }" :style="{
				background: props.bgColor,
				height: props.inputHeight + 'rpx',
				color: props.color,
				fontSize: props.size + 'rpx',
				minHeight: '1.4em'
			}">
			<view :style="'font-size:' + (Number(size) + 10) + 'rpx'" class="num-btn">－</view>
		</view>
		<input :disabled="props.disabledInput || props.disabled" :cursor-spacing="getCursorSpacing" :class="{ 'u-input-disabled': props.disabled }" v-model="state.inputVal" class="u-number-input" @blur="onBlur" type="number" :style="{
				color: props.color,
				fontSize: props.size + 'rpx',
				background: props.bgColor,
				height: props.inputHeight + 'rpx',
				width: props.inputWidth + 'rpx'
			}" />
		<view v-if="props.isBtns" class="u-icon-plus" @click.stop.prevent="" @touchstart.stop="btnTouchStart('plus')" @touchend.stop.prevent="clearTimer" :class="{ 'u-icon-disabled': props.disabled || state.inputVal >= props.max }" :style="{
				background: props.bgColor,
				height: props.inputHeight + 'rpx',
				color: props.color,
				fontSize: props.size + 'rpx',
				minHeight: '1.4em'
			}">
			<view :style="'font-size:' + (Number(size) + 10) + 'rpx'" class="num-btn">＋</view>
		</view>
	</view>
</template>

<style lang="scss" scoped>
	.u-numberbox {
		display: inline-flex;
		align-items: center;
		padding: 2rpx;
		border: 1rpx solid #f7f7f7;
		border-radius: 12rpx;
		font-family: Bebas;
	}

	.u-number-input {
		position: relative;
		text-align: center;
		padding: 0;
		margin: 0 6rpx;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.u-icon-plus,
	.u-icon-minus {
		width: 40rpx !important;
		height: 40rpx !important;
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: #f3f2f1 !important;
	}

	.u-icon-plus {
		// border-radius: 0 8rpx 8rpx 0;
		border-radius: 12rpx;
	}

	.u-icon-minus {
		// border-radius: 8rpx 0 0 8rpx;
		border-radius: 12rpx;
	}

	.u-icon-disabled {
		color: #c8c9cc !important;
		background: #f7f8fa !important;
	}

	.u-input-disabled {
		color: #c8c9cc !important;
		background-color: #f2f3f5 !important;
	}

	/* #ifdef H5 */
	.num-btn {
		font-weight: 550;
		position: relative;
		top: -4rpx;
	}

	/* #endif */
	/* #ifndef H5 */
	.num-btn {
		font-weight: 550;
		position: relative;
		top: 0rpx;
	}

	/* #endif */
</style>