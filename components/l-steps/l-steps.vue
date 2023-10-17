<script lang="ts" setup>
	import { provide } from "vue";
	const props = defineProps({
		direction: String,
		current: Number, //当前激活索引
		sum: Number, //时间线总数
		activeColor: {
			type: String,
			default: "#262a47"
		},
		inactiveColor: {
			type: String,
			default: "#969799"
		}
	})
	const test = '123';
	provide("l-steps", { props });
</script>

<template>
	<view class="l-steps" :class="[props.direction]">
		<slot></slot>
	</view>
</template>

<style lang="scss" scoped>
	.l-steps {
		display: flex;
		flex: 1 1 0%;

		&.row {
			flex-direction: row;
		}

		&.column {
			flex-direction: column;
		}
	}
</style>