<template>
	<u-popup :show="visible" mode="bottom" round="24" @close="closeDialog">
		<view class="picker-main">
			<view class="picker-header u-border-bottom">
				<view class="header-slot" @click="visible = false">取消</view>
				<view class="header-title">{{headerTitle}}</view>
				<!-- :style="{visibility:headerTitle && pickerTab !== 0 ?'visible':'hidden'}" -->
				<view class="header-slot">
					<span v-if="headerTitle && pickerTab !== 0" @click="changePickerTab">切换城市</span>
					<u-icon name="https://api.iconify.design/oi:reload.svg?color=%23666666" color="#333" size="12" label="重新定位" label-size="13" v-else @click="reloadLocaion()"></u-icon>
				</view>
			</view>
			<view class="picker-wrap fade-in">
				<scroll-view scroll-y scroll-with-animation class="u-tab-view menu-scroll-view left-box" :scroll-top="scrollTop">
					<view v-if="pickerTab === 0" :class="pickerOptions.columsIndexs[pickerTab] === ''? 'u-tab-item active':'u-tab-item' " @tap.stop="swichMenu('')">
						<text class="u-line-1">热门</text>
					</view>
					<view v-for="(item,lindex) in pickerOptions.colums" :key="lindex" :class="pickerOptions.columsIndexs[pickerTab] === lindex? 'u-tab-item active':'u-tab-item' " :data-current="lindex" @tap.stop="swichMenu(lindex)">
						<text class="u-line-1">{{item.label??item}}</text>
					</view>
				</scroll-view>
				<scroll-view scroll-y scroll-with-animation class="u-tab-view right-box">
					<template v-if="pickerOptions.dataPool">
						<view v-for="(item,rindex) in pickerOptions.dataPool" :key="rindex" @click="chooseColumItem(rindex)" class="u-tab-item" :data-current="rindex">
							<text class="u-line-1">{{item.label??item}}</text>
							<image class="line-icon" v-if="pickerOptions.dataPoolIndexs[pickerTab] === rindex" src="https://api.iconify.design/mi:check.svg?color=%232abfb4" mode="aspectFill"></image>
						</view>
					</template>
				</scroll-view>
			</view>
			<view class="picker-footer u-border-top">
				<view class="picker-footet-btn" @click="resetPicker">重置</view>
				<view class="picker-footet-btn" :class="{active:headerTitle}" @click="confirmCity">确定</view>
			</view>
		</view>
	</u-popup>
</template>

