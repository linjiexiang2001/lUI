<script lang="ts" setup>
	import { computed, onMounted, ref, reactive, nextTick, watchEffect } from "vue";
	const props = defineProps({
		modelValue: Array,
		rows: {
			type: Number,
			required: true
		},//一行容纳的个数
		accept: {
			type: String,
			default: 'image'
		},//接受的文件类型，file只支持H5（只有微信小程序才支持把accept配置为all、media）
		capture: {
			type: [String, Array],
			default: () => { return ['album', 'camera'] }
		}, //图片或视频拾取模式，当accept为image类型时设置capture可选额外camera可以直接调起摄像头
		compressed: {
			type: Boolean,
			default: true
		},//当accept为video时生效，是否压缩视频，默认为true
		maxDuration: {
			type: Number,
			default: 60
		},
		maxCount: { //最大选择图片的数量
			type: Number,
			default: 9,
		},
		disabled: { //是否禁用组件
			type: Boolean,
			default: false
		},
		name: { //图片上传的目录名称 
			type: String,
			default: "file",
		},
		sizeType: {
			type: Array,
			default: () => { return ['original', 'compressed'] }
		},
		multiple: { //是否开启图片多选，部分安卓机型不支持
			type: Boolean,
			default: true
		},
		deletable: { //是否显示删除图片的按钮
			type: Boolean,
			default: true
		},
		maxSize: { // 文件大小限制 字节
			type: [String, Number],
			default: Number.MAX_VALUE
		},
		uploadText: {
			type: String,
			default: "上传图片"
		},
		crop: {
			type: Object,//图片裁切参数
		},
		width: {
			type: [String, Number],
		},
		height: {
			type: [String, Number],
		},
		autoUpload: {
			type: Boolean,
			default: true
		}
	})
	const emits = defineEmits(['update:modelValue'])
	interface uploadState {
		fileList : EmptyArrayType
	}
	const state = reactive({
		fileList: [],
	} as uploadState);

	const realWidth = computed(() => {
		return uni.$u.addUnit(props.width)
	})
	const realHeight = computed(() => {
		return uni.$u.addUnit(props.height)
	})
	const uploadRatio = ref();
	let errorFiles = [] as EmptyArrayType;
	watchEffect(() => {
		console.log(props.modelValue)
	})
	function chooseFiles() {
		switch (props.accept) {
			case 'image':
				uni.chooseImage({
					count: props.multiple ? props.maxCount - props.modelValue.length : 1,
					sizeType: props.sizeType,
					sourceType: props.sourceType,
					crop: props.crop,
				}).then((res : any) => {
					console.log(res)
					errorFiles = res.tempFiles.filter((item : File) => item.size > props.maxSize);
					state.fileList = res.tempFiles.filter((item : File) => item.size < props.maxSize);
					if (errorFiles.length > 0) {
						uni.$tools.tips(`${errorFiles.length}个文件大小超出限制`)
					}
					emits('update:modelValue', props.modelValue.concat(state.fileList.map((item : File) => item.path)))
					console.log(state.fileList)
				})
				break;
			case 'video':

				break;
			case 'file':

				break;
		}
	}
	function deleteMedia(index : number) {
		props.modelValue.splice(index, 1)
	}
	function previewImage(urls : EmptyArrayType, index : number) {
		uni.previewImage({ urls: urls, current: index })
	}
	onMounted(() => {
		const query = uni.createSelectorQuery().in(this);
		query.select('.l-upload').boundingClientRect((res : domType) => {
			uploadRatio.value = (res.width / props.rows) - 4;
		}).exec()
	})
</script>

<template>
	<view class="l-upload" :style="{ 'grid-template-columns': `${'1fr '.repeat(Number(props.rows))}` }">
		<template v-if="props.modelValue&&props.modelValue.length>0">
			<view class="l-upload-grid flex-column" v-for="media,mediaIndex in props.modelValue">
				<image :src="media" :style="{ width: props.width ?? `${uploadRatio}px`, height: props.width ?? `${uploadRatio}px` }" mode="aspectFill" @click="previewImage(props.modelValue,mediaIndex)"></image>
				<view class="media-close" @click.stop="deleteMedia(mediaIndex)">
					<u-icon name="close-circle-fill" color='#000' size="16"></u-icon>
				</view>
			</view>
		</template>
		<view class="l-upload-grid flex-column" v-if="props.modelValue.length < props.maxCount" @click="chooseFiles()">
			<image src="../../../../static/images/choose.png" :style="{ width: props.width ?? `${uploadRatio}px`, height: props.width ?? `${uploadRatio}px` }"></image>
			<text class="l-upload__text u-m-t-12">{{ props.uploadText }}</text>
		</view>
	</view>
</template>

<style lang="scss">
	.l-upload {
		flex: 1 1 0%;
		display: grid;
		gap: 4px;

		.l-upload-grid {
			align-items: center;
			position: relative;

			.media-close {
				display: flex;
				align-items: center;
				justify-content: center;
				border-radius: 50rpx;
				top: -8rpx;
				right: -8rpx;
				position: absolute;

			}
		}

		&__text {
			font-size: 22rpx;
			color: #666;
		}
	}
</style>