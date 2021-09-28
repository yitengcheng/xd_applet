<template>
	<view>
		<view class="custom_top" :style="{height: top_height + 40 + 'px'}">
			<view class="map_Btn" @click="toMap" v-show="appletType === 1">
				<text class="map_icon t-icon t-icon-ditu"></text>
				<text class="shop_name">{{shopName}}</text>
			</view>
			<text class="page_title" :style="{textAlign: appletType === 2 ? 'center':''}">租车</text>
		</view>
		<uni-easyinput v-model="keyword" placeholder="请输入关键字搜索" suffixIcon="search" @iconClick="search"></uni-easyinput>
		<uni-data-checkbox :localdata="carTypeList" v-model="carType" @change="changeCarType" />
		<WaterfallsFlow :wfList='list' @itemTap="itemTap" />
	</view>
</template>

<script>
	import WaterfallsFlow from '../../components/WaterfallsFlow/WaterfallsFlow.vue';
	import api from '../../api/index.js';
	import config from '../../common/config.js';
	export default {
		components: {
			WaterfallsFlow,
		},
		onLoad(option) {
			uni.getSystemInfo({
				success: (res) => {
					this.top_height = res.statusBarHeight;
				}
			});
			this.dictInit('car_type').then(res => {
				this.carTypeList = uni.getStorageSync('car_type');
			});
			this.changeShopName(option.shop);
		},
		mounted() {
			this.getCarList(1, true);
		},
		onReachBottom() {
			// 模拟触底刷新
			this.getCarList(this.pageNo);
		},
		onPullDownRefresh() {
			this.getCarList(1);
		},
		data() {
			return {
				list: [],
				keyword: '',
				top_height: 0,
				shopName: uni.getStorageSync('shopName'),
				appletType: uni.getStorageSync('appletType'),
				pageNo: 1,
				type: -1,
				carTypeList: [],
				carType: '',
			}
		},
		methods: {
			itemTap(e) {
				uni.navigateTo({
					url: `/pages/car/CarDetail?id=${e.id}`,
				})
			},
			changeShopName(shop) {
				let obj = shop ? JSON.parse(shop) : undefined;
				obj ? this.shopName = obj.callout.content :  this.shopName = '';
				this.$nextTick(() => {
					uni.setStorageSync('shopName', this.shopName);
					this.getCarList(1, true);
				})
			},
			toMap() {
				uni.navigateTo({
					url: '/pages/car/Map?type=shop',
				});
			},
			search() {
				this.getCarList(1);
			},
			getCarList(pageNo, init = false) {
				let pageNum = pageNo || this.pageNo;
				let type = this.carType === -1 ? '' : this.carType;
				api.carList({
					pageNum,
					pageSize: 10,
					keyword: this.keyword,
					type,
				}).then((res ={}) => {
					if(res.rows){
						let tmpList = [];
						res.rows.forEach(o => {
							let carPhotos = o.carPhotos.split(',');
							tmpList.push({
								nickName: o.carBrand,
								image: carPhotos.length >= 1 ? `${config.IMG_URL}${carPhotos[0]}` :
									'/static/img/car_defalut.png',
								type: o.type,
								id: o.id,
							});
						});
						pageNum === 1 ? this.list = tmpList : this.list = this._.concat(this.list, tmpList);
						pageNum === 1 ? this.pageNo = 2 : this.pageNo = this.pageNo + 1;
						if (init) {
							this.carTypeList = uni.getStorageSync('car_type');
							this.$nextTick(() => {
								let tmp = [];
								this.list.forEach(o => {
									tmp.push(this._.find(this.carTypeList, item => {
										return item.value === o.type
									}));
								});
								this.carTypeList = this._.concat([{
									text: '全部',
									value: -1
								}], this._.uniqBy(tmp, 'value'));
							});
						}
					}
					uni.stopPullDownRefresh();
				});
			},
			changeCarType(e) {
				this.getCarList(1);
			}
		}
	}
</script>

<style lang="scss">
	.custom_top {
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
	}

	.map_Btn {
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		align-items: center;
		flex: 1;
		padding-left: 5px;
		margin-top: 20px;
	}

	.shop_name {
		flex: 1;
		font-size: 12px;
	}

	.map_icon {
		width: 24px;
		height: 24px;
	}

	.page_title {
		flex:1.2;
		margin-top: 20px;
		font-size: 13px;
	}
</style>