<script>
	import provinces from "./province.json";
	import citys from "./city.json";
	import areas from "./area.json";
	let lastCurrent = 0; //上次的index
	let startX = 0;
	let startY = 0;
	let diffTime = 0;
	let slapNo = ['11', '12', '31', '50'];
	let CN_HK_CN_MC_CN_TW = ['66', '67', '68'];
	import tools from '@/tools/index';
	//引入JSONP
	import {
		jsonp
	} from 'vue-jsonp';
	export default {
		props: {
			rank: {
				type: Number,
				default: 3, //深入级别 3深入到区  2 深入到市
			}
		},
		emits: ['confirm'],
		data() {
			return {
				vStaticMock: {
					provinces: provinces,
					citys: citys,
					areas: areas,
				},
				visible: false,
				cityOption: {
					province: null,
					city: null,
					area: null,
				},
				pickerOptions: {
					colums: [], //左侧列数据
					columsIndexs: ['', 0], //左侧索引
					dataPool: [], //右侧列数据
					dataPoolIndexs: ['', ''], //右侧索引
				},
				pickerTab: 0, // 0 选择城市 1选择区
				scrollTop: 0,
				menuHeight: 0,
				menuItemHeight: 0,
				headerTitle: '',
				diffNum: 0,
				pickerMode: 3, //深入级别 3深入到区  2 深入到市
			}
		},
		watch: {
			'pickerOptions.dataPoolIndexs': {
				handler(n) {
					if (this.pickerTab === 0) this.cityOption.city = this.pickerOptions.dataPool[this.pickerOptions.dataPoolIndexs[this.pickerTab]]
					else this.cityOption.area = this.pickerOptions.dataPool[this.pickerOptions.dataPoolIndexs[this.pickerTab]]
				},
				deep: true
			},
			rank: {
				handler: function() {
					this.pickerMode = this.rank;
				},
				immediate: true
			}
		},
		methods: {
			closeDialog() {
				this.visible = false;
				Object.assign(this.$data, this.$options.data())
				this.resetPicker()
				this.pickerOptions = {
					colums: [], //左侧列数据
					columsIndexs: ['', 0], //左侧索引
					dataPool: [], //右侧列数据
					dataPoolIndexs: ['', ''], //右侧索引
				}
				this.cityOption = {
					province: null,
					city: null,
					area: null,
				}
			},
			reloadLocaion() {
				let that = this;
				that.headerTitle = '';
				// #ifdef H5
				jsonp('https://restapi.amap.com/v3/ip?parameters', {
					key: 'd76dc4b35427dae0e4cfe503a93c1f3d',
				}).then(res => {
					if (res.rectangle.length > 0) {
						let pIndex = that.vStaticMock.provinces.findIndex((item) => item.label === res.province);
						let cIndex = that.vStaticMock.citys[pIndex].findIndex((item) => item.label === res.city);
						this.cityOption.province = that.vStaticMock.provinces[pIndex];
						this.cityOption.city = that.vStaticMock.citys[pIndex][cIndex]
						that.initComponent({ label: res.city, value: res.adcode });
						that.$nextTick(() => {
							tools.tips(`已为您切换至${res.city}`)
						})
					} else {
						tools.tips('定位失败')
					}
				})
				// #endif
				// #ifndef H5
				uni.getLocation({
					geocode: true,
					type: 'gcj02',
					success(res) {
						try {
							let pIndex = that.vStaticMock.provinces.findIndex((item) => item.label === res.address.province);
							let cIndex = that.vStaticMock.citys[pIndex].findIndex((item) => item.label === res.address.city);
							let aIndex = that.vStaticMock.areas[pIndex][cIndex].findIndex((item) => item.label === res.address.district);
							this.cityOption = {
								province: that.vStaticMock.provinces[pIndex],
								city: that.vStaticMock.citys[pIndex][cIndex],
								area: that.vStaticMock.areas[pIndex][cIndex][aIndex]
							}
							that.initComponent(that.vStaticMock.areas[pIndex][cIndex][aIndex]);
							that.$nextTick(() => {
								tools.tips(`已为您切换至${res.address.city} ${res.address.district}`);
							})
						} catch (e) {
							//TODO handle the exception
							console.error(e)
						}
					},
				})
				// #endif
			},
			confirmCity() {
				let that = this;
				if (!that.headerTitle) {
					tools.tips('请先选择城市');
				} else {
					let isSlap, prefix, prefixIndex, pStr, pIndex, cStr, cIndex, aStr, aIndex;
					let result = { province: null, city: null, area: null, district: null };
					try {
						let keyword = this.cityOption?.area || this.cityOption?.city || this.cityOption?.province;
						pStr = keyword.value.substr(0, 2);
						pIndex = this.BinarySearch(this.vStaticMock.provinces.map((item) => item?.value), pStr); //省的前缀
						isSlap = slapNo.findIndex(item => item === pStr) > -1; // 是否是直辖市
						result.province = that.vStaticMock.provinces[pIndex];
						result.district = [result.province.label];
						if (this.pickerMode >= 2) {
							cStr = keyword.value.substr(0, 4);
							cIndex = isSlap ? 0 : this.BinarySearch(this.vStaticMock.citys[pIndex].map((item) => item?.value), cStr);
							result.city = that.vStaticMock.citys[pIndex][cIndex];
							result.district.push(result.city.label);
						}
						if (this.pickerMode > 2) {
							aIndex = this.BinarySearch(this.vStaticMock.areas[pIndex][cIndex].map((item) => item?.value), this.cityOption?.area?.value);
							result.area = that.vStaticMock.areas[pIndex][cIndex][aIndex];
							result.district.push(result.area.label);
						}
						result.district = result.district.toString().replace(/,/g, " ");
					} catch (e) {
						console.error(e)
					}
					console.log(result, 'result');
					if (that.pickerOptions.dataPoolIndexs[1] !== '' && that.pickerMode === 3) {
						that.$emit('confirm', {
							value: that.pickerOptions.dataPool[that.pickerOptions.dataPoolIndexs[1]],
							options: result || this.cityOption
						});

					} else if (that.pickerMode === 2) {

						let { label, value } = that.pickerOptions.dataPool[that.pickerOptions.dataPoolIndexs[1]];
						prefix = String(value).substr(0, 2);
						isSlap = slapNo.findIndex(item => item === prefix) > -1; // 是否是直辖市
						if (isSlap && that.pickerOptions.columsIndexs[0] !== '') {
							prefixIndex = that.BinarySearch(that.vStaticMock.provinces.map((item) => item?.value), prefix);
							that.$emit('confirm', {
								value: that.pickerOptions.colums[prefixIndex],
								options: result || this.cityOption
							})
						} else {
							that.$emit('confirm', {
								value: that.vStaticMock.citys[pIndex][cIndex],
								options: result || this.cityOption
							})
						}
					}
					that.visible = false;
				}
			},
			resetPicker() {
				this.pickerTab = 0;
				this.scrollTop = 0;
				this.headerTitle = '';
				this.pickerMode = this.rank || 3;
				this.pickerOptions.colums = this.vStaticMock.provinces;
				this.pickerOptions.dataPool = this.pickerTab === 0 ? [{ label: '北京市', value: 11 }, { label: '上海市', value: 31 }, { label: '深圳市', value: 4403 }, { label: '广东省', value: 44 }] : this.vStaticMock.citys[this.pickerOptions.columsIndexs[this.pickerTab]]
				this.pickerOptions.columsIndexs[0] = '';
				this.pickerOptions.dataPoolIndexs = ['', ''];
			},
			changePickerTab() {
				let x = this.pickerTab === 0 ? 1 : 0;
				this.headerTitle = '';
				if (this.pickerTab === 0) {
					this.pickerOptions.colums = this.vStaticMock.provinces;
					this.pickerOptions.dataPool = this.pickerTab === 0 ? [{ label: '北京市', value: 11 }, { label: '上海市', value: 31 }, { label: '深圳市', value: 4403 }, { label: '广东省', value: 44 }] : this.vStaticMock.citys[this.pickerOptions.columsIndexs[this.pickerTab]]
					this.pickerTab = this.pickerTab === 0 ? 1 : 0;
					this.$nextTick(() => {
						this.scrollMenu(this.pickerOptions.columsIndexs[0])
					})

				} else {
					let { label, value } = this.pickerOptions.dataPool[0];
					let prefix = Number(String(value).substr(0, 2));
					let isSlap = slapNo.findIndex(item => item === prefix) > -1; // 是否是直辖市
					if (isSlap) { //直辖市
						let prefixIndex = this.BinarySearch(this.vStaticMock.provinces.map((item) => item?.value), prefix);
						this.pickerOptions.colums = this.vStaticMock.provinces;
						if (this.pickerOptions.columsIndexs[0] === '') { //渲染热门列表
							this.pickerOptions.dataPool = [{ label: '北京市', value: 11 }, { label: '上海市', value: 31 }, { label: '深圳市', value: 4403 }, { label: '广东省', value: 44 }]
						} else { //渲染正常的市数据
							this.pickerOptions.dataPool = this.vStaticMock.citys[prefixIndex];
						}
						this.pickerOptions.columsIndexs[0] = null;
						this.pickerTab = this.pickerTab === 0 ? 1 : 0;
						this.$nextTick(() => {
							this.scrollTop = this.pickerOptions.columsIndexs[x] === '' ? 0 : this.pickerOptions.columsIndexs[x] * this.menuItemHeight + this.menuItemHeight / 2 - this.menuHeight / 2;
						})
					} else {
						//判断当前城市是不是省份
						let privince = this.BinarySearch(this.vStaticMock.provinces.map((item) => item?.value), value);
						if (privince > -1) { //是省份
							this.pickerOptions.colums = this.vStaticMock.provinces;
							this.pickerOptions.dataPool = this.vStaticMock.citys[this.pickerOptions.columsIndexs[x]]
							this.pickerTab = this.pickerTab === 0 ? 1 : 0;
							this.$nextTick(() => {
								this.scrollMenu(this.pickerOptions.columsIndexs[x] === '' ? 0 : this.pickerOptions.columsIndexs[x]);
								// this.scrollTop = this.pickerOptions.columsIndexs[x] === '' ? 0 : this.pickerOptions.columsIndexs[x] * this.menuItemHeight + this.menuItemHeight / 2 - this.menuHeight / 2;
							})
						} else { //是市级
							this.pickerOptions.colums = this.vStaticMock.provinces;
							if (this.pickerOptions.columsIndexs[0] === '') { //如果当前停留在热门 则渲染热门列表
								this.pickerOptions.dataPool = [{ label: '北京市', value: 11 }, { label: '上海市', value: 31 }, { label: '深圳市', value: 4403 }, { label: '广东省', value: 44 }];
								this.headerTitle = '';
							} else {
								this.pickerOptions.colums = this.vStaticMock.provinces;
								this.pickerOptions.dataPool = this.vStaticMock.citys[this.pickerOptions.columsIndexs[0]];
							}
							this.pickerTab = this.pickerTab === 0 ? 1 : 0;
							this.$nextTick(() => {
								this.scrollMenu(this.pickerOptions.columsIndexs[x] === '' ? 0 : this.pickerOptions.columsIndexs[x]);
								// this.scrollTop = this.pickerOptions.columsIndexs[x] === '' ? 0 : this.pickerOptions.columsIndexs[x] * this.menuItemHeight + this.menuItemHeight / 2 - this.menuHeight / 2;
							})
						}

					}
				}

			},
			chooseColumItem(val) { //点击右侧选择
				let x = this.pickerTab;
				let y = this.pickerOptions.dataPoolIndexs;
				let { label, value } = this.pickerOptions.dataPool[val];
				console.log(this.vStaticMock, x);
				switch (x) {
					case 0: //选择城市
						console.log('选择城市');
						let columIndex = this.BinarySearch(this.pickerOptions.colums.map((item) => item?.value), value);
						let isSlap = slapNo.findIndex(item => item === value.toString().substr(0, 2)) > -1; // 是否是直辖市
						let prefix = String(value).substr(0, 2);
						let prefixIndex = this.BinarySearch(this.pickerOptions.colums.map((item) => item?.value), prefix);
						this.pickerOptions.dataPoolIndexs[1] = '';
						if (CN_HK_CN_MC_CN_TW.includes(prefix)) {
							console.log(prefixIndex);
							this.headerTitle = label || this.vStaticMock.citys[prefixIndex].label;
							this.pickerMode = 2;
							this.pickerTab = 1;
							this.pickerOptions.columsIndexs[this.pickerTab] = prefixIndex;
							this.pickerOptions.dataPool = this.vStaticMock.citys[prefixIndex];
							this.pickerOptions.dataPoolIndexs[1] = this.BinarySearch(this.vStaticMock.citys[prefixIndex].map((item) => item.value), value)
						} else if (isSlap || columIndex === -1) { //选择直辖市或者城市 跳转至选择区
							/* 如果是直辖市则直接显示直辖市名称 */
							// this.headerTitle = isSlap ? label : this.vStaticMock.citys[prefixIndex].filter((item) => item.label == label)[0].label;
							this.pickerMode = 3;
							this.headerTitle = isSlap ? label : this.vStaticMock.citys[prefixIndex].label;
							this.pickerOptions.dataPoolIndexs[x] = val;
							if (this.pickerMode === 2) return;
							this.cityOption.province = this.vStaticMock.provinces[prefixIndex];
							this.cityOption.city = this.vStaticMock.citys[prefixIndex][isSlap ? 0 : val];
							this.pickerTab = 1;
							x = 1;
							this.scrollTop = 0;
							this.$nextTick(() => {
								console.log(this.vStaticMock.areas[prefixIndex], val, columIndex);
								this.pickerOptions.dataPoolIndexs[x] = '';
								this.pickerOptions.colums = ['区域'];
								if (isSlap) this.pickerOptions.dataPool = this.vStaticMock.areas[prefixIndex][0];
								else this.pickerOptions.dataPool = this.vStaticMock.areas[prefixIndex][val];
							})
						} else { //当前选择的是省 则左侧切换到对应的省
							this.pickerOptions.dataPoolIndexs[x] = ''; //先置空当前选项
							if (columIndex === -1) {
								tools.tips('没有对应的省份');
								return
							} else {
								this.swichMenu(columIndex); //切换到对应的省份
							}
						}
						break;
					case 1: //选择区
						console.log('选择区');
						this.pickerOptions.dataPoolIndexs[x] = val;
						this.headerTitle = label;
						this.cityOption.area = this.pickerOptions.dataPool[val];
						// this.$emit('confirm', { value: this.pickerOptions.dataPool[val], options: this.cityOption })
						// this.visible = false;
						break;
				}
			},
			getRightColums() { //根据左侧切换右侧列数据
				let x = this.pickerTab;
				let y = this.pickerOptions.columsIndexs;
				switch (this.pickerTab) {
					case 0: //选择城市
						if (y[x] === '') { //点击了热门城市
							this.pickerOptions.dataPool = [{ label: '北京市', value: 11 }, { label: '上海市', value: 31 }, { label: '深圳市', value: 4403 }, { label: '广东省', value: 44 }];
						} else {
							this.pickerOptions.dataPool = this.vStaticMock.citys[y[x]];
							this.cityOption.province = this.vStaticMock.provinces[y[x]];
						}
						break;
					case 1: //选择区域
						break;
				}
			},
			async scrollMenu(index) {
				console.log(index, '滚动索引');
				// // 如果为0，意味着尚未初始化
				if (this.menuHeight == 0 || this.menuItemHeight == 0) {
					await this.getElRect('menu-scroll-view', 'menuHeight');
					await this.getElRect('u-tab-item', 'menuItemHeight');
				}
				// // 将菜单菜单活动item垂直居中
				this.scrollTop = index === '' ? 0 : index * this.menuItemHeight + this.menuItemHeight / 2 - this.menuHeight / 2;
			},
			// 点击左边的栏目切换
			async swichMenu(index, row) {
				this.pickerTab = 0;
				if (index === this.pickerOptions.columsIndexs[this.pickerTab]) return;
				lastCurrent = this.pickerOptions.columsIndexs;
				this.pickerOptions.columsIndexs[this.pickerTab] = index;
				this.pickerOptions.dataPoolIndexs = ['', ''];
				this.pickerOptions.dataPoolIndexs[this.pickerTab] = row ? row.index : '';
				this.headerTitle = row ? row.label : '';
				this.cityOption = {
					province: null,
					city: null,
					area: null,
				}
				this.$nextTick(() => {
					this.scrollMenu(index);
					this.getRightColums();
				})
			},
			// 获取一个目标元素的高度
			getElRect(elClass, dataVal) {
				new Promise((resolve, reject) => {
					const query = uni.createSelectorQuery().in(this);
					query.select('.' + elClass).fields({
						size: true
					}, res => {
						// 如果节点尚未生成，res值为null，循环调用执行
						if (!res) {
							setTimeout(() => {
								this.getElRect(elClass);
							}, 10);
							return;
						}
						this[dataVal] = res.height;
					}).exec();
				})
			},
			initComponent(row) {
				let that = this;
				if (row) {
					that.headerTitle = '';
					let { label, value } = row;
					let prefix = String(value).substr(0, 2); //省级前缀
					let prefixIndex = that.BinarySearch(that.vStaticMock.provinces.map((item) => item?.value), prefix) //省级下标
					let isSlap = slapNo.findIndex(item => item === prefix) > -1; // 是否是直辖市
					if (CN_HK_CN_MC_CN_TW.includes(prefix)) {
						that.pickerMode = 2;
						that.pickerOptions.colums = that.pickerMode === 2 ? that.vStaticMock.provinces : ['区域'];
						that.pickerOptions.columsIndexs[1] = prefixIndex;
						that.pickerOptions.dataPool = that.vStaticMock.citys[prefixIndex];
						that.visible = true;
						that.$nextTick(() => {
							that.swichMenu(prefixIndex);
							that.$nextTick(async () => {
								that.pickerTab = 1;
								that.headerTitle = label || that.vStaticMock.citys[prefixIndex].filter((item) => item.label == label)[0].label;
								that.pickerOptions.dataPoolIndexs[1] = await that.BinarySearch(that.vStaticMock.citys[prefixIndex].map((item) => item.value), value);
								console.log(that.pickerOptions.columsIndexs, that.pickerTab);
							})
						})


					} else if (isSlap) {
						/* 如果是直辖市则直接显示直辖市名称 */
						that.headerTitle = isSlap ? label : that.vStaticMock.citys[prefixIndex].filter((item) => item.label == label)[0].label;
						that.pickerOptions.dataPoolIndexs[0] = 0;
						that.pickerOptions.colums = that.pickerMode === 2 ? that.vStaticMock.provinces : ['区域'];
						that.pickerTab = that.pickerMode === 2 ? 0 : 1;
						that.visible = true;
						that.$nextTick(() => {
							if (that.pickerMode !== 2) {
								that.scrollTop = 0;
								that.pickerOptions.columsIndexs[0] = prefixIndex;
								that.pickerOptions.dataPool = that.vStaticMock.areas[prefixIndex][0];
								that.pickerOptions.dataPoolIndexs[1] = that.BinarySearch(that.vStaticMock.areas[prefixIndex][0].map((item) => item?.value), value)
							} else {
								that.swichMenu(prefixIndex);
								that.$nextTick(() => {
									that.headerTitle = that.pickerOptions.colums[prefixIndex].label;
									that.pickerOptions.dataPoolIndexs[0] = 0;
								})
							}
						})
					} else {
						let cityPrefix = String(value).substr(0, 4); //市级前缀
						let cityIndex = that.BinarySearch(that.vStaticMock.citys[prefixIndex].map((item) => item?.value), cityPrefix); //市级下标
						let areaIndex = that.BinarySearch(that.vStaticMock.areas[prefixIndex][cityIndex].map((item) => item?.value), value); //区级下标
						if (areaIndex > -1) { //是区级
							that.pickerTab = 1;
							that.pickerOptions.colums = ['区域'];
							that.pickerOptions.dataPool = that.vStaticMock.areas[prefixIndex][cityIndex];
							that.pickerOptions.columsIndexs[0] = prefixIndex;
							that.pickerOptions.dataPoolIndexs[0] = cityIndex;
							that.pickerOptions.columsIndexs[1] = 0;
							that.pickerOptions.dataPoolIndexs[1] = areaIndex;
							that.headerTitle = label;
							that.visible = true;
						} else { //是市
							that.pickerTab = 0;
							that.pickerOptions.colums = that.vStaticMock.provinces;
							that.pickerOptions.dataPool = that.vStaticMock.citys[prefixIndex];
							that.pickerOptions.columsIndexs[0] = '';
							that.pickerOptions.dataPoolIndexs[0] = cityIndex;
							that.visible = true;
							that.$nextTick(() => {
								that.swichMenu(prefixIndex, {
									label,
									value,
									index: cityIndex
								})
							})
						}
					}
				} else {
					that.visible = true;
					if (that.pickerTab === 0) {
						that.pickerOptions.colums = that.vStaticMock.provinces;
						that.pickerOptions.dataPool = that.pickerOptions.columsIndexs[that.pickerTab] === '' ? [{ label: '北京市', value: 11 }, { label: '上海市', value: 31 }, { label: '深圳市', value: 4403 }, { label: '广东省', value: 44 }] : this.vStaticMock.citys[this.pickerOptions.columsIndexs[this
							.pickerTab]]
					}
				}
			},
			BinarySearch(arr, target) {
				if (arr.length <= 1) return -1
				// 低位下标
				let lowIndex = 0
				// 高位下标
				let highIndex = arr.length - 1
				while (lowIndex <= highIndex) {
					// 中间下标
					const midIndex = Math.floor((lowIndex + highIndex) / 2)
					if (Number(target) < Number(arr[midIndex])) {
						highIndex = midIndex - 1
					} else if (Number(target) > Number(arr[midIndex])) {
						lowIndex = midIndex + 1
					} else {
						// target === arr[midIndex]
						return midIndex
					}
				}
				return -1
			},
		}
	}
