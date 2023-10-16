<script lang="ts" setup>
	import { reactive, nextTick } from "vue";
	const props = defineProps({
		data: Array
	})
	const emits = defineEmits(['update:modelValue', 'remove'])
	const state = reactive({
		timer: null,
	})
	function handlerCart(items : EmptyArrayType) {
		console.log(items);
		emits('update:modelValue', items)
	}
	function longTapTag(index : number) {
		uni.showActionSheet({
			itemList: ['移出购物车'],
			success(res) {
				console.log(res);
				emits('remove', index)
			}
		})
	}
	function btnTouchStart(index : number) {
		// 先执行一遍方法，否则会造成松开手时，就执行了clearTimer，导致无法实现功能
		// longTapTag(index);
		clearInterval(state.timer); //再次清空定时器，防止重复注册定时器
		state.timer = null;
		state.timer = setInterval(() => {
			// 执行加或减函数
			longTapTag(index);
		}, 1050);
	}
	function clearTimer() {
		nextTick(() => {
			clearInterval(state.timer);
			state.timer = null;
		})
	}
</script>
<template>
	<u-checkbox-group class="l-cart" shape="circle" size="16" activeColor="#262a47" @change="handlerCart">
		<u-checkbox class="cart-card" v-for="cart,cartIndex in props.data" :name="cart" @touchstart.stop="btnTouchStart(cartIndex)" @touchend.stop="clearTimer()">
			<view class="card-info">
				<image class="card-info-img" src="@/static/images/avatar.jpg" mode="aspectFill"></image>
				<view class="card-info__column">
					<view class="card-name u-line-2">商品名称商品名称商品名称商品名称商品名称商品名称</view>
					<view class="flex-row flex-between">
						<l-price count="20" symbolSize="24rpx" beforeSize="32rpx" afterSize="24rpx"></l-price>
						<l-numberbox v-model="cart.buyCount"></l-numberbox>
					</view>
				</view>
			</view>
		</u-checkbox>
	</u-checkbox-group>
</template>

<style lang="scss" scoped>
	.l-cart {
		display: flex;
		flex-direction: column;
		padding: 6rpx 32rpx;

		.cart-card {
			width: 100%;
			// min-height: 204rpx;
			background-color: #fff;
			border-radius: 24rpx;
			display: flex;
			align-items: center;
			padding: 32rpx 24rpx;
			box-sizing: border-box;

			.card-info {
				width: 75vw;
				display: flex;

				.card-info-img {
					width: 140rpx;
					height: 140rpx;
					border-radius: 24rpx;
					margin-right: 16rpx;
				}

				&__column {
					flex: 1 1 0%;
					display: flex;
					flex-direction: column;
					justify-content: space-between;

					.card-name {
						font-size: 28rpx;
						color: #222;
						font-family: Medium;
					}
				}
			}
		}
	}
</style>