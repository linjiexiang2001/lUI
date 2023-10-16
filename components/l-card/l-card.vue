<template>
	<view class="amxx-card " :style="customStyle">
		<slot></slot>
	</view>
</template>

<script lang="ts" setup>
	const props = defineProps({
		customStyle: Object
	})
</script>

<style lang="scss" scoped>
	.amxx-card {
		// flex: 1;
		height: max-content;
		width: 100%;
		background-color: #fff;
		display: flex;
		flex-direction: column;
		border-radius: 24rpx;
		padding: 0 32rpx;
		box-sizing: border-box;
	}
</style>