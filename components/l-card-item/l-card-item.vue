<template>
	<view class="amxx-card-item" :class="[props.border,props.labelPosition]">
		<slot name="main">
			<view class="amxx-card-item__title" :style="{minWidth: $u.addUnit(props.labelWidth),fontSize:$u.addUnit(props.labelSize)}">
				<slot name="prefix">{{props.label}}</slot>
			</view>
			<view class="amxx-card-item__content" :style="{'justify-content':props.slotPosition}">
				<slot name="content"></slot>
			</view>
			<slot name="suffixIcon">
				<u-icon v-if="props.isIcon" :name="props.suffixIcon" :size="props.iconSize" :color="props.iconColor"></u-icon>
			</slot>
		</slot>
	</view>
</template>

<script lang="ts" setup>
	const props = defineProps({
		label: String,
		labelWidth: String,
		labelSize: String,
		border: {
			type: String,
			default: "u-border-bottom"
		},
		labelPosition: {
			type: String,
			default: "row"
		},
		slotPosition: {
			type: String,
			default: "flex-start"
		},
		isIcon: {
			type: Boolean,
			default: false
		},
		suffixIcon: {
			type: String,
			default: "play-right-fill"
		},
		iconSize: {
			type: [String, Number],
			default: 10
		},
		iconColor: {
			type: String,
			default: "#cbcbcb"
		}
	})
</script>

<style lang="scss" scoped>
	::v-deep .u-icon {
		transform: scale(.8);
	}

	.amxx-card-item {
		display: flex;
		padding: 32rpx 0;

		&.row {
			flex-direction: row;
			align-items: center;
			justify-content: space-between;

			&__content {
				margin-right: 16rpx;
			}
		}

		&.column {
			flex-direction: column;

			.amxx-card-item__title {
				justify-content: space-between;
			}

			.amxx-card-item__content {
				margin-top: 8rpx;
			}
		}

		&__title {
			margin-right: 16rpx;
			color: #222;
			font-weight: 500;
			display: flex;
			font-size: 28rpx;
			font-family: Medium;
		}

		&__content {
			flex: 1 1 0%;
			color: #999;
			display: flex;
			align-items: center;
			font-size: 28rpx;
		}
	}
</style>