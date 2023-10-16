<script lang="ts" setup>
	import { reactive, ref } from 'vue'
	import tools from '@/tools/index';
	const emits = defineEmits(['confirm', 'cancel']);
	const state = reactive({
		width: '550', //宽度
		isShow: false, //是否打开
		isIcon: false, //是否带关闭图标
		isInput: false, //是否是输入框
		isRemark: false, //是否是输入大文本
		isRule: false, //是否校验参数 开启校验默认参数是必填
		modelRule: null, //校验参数规则 正则校验
		ruleWaring: '请输入合法的内容', //校验警告
		title: '', //标题
		remark: '', //输入内容
		modelTips: '', //提示内容
		isCancel: false, //是否打开取消
		isConfirm: true, //是否打开确认
		cancelText: '取消',
		confirmText: '确认',
		inputType: 'text', //输入框类型
		maxlenght: '', //输入最大限制 
		placeholder: '请输入内容'
	})
	function cancel() {
		emits('cancel')
		clearModel();
	}
	function confirm() {
		if (state.maxlenght && state.remark.length > state.maxlenght) {
			tools.tips(`最大输入长度为${state.maxlenght}`);
			return;
		}
		if (state.isRule) {
			if (!state.remark) {
				tools.tips('请先输入内容');
			}
			if (state.modelRule !== null) { //含有校验规则
				if (state.modelRule.test(state.remark)) {
					clearModel();
					emits('confirm', state.remark)
				} else {
					tools.tips(state.ruleWaring)
				}
			} else {
				clearModel();
				emits('confirm', state.remark)
			}
		} else {
			clearModel();
			emits('confirm', state.remark)
		}
	}
	function clearModel() {
		state.isShow = false;
		state.width = '550'; //宽度
		state.isShow = false; //是否打开
		state.isIcon = false; //是否带关闭图标
		state.isInput = false; //是否是输入框
		state.isRemark = false; //是否是输入大文本
		state.isRule = false; //是否校验参数 开启校验默认参数是必填
		state.modelRule = null; //校验参数规则 正则校验
		state.ruleWaring = '请输入合法的内容'; //校验警告
		state.title = ''; //标题
		state.remark = ''; //输入内容
		state.modelTips = ''; //提示内容
		state.isCancel = false; //是否打开取消
		state.isConfirm = true; //是否打开确认
		state.cancelText = '取消';
		state.confirmText = '确认';
		state.inputType = 'text'; //输入框类型
		state.maxlenght = ''; //输入最大限制 
		state.placeholder = '请输入内容';
	}
	function initComponent(row : EmptyObjectType) {
		for (let item in row) {
			state[item] = row[item]
		}
		console.log(row, 'initComponent');
	}
	defineExpose({
		initComponent
	})
</script>

<template>
	<u-popup :show="state.isShow" mode="center" round="32" :closeable="state.isIcon" @close="clearModel">
		<view class="model-main" :style="{width:state.width + 'rpx'}">
			<view class="model-title">{{state.title}}</view>
			<view class="model-tips" v-if="state.modelTips">
				<text class="model-tips_text">{{state.modelTips}}</text>
			</view>
			<view class="model-input" v-if="state.isInput">
				<u-input style="flex: 1;height: 100%;display: flex;align-items: center;" :placeholder="state.placeholder" v-model="remark" :type="inputType" adjustPosition></u-input>
			</view>
			<view class="model-remark" v-if="state.isRemark">
				<u-input v-model="remark" type="textarea" maxlength="50" :placeholder="state.placeholder" />
			</view>
			<slot></slot>
			<view class="model-btns" :class="{gap:state.isCancel&&state.isConfirm}">
				<view class="btn error" v-if="state.isCancel" @click="cancel()">
					<text class="btn_text">{{state.cancelText}}</text>
				</view>
				<view class="btn primary" v-if="state.isConfirm" @click="confirm()">
					<text class="btn_text">{{state.confirmText}}</text>
				</view>
			</view>
		</view>
	</u-popup>
</template>

<style lang="scss">
	.model-main {
		width: 686rpx;
		min-height: 375rpx;
		background-color: #fff;
		padding: 32rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: space-between;
		border-radius: 16rpx;

		.model-title {
			flex: 1;
			font-size: 32rpx;
			font-weight: 550;
			margin-bottom: 32rpx;
		}

		.model-tips {
			flex: 1;
			display: flex;
			align-items: center;
			justify-content: center;

			.model-tips_text {
				white-space: pre-line;
				text-align: center;
				font-size: 26rpx;
			}

		}

		.model-input {
			flex: 1 1 0%;
			height: 100rpx;
			border-radius: 20rpx;
			background-color: #F5F5F5;
			display: flex;
			align-items: center;
			justify-content: center;
			padding: 0 24rpx;
		}

		.model-remark {
			flex: 1 1 0%;
			min-height: 292rpx;
			border-radius: 20rpx;
			background-color: #F5F5F5;
			padding: 32rpx;
		}

		.model-btns {
			flex: 1;
			display: flex;
			flex-direction: row;
			align-items: center;
			justify-content: space-evenly;
			margin-top: 48rpx;

			&.gap {
				gap: 24rpx;
			}

			.btn {
				width: 300rpx;
				height: 75rpx;
				border-radius: 12rpx;
				display: flex;
				flex-direction: row;
				align-items: center;
				justify-content: center;

				.btn_text {
					font-size: 32rpx;
					color: #fff;
				}

				&.error {
					background-color: rgba(248, 62, 70, .6);
				}

				&.primary {
					background-color: $color;
				}
			}
		}
	}
</style>