<script lang="ts" setup>
	const props = defineProps({
		vIndex: Number,
	})
	const emits = defineEmits(['click'])
	function handlerOrder(order) {
		emits('click', { data: 'order', index: props.vIndex })
	}
</script>

<template>
	<view class="l-order-card" @click.stop="handlerOrder()">
		<view class="order-info">
			<image class="order-info__img" src="../../../../static/images/avatar.jpg" mode="aspectFill"></image>
			<view class="order-info__column">
				<view class="goods-name u-line-1">商品标题商品标题商品标题显示1行…</view>
				<view class="flex-row flex-between">
					<l-price count="1999.37" beforeSize="32rpx" afterSize="24rpx"></l-price>
					<view style="font-size: 24rpx;color: #666;">x1</view>
				</view>
			</view>
		</view>
		<view class="flex-row flex-end u-m-t-32">
			<l-price count="1999.37" beforeSize="32rpx" afterSize="24rpx" #before>合计</l-price>
		</view>
		<view class="order-button-group">
			<slot></slot>
		</view>
	</view>
</template>

<style lang="scss" scoped>
	.l-order-card {
		border-radius: 24rpx;
		background-color: #fff;
		padding: 32rpx;
		display: flex;
		flex-direction: column;
		margin-bottom: 32rpx;

		&:last-child {
			margin-bottom: unset;
		}

		.order-info {
			display: flex;
			align-items: flex-start;
			justify-content: space-between;

			&__img {
				width: 128rpx;
				height: 128rpx;
				border-radius: 24rpx;
			}

			&__column {
				flex: 1 1 0%;
				min-height: 128rpx;
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				margin-left: 24rpx;
			}
		}

		.order-button-group {
			width: 100%;
			display: flex;
			flex-wrap: wrap;
			gap: 24rpx;
			justify-content: flex-end;
			margin-top: 48rpx;
		}
	}
</style>