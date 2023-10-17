<script lang="ts" setup>
	import { computed, inject, onMounted } from "vue";
	const lSteps = inject('l-steps');
	const props = defineProps({
		timestamp: Number,
		vIndex: Number,
		content: String
	})
	const formatTimestamp = computed(() => {
		return {
			time: props.timestamp ? formatDateDiff(props.timestamp) : '',
			hours: props.timestamp ? uni.$u.timeFormat(props.timestamp, 'hh:mm') : ''
		};
	})
	function formatDateDiff(timestamp : number) {
		if (!timestamp) return "";
		const now = new Date();
		const date = new Date(timestamp);
		// 计算日期差距（以天为单位）
		const timeDiff = Math.floor((now - date) / (24 * 60 * 60 * 1000));

		if (timeDiff === 0) {
			return '今天';
		} else if (timeDiff === 1) {
			return '昨天';
		} else if (timeDiff === 2) {
			return '前天';
		} else if (timeDiff <= 3) {
			return `${timeDiff}天前`;
		} else {
			return ''
			// // 超过三天，以年月日形式显示
			// const year = date.getFullYear();
			// const month = String(date.getMonth() + 1).padStart(2, '0');
			// const day = String(date.getDate()).padStart(2, '0');
			// return `${year}-${month}-${day}`;
		}
	}
	onMounted(() => {
		console.log(lSteps);
		console.log(formatTimestamp.value);
	})
</script>

<template>
	<view class="l-step-item">
		<view class="l-step-item__content" :class=" [ lSteps.props.direction  ] ">
			<view class="l-step-item-line" v-if="props.vIndex < (lSteps.props.sum-1)"></view>
			<view class="step-timestamp">
				<slot name="timestamp">
					<template v-if="props.timestamp">
						<text class="time">{{formatTimestamp.time}}</text>
						<text class="hours">{{formatTimestamp.hours}}</text>
					</template>
				</slot>
			</view>
			<view class="step-icon">
				<slot name="icon">
					<view class="dot" :style=" { backgroundColor : lSteps.props.current ===  props.vIndex ? lSteps.props.activeColor : lSteps.props.inactiveColor  } "></view>
				</slot>
			</view>
			<view class="step-content">
				<slot name="content">{{props.content}}</slot>
			</view>
		</view>
	</view>
</template>

<style lang="scss">
	.l-step-item {
		background-color: #fff;
		padding: 24rpx 0;
		box-sizing: content-box;
		// overflow: hidden;



		&__content {
			display: flex;
			position: relative;

			.l-step-item-line {
				height: 100rpx;
				// background-color: rgb(60, 156, 255);
				border-left: 1px dotted #F4552F;
				position: absolute;
				width: 1px;
				top: 48rpx;
				left: calc(15vw + 46rpx);
				z-index: 9;
			}

			&.row {
				flex-direction: column;
			}

			&.column {
				flex-direction: row;
				align-items: center;

				.step-timestamp {
					width: 15vw;
					display: flex;
					flex-direction: column;
					align-items: center;

					.time {
						white-space: nowrap;
						font-size: 28rpx;
						font-family: Bold;
						margin-bottom: 8rpx;
					}

					.hours {
						font-size: 26rpx;
						color: #666;
					}
				}

				.step-icon {
					width: 48rpx;
					height: 48rpx;
					display: flex;
					align-items: center;
					justify-content: center;
					margin: 0 24rpx;
					background-color: #fff;
					position: relative;
					z-index: 10;
					overflow: hidden;

					.dot {
						width: 12rpx;
						height: 12rpx;
						border-radius: 50%;
					}
				}

				.step-content {
					flex: 1;
					font-size: 22rpx;
					color: #666;
				}
			}
		}
	}
</style>