</script>

<style lang="scss" scoped>
	::v-deep .u-icon__label {
		margin-left: 12rpx !important;
	}

	.picker-main {
		width: 100vw;
		/* #ifdef APP-PLUS */
		height: calc(100vh - (var(--window-top) + var(--status-bar-height)));
		/* #endif */
		/* #ifdef H5 */
		height: calc(100vh - (var(--window-top) + 44px));
		/* #endif */
		/* #ifdef MP */
		height: calc(100vh - (var(--window-top) + 65rpx + var(--status-bar-height)));
		/* #endif */
		background-color: #fff;
		display: flex;
		flex-direction: column;
		justify-content: space-between;

		.picker-header {
			width: 100%;
			height: 120rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 0 32rpx;

			.header-slot {
				width: 30vw;
				// width: 150rpx;
				font-size: 26rpx;
				font-weight: 550;
				display: flex;
				align-items: center;

				&:first-child {
					justify-content: flex-start;
				}

				&:last-child {
					justify-content: flex-end;
				}
			}

			.header-title {
				font-size: 32rpx;
				font-weight: 600;
			}
		}

		.picker-wrap {
			width: 100%;
			height: calc(100% - 240rpx);
			display: flex;

			.u-tab-view {
				overflow: hidden;

				&.left-box {
					width: 250rpx;
					background-color: #fff;
				}

				&.right-box {
					flex: 1;
					background-color: #f7f7f7;

					.u-tab-item {
						display: flex;
						align-items: center;
						justify-content: space-between;
						padding-left: 48rpx;
						padding-right: 32rpx;
					}
				}
			}

			.u-tab-item {
				height: 110rpx;
				box-sizing: border-box;
				display: flex;
				align-items: center;
				justify-content: center;
				font-size: 28rpx;
				color: #666;

				&.active {
					font-size: 32rpx;
					font-weight: 600;
					color: #222;
					position: relative;

					&:before {
						content: "";
						position: absolute;
						background: $color;
						width: 6rpx;
						height: 48rpx;
						left: 0rpx;
						top: calc(50% - 24rpx);
						border-radius: 4rpx;
					}
				}

				.line-icon {
					width: 32rpx !important;
					height: 32rpx !important;
				}
			}
		}

		.picker-footer {
			width: 100%;
			height: 120rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 0 32rpx;

			.picker-footet-btn {
				height: 88rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				border-radius: 40rpx;

				&.active {
					opacity: 1 !important;
				}

				&:first-child {
					background: rgba(92, 235, 224, 0.2);
					flex: 1;
					color: $color;

				}

				&:last-child {
					opacity: .6;
					background-color: $color;
					flex: 2;
					margin-left: 24rpx;
					color: #fff;
				}
			}
		}
	}
</style>