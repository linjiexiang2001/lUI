<template>
	<view class="wx-authorization-modal " v-if="props.modelValue">
		<view class="wam__mask " :class="{'fade-out':!state.dialogVisible}" @touchmove.prevent="" @tap.stop="closeModal"></view>
		<view class="wam__wrapper" :class="{'slide-out-bottom':!state.dialogVisible}">
			<view class="wrapper-header">
				<view class="wam__close-btn">
					<u-icon name="arrow-left" size="24" v-if="state.modeStep === 1 && props.mode === 0" @tap="rebackMode()"></u-icon>
				</view>
				<view class="header-title">{{props.mode === 1 ? '新增收货地址': '选择收货地址' }}</view>
				<view class="wam__close-btn" @tap.stop="closeModal">
					<u-icon name="close" size="18"></u-icon>
				</view>
			</view>
			<view class="address-wrapper" :class="{'slide-in-right':state.modeStep === 1}">
				<template v-if="state.modeStep === 0">
					<template v-if="state.addressList&&state.addressList.length>0">
						<view class="address-wrapper__colum " :style="setAnimation(index)" v-for="address,index in state.addressList" :key="index">
							<view class="address-info" @click="chooseAddress(address)">
								<view class="address-info__district">
									<u-tag text="默认" bgColor="#2AC16D" borderColor="#2AC16D" size="mini" v-if="address.whetherDefault === 1"></u-tag>
									<view class="address-info__district__text">{{address?.receivingAddress?.district}}</view>
								</view>
								<view class="address-info__detail">{{address.detailedAddress}}</view>
								<view class="address-info__base">
									<span>{{address.receiverName}}</span>
									<span>{{address.receiverPhone}}</span>
								</view>
							</view>
							<u-icon name="edit-pen" size="18" @click="editAddress(address)"></u-icon>
						</view>
					</template>
					<l-empty v-bind="state.emptyOption" v-else></l-empty>
				</template>
				<template v-if="state.modeStep === 1">
					<view class="address-wrapper__formbody">
						<u-form :model="state.ruleForm">
							<u-form-item class=" form-item u-border-bottom" label="姓名" labelWidth="80">
								<u--input border="none" v-model="state.ruleForm.receiverName" placeholder="请填写收货人姓名"></u--input>
							</u-form-item>
							<u-form-item class=" form-item u-border-bottom" label="手机号码" labelWidth="80">
								<u--input border="none" v-model="state.ruleForm.receiverPhone" placeholder="请填写收货人手机号码"></u--input>
							</u-form-item>
							<u-form-item class=" form-item u-border-bottom" label="所在地区" labelWidth="80">
								<view class="u-flex-1" @tap="pickerCity()">{{state.addressStr||'请选择省市区'}}</view>
								<!-- <u--input border="none" v-model="state.addressStr" placeholder="请选择省市区" >
								</u--input> -->
								<u-icon name="play-right-fill" color="#999" size="12"></u-icon>
							</u-form-item>
							<u-form-item class=" form-item u-border-bottom" label="详细地址" labelWidth="80">
								<u--input border="none" v-model="state.ruleForm.detailedAddress" placeholder="街道、楼牌号等"></u--input>
							</u-form-item>
							<u-form-item class=" form-item u-border-bottom" label="设置为默认地址" labelWidth="240">
								<view style="width: 100%;display: flex;align-items: center;justify-content: flex-end;">
									<u-switch v-model="state.ruleForm.whetherDefault" :active-value="1" :inactive-value="0" size="20" active-color="#2AC16D"></u-switch>
								</view>
							</u-form-item>
						</u-form>
					</view>
				</template>
			</view>
			<view class="wam__submit-btn" :class="[{
			  'disabled': state.payType === ''
			}]" hover-class="tn-btn-hover-class" :hover-stay-time="150" @tap.stop="confirmComponent">
				{{props.mode === 1 || state.modeStep === 1 ? '保存': '新增收货地址' }}
			</view>
		</view>
	</view>
	<l-cityPick ref="cityPickRef" @confirm="confirmCity"></l-cityPick>
</template>

