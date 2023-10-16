<script lang="ts" setup>
</script>

<template>
	<view class="l-userinfo">
		<image class="l-userinfo__avatar" src="@/static/images/avatar.png" mode="aspectFill"></image>
		<view class="l-userinfo__infos">
			<view class="nickname">加加宾克斯</view>
			<view class="timestamp">2022-08-20 06:25</view>
		</view>
	</view>
</template>

<style lang="scss" scoped>
	.l-userinfo {
		display: flex;
		align-items: center;

		&__avatar {
			width: 74rpx;
			height: 74rpx;
			border-radius: 50%;
			margin-right: 24rpx;
		}

		&__infos {
			flex: 1 1 0%;
			display: flex;
			flex-direction: column;

			.nickname {
				margin-bottom: 8rpx;
				font-size: 26rpx;
				color: #222;
				font-family: Medium;
			}

			.timestamp {
				font-size: 22rpx;
				color: #888;
			}
		}
	}
</style>