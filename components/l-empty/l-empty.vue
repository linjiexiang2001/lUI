<template>
	<view class="empty-wrapper fade-in" :style="customStyle">
		<view class="empty-wrapper__content">
			<c-lottie ref="cLottieRef" :src='props.src' :data="props.data" :width="props.width" :height='props.height' :loop="props.loop"></c-lottie>
		</view>
		<view class="empty-wrapper__label" v-if="props.text">{{props.text}}</view>
		<slot name="button"></slot>
	</view>
</template>

<script setup>
	import { computed, reactive } from "vue";
	import system from "@/static/lottie/system.json";
	const props = defineProps({
		width: String,
		height: String,
		src: String,
		data: {
			type: String,
			default: system
		},
		text: String,
		loop: Boolean,
		customStyle: Object
	})
	const customStyle = computed(() => {
		return {
			...props.customStyle,
			width: props.width ? uni.$u.getPx(props.width) : "100%",
			height: props.height ? uni.$u.getPx(props.height) : "100%",
		}
	})
</script>

<style lang="scss" scoped>
	.empty-wrapper {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		margin: auto;

		&__content {
			// flex: 1;
			display: flex;
			flex-direction: row;
			align-items: center;
			justify-content: center;
		}

		&__label {
			color: #666;
			font-size: 3.5vw;
			letter-spacing: .4vw;
			margin-top: 2vmax;
			font-family: Medium;
		}
	}
</style>