<script setup>
	import tools from "@/tools/index"
	import { reactive, watchEffect, ref, nextTick } from "vue";
	import system from "@/static/lottie/system.json";
	/**
	 * @description  选择收货地址/新增收货地址组件
	 * @property {Boolean}	modelValue			操作菜单是否展示 （默认 false ）
	 * @property {Number}	mode			组件类型 （0选择收货地址 1新增收货地址）
	 * */
	const cityPickRef = ref();
	const props = defineProps({
		modelValue: Boolean,
		mode: Number,
	})
	const emits = defineEmits(["update:modelValue", "confirm", 'append']);
	const state = reactive({
		dialogVisible: false,
		modeStep: 0,
		ruleForm: {
			receiverAddressId: '',
			receiverName: '',
			receiverPhone: '',
			receivingAddress: '',
			detailedAddress: '',
			whetherDefault: 0
		},
		addressStr: "",
		addressList: [],
		emptyOption: {
			width: "405rpx",
			height: "405rpx",
			loop: false,
			text: "暂无收货地址，先去添加一个吧~"
		},
	})
	watchEffect(() => {
		state.dialogVisible = props.modelValue;
		state.modeStep = props.mode;
		resetRuleForm();
	})
	// 只有在选择地址时才请求数据
	if (state.modeStep === 0) getAddress();

	function resetRuleForm() {
		state.ruleForm = {
			receiverAddressId: '',
			receiverName: '',
			receiverPhone: '',
			receivingAddress: '',
			detailedAddress: '',
			whetherDefault: 0
		}
		state.addressStr = '';
	}

	function getAddress() {
		// tools.requestApi({
		// 	url: '/api/utils/findUserReceiverAddressList',
		// 	method: 'GET',
		// }).then((res) => {
		// 	if (res.data.list.length > 0) {
		// 		res.data.list.forEach((item) => {
		// 			item.receivingAddress = item.receivingAddress ? JSON.parse(item.receivingAddress) : ''
		// 		})
		// 	}
		// 	state.addressList = res.data.list;
		// })
	}

	function confirmComponent() {
		if (state.modeStep === 0) {
			state.modeStep = 1;
		} else {
			tools.ruleParams(state.ruleForm, [
				{ prop: 'receiverName', type: 'string', msg: "请填写收货人姓名" },
				{
					prop: 'receiverPhone',
					type: 'string',
					msg: "请填写正确的收货人手机号码",
					pattern: [
						'^1[3-9]\\d{9}$',
						'^[89]\\d{7}$',
						'^6\\d{6}$',
						'^09\\d{8}$'
					],
				},
				{ prop: 'receivingAddress', type: 'string', msg: "请选择省市区" },
				{ prop: 'detailedAddress', type: 'string', msg: "请输入详细地址 街道、楼牌号等" },
			]).then((data) => {
				console.log(data);
				tools.requestApi({
					url: data.receiverAddressId ? '/api/utils/updateUserReceiverAddress' : '/api/utils/addUserReceiverAddress',
					method: 'body',
					data: data
				}).then((res) => {
					console.log(res);
					if (props.mode === 0) {
						// 如果新增的地址为默认 需要修改之前的默认状态
						res.data.receivingAddress = res.data.receivingAddress ? JSON.parse(res.data.receivingAddress) : '';
						if (state.addressList.length > 0) {
							if (res.data.whetherDefault === 1) state.addressList.forEach((item) => item.whetherDefault = 0);
							let index = state.addressList.findIndex((item) => item.receiverAddressId == res.data.receiverAddressId);
							if (index > -1) state.addressList[index] = res.data;
							else state.addressList.unshift(res.data);
						} else state.addressList = [res.data];
						nextTick(() => {
							console.log(state.addressList);
							state.modeStep = 0;
							resetRuleForm();
						})
					} else {
						emits('append', res.data);
						closeModal();
					}
				})
			})
		}
	}

	function confirmCity(event) {
		state.ruleForm.receivingAddress = event.options;
		state.addressStr = event.options.district;
		nextTick(() => {
			cityPickRef.value.closeDialog()
		})
	}

	function pickerCity() {
		console.log(state.ruleForm, 'pickerCity');
		cityPickRef.value.initComponent(state.ruleForm.receivingAddress?.area || state.ruleForm.receivingAddress?.city || state.ruleForm.receivingAddress?.province)
	}

	function setAnimation(index) {
		return {
			'animation-name': 'slide-in-left',
			'animation-duration': '0.5s',
			'animation-fill-mode': 'forwards',
			'animation-delay': `${(index)/10}s`
		}
	}

	function editAddress(item) {
		console.log(item);
		state.ruleForm = tools.initRow(item);
		state.addressStr = item.receivingAddress.district
		state.modeStep = 1;
	}

	function chooseAddress(item) {
		emits("confirm", item)
		closeModal();
	}

	function rebackMode() {
		state.modeStep = 0;
	}

	function closeModal() {
		state.dialogVisible = false;
		setTimeout(() => {
			emits("update:modelValue", false)
		}, 350)
	}
	defineExpose({
		editAddress,
	})
