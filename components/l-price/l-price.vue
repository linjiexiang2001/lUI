<script lang="ts" setup>
	import tools from '@/tools/index.ts';
	import countTo from '@/plugin/count/countTo.js';
	import { computed, reactive, watch, watchEffect } from "vue";
	let countToTask;
	const props = defineProps({
		symbol: {
			type: String,
			default: "￥"
		},
		decimals: {
			type: [Number, String],
			default: 2,
		},
		count: [Number, String, Array],
		text: "",
		size: [Number, String], //总体字体大小
		symbolSize: String, //符号大小
		beforeSize: [Number, String], //前置字体大小
		beforeOffset: String, //前置字体偏移
		afterSize: [Number, String], //后置字体大小
		afterOffset: String, //后置字体偏移
		color: {
			type: String,
			default: '#ea0029'
		}, //字体颜色
		isCount: Boolean, //是否数字滚动
		duration: {
			type: Number,
			default: () => {
				return 550
			}
		},
		textLine: {
			type: Boolean,
			default: () => { return false }
		}
	})
	const state = reactive({
		number: null
	})
	const countOf = computed(() => {
		return Array.isArray(props.count) ? 'array' : typeof props.count;
	})
	watch(() => props.count, (v1, v2) => {
		if (props.isCount) {
			countToTask && countToTask.reset();
			countToTask = new countTo({
				startVal: v2,
				endVal: v1,
				duration: props.duration,
				decimals: props.decimals,
				change: (val) => {
					state.number = val;
				}
			})
		} else {
			state.number = props.count;
		}
	}, { immediate: true })
	// watchEffect(() => {
	// 	if (props.isCount) {
	// 		countToTask && countToTask.reset();
	// 		countToTask = new countTo({
	// 			startVal: 0,
	// 			endVal: props.count,
	// 			duration: props.duration,
	// 			decimals: props.decimals,
	// 			change: (val) => {
	// 				state.number = val;
	// 			}
	// 		})
	// 	} else {
	// 		state.number = props.count;
	// 	}
	// })
	function priceFormat(a) {
		return tools.priceFormat(a, props.decimals)
	}
	function formatStyle(index) {
		let customStyle = {};
		if (props.color) customStyle['color'] = props.color;
		switch (index) {
			case 0:
				if (!props.size && props.beforeSize) customStyle['font-size'] = uni.$u.addUnit(props.beforeSize);
				if (props.beforeOffset) customStyle = Object.assign(customStyle, uni.$u.addStyle(props.beforeOffset))
				break;
			case 1:
				if (!props.size && props.afterSize) customStyle['font-size'] = uni.$u.addUnit(props.afterSize);
				if (props.afterOffset) customStyle = Object.assign(customStyle, uni.$u.addStyle(props.afterOffset))
				break;
		}
		if (props.size) customStyle = Object.assign(customStyle, { 'font-size': uni.$u.addUnit(props.size) });
		if (props.textLine) customStyle = Object.assign(customStyle, { 'text-decoration': 'line-through' });
		return customStyle;
	}
</script>

<template>
	<view class="format-price">
		<view class="format-slot">
			<slot name="before"></slot>
		</view>
		<template v-if="countOf !== 'array'">
			<view class="formatPrice" :style="{color:props.color}">
				<text class="symbol" v-if="props.symbol" :style="{'font-size':props.symbolSize||'26rpx',color:props.color}">{{symbol}}</text>
				<template v-if="props.count || props.count === 0">
					<text class="num" :class="pIndex===0?'first':'last'" :style="formatStyle(pIndex)" v-for="(price,pIndex) in priceFormat(state.number)" :key="pIndex">{{ price }}</text>
				</template>
				<template v-else>
					<text class="num-empty">----</text>
				</template>
				<text class="text">{{props.text}}</text>
			</view>
		</template>
		<template v-else>
			<view class="formatPrice inner">
				<text class="num" :class="pIndex===0?'first':'last'" :style="formatStyle(pIndex)" v-for="(price,pIndex) in priceFormat(state.number[0])" :key="pIndex">{{ price }}</text>
				<text class="text">{{props.text}}</text>
			</view>
			<text class="format-divide">-</text>
			<view class="formatPrice inner">
				<text class="num" :class="pIndex===0?'first':'last'" :style="formatStyle(pIndex)" v-for="(price,pIndex) in priceFormat(state.number[1])" :key="pIndex">{{ price }}</text>
				<text class="text">{{props.text}}</text>
			</view>
		</template>
		<view class="format-slot ">
			<slot name="after"></slot>
		</view>
	</view>
</template>


<style lang="scss" scoped>
	.format-price {
		display: flex;
		flex-direction: row;
		align-items: baseline;
		line-height: 1;

		.format-divide {
			font-family: Bebas;
			margin: 0 6rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			font-size: 26rpx;
			font-weight: bold;
			color: #F83E46;
		}

		.formatPrice {
			// flex: 1;
			display: flex;
			flex-direction: row;
			align-items: baseline;
			// white-space: nowrap;
			// overflow: hidden;
			// text-overflow: ellipsis;
			text-transform: initial;
			font-family: Bebas;

			.symbol {
				color: #F83E46;
				font-weight: bold;
				text-transform: initial;
			}

			.num {
				color: #F83E46;
				position: relative;
				/* #ifdef APP-NVUE */
				top: 2rpx;

				/* #endif */
				&.first {
					/* #ifdef APP-NVUE */
					position: relative;
					top: 2rpx;
					/* #endif */
				}

				&.last {
					font-family: Bebas;
				}
			}

			&.inner {
				.num {
					color: #F83E46;
					font-weight: bold;
					font-family: Bebas;
					position: relative;
					/* #ifdef APP-NVUE */
					top: 2rpx;

					/* #endif */
					.first {
						font-size: 24rpx;
						font-family: Bebas;
					}

					.last {
						font-size: 32rpx;
						font-family: Bebas;
					}
				}

			}
		}

		.format-slot {
			font-size: 24rpx;
			color: #666;
			white-space: nowrap;
		}
	}
</style>