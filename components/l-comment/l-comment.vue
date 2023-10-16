<script lang="ts" setup>

</script>

<template>
	<view class="l-comment">
		<view class="l-comment-header">
			<view class="l-comment-header-count">评论(36)</view>
		</view>
		<view class="l-comment-content">
			<view class="l-comment-card" v-for="comment in 6">
				<l-userinfo></l-userinfo>
				<view class="comment-detail u-border-bottom">评论详情评论详情评论详情评论详情评论详情评论详情评论详情评论详情</view>
			</view>
		</view>
	</view>
</template>

<style lang="scss" scoped>
	.l-comment {
		flex: 1 1 0%;
		display: flex;
		flex-direction: column;
		background-color: #fff;
		padding: 32rpx;

		.l-comment-content {
			display: flex;
			flex-direction: column;

			.l-comment-card {
				padding-top: 32rpx;
				display: flex;
				flex-direction: column;

				.comment-detail {
					margin-left: 100rpx;
					padding: 24rpx 0;
					font-size: 24rpx;
					font-family: Medium;
				}
			}
		}
	}
</style>