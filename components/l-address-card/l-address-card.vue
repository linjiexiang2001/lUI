<script lang="ts" setup>
	import tools from '@/tools/index'
</script>
<template>
	<view class="l-address-card u-border-top" @click="tools.jumpTo('/pages/client/address/addressIndex')">
		<view class="l-address-card-item basis">
			<view class="default-tag">默认</view>
			<view class="region">广东省 广州市 番禺区</view>
		</view>
		<view class="l-address-card-item main">
			<view class="address-detail">义宾南区16号楼</view>
			<u-icon name="play-right-fill" color="#999" size="10"></u-icon>
		</view>
		<view class="l-address-card-item basis">
			<view class="address-label">杰西</view>
			<view class="address-label">1888888888888</view>
		</view>
	</view>

</template>

<style lang="scss">
	.l-address-card {
		background-color: #fff;
		display: flex;
		flex-direction: column;
		padding: 32rpx;
		box-sizing: border-box;

		.l-address-card-item {
			display: flex;
			margin-bottom: 18rpx;

			&:last-child {
				margin-bottom: unset;
			}

			&.basis {
				.default-tag {
					width: 56rpx;
					height: 36rpx;
					background-color: #262A47;
					box-shadow: 0 0 1px 2rpx #2AC16D;
					color: #fff;
					border-radius: 8rpx;
					display: flex;
					align-items: center;
					justify-content: center;
					font-size: 24rpx;
					margin-right: 24rpx;
				}

				.region {
					font-size: 26rpx;
					color: #333;
				}

				.address-label {
					font-size: 26rpx;
					color: #666;
					margin-right: 32rpx;
				}
			}

			&.main {
				justify-content: space-between;

				.address-detail {
					font-size: 32rpx;
					font-family: Medium;
					font-weight: 550;
					color: #333;
				}
			}
		}
	}
</style>