</script>

<style lang="scss">
	.wx-authorization-modal {
		position: fixed;
		left: 0;
		top: 0;
		width: 100vw;
		height: 100vh;
		z-index: 1000;
		background-color: rgba(0, 0, 0, 0.5);

		.wam {

			/* mask */
			&__mask {
				position: absolute;
				left: 0;
				top: 0;
				width: 100%;
				height: 100%;
				background-color: rgba(0, 0, 0, 0.5);
				opacity: 0;
				animation: showMask 0.25s ease 0.1s forwards;
				z-index: 999;
			}


			&__close-btn {
				width: 38rpx;
				height: 38rpx;
			}

			/* wrapper */
			&__wrapper {
				position: absolute;
				left: 0;
				bottom: 0;
				width: 100%;
				box-sizing: border-box;
				background-color: #FFFFFF;
				border-radius: 20rpx 20rpx 0rpx 0rpx;
				padding: 40rpx;
				padding-top: 32rpx;
				padding-bottom: 40rpx;
				padding-bottom: calc(constant(safe-area-inset-bottom) + 40rpx);
				padding-bottom: calc(env(safe-area-inset-bottom) + 40rpx);
				transform-origin: center bottom;
				transform: scaleY(0);
				animation: showWrapper 0.25s ease 0.1s forwards;
				z-index: 99999;

				.wrapper-header {
					width: 100%;
					display: flex;
					align-items: center;
					justify-content: space-between;
					margin-bottom: 65rpx;

					.header-title {
						font-weight: 550;
						font-family: Medium;
						font-size: 4.5vw;
					}
				}

				.address-wrapper {
					width: 100%;
					height: 750rpx;
					overflow-y: scroll;
					display: flex;
					flex-direction: column;

					&__colum {
						background-color: #fff;
						display: inline-flex;
						padding: 32rpx;
						border-radius: 24rpx;
						margin-bottom: 32rpx;
						border: 1rpx solid #efefef;

						&:last-child {
							margin-bottom: unset;
						}

						.address-info {
							flex: 1 1 0%;
							display: flex;
							flex-direction: column;
							color: #292929;

							&__district {
								display: flex;
								align-items: center;

								&__text {
									margin-left: 8rpx;
									font-weight: 550;
									font-size: 3.5vw;
									font-weight: 550;
								}
							}

							&__detail {
								font-weight: 600;
								font-family: Medium;
								margin: 16rpx 0;
							}

							&__base {
								font-weight: 550;
								font-size: 3.5vw;
								font-weight: 550;

								span {
									&:first-child {
										margin-right: 32rpx;
									}
								}

							}

						}
					}
				}

				.form-item {
					padding: 10rpx 0;
				}
			}

			/* sub-title */
			&__sub-title {
				font-size: 26rpx;
				color: #666;
				margin-top: 16rpx;
				padding-bottom: 24rpx;
				text-align: center;
			}

			&__sub-label {
				font-size: 26rpx;
				color: #aaa;
				margin-top: 24rpx;
				padding-bottom: 24rpx;
				text-align: center;
			}

			&__sub-number {
				text-align: center;
				font-family: Bebas;
				font-size: 65rpx;
			}

			/* 保存按钮 */
			&__submit-btn {
				background-color: #05C160;
				color: #FFFFFF;
				margin-top: 45rpx;
				border-radius: 10rpx;
				padding: 25rpx;
				font-size: 32rpx;
				display: flex;
				align-items: center;
				justify-content: center;

				&.disabled {
					background-color: #E6E6E6;
				}
			}


		}
	}

	.tn-btn-hover-class {
		box-shadow: inset 10rpx 2rpx 40rpx 0rpx rgba(0, 0, 0, 0.05);
	}

	@keyframes showMask {
		0% {
			opacity: 0;
		}

		100% {
			opacity: 1;
		}
	}

	@keyframes showWrapper {
		0% {
			transform: scaleY(0);
		}

		100% {
			transform: scaleY(1);
		}
	}
</style>