<template>
	<view class="l-to" @tap.stop="tools.jumpTo(url,data,mode)">
		<slot></slot>
	</view>
</template>

<script lang="ts" setup>
	import tools from '@/tools/index';
	const props = defineProps({
		url: String,
		data: Object,
		mode: Number
	})
</script>

<style lang="scss" scoped>

</style>