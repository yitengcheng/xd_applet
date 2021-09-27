<template>
	<view>
		<view class="custom_top" :style="{height: top_height + 40 + 'px'}">
			<uni-icons type="arrowleft" class="back_icon" @click="backPress"></uni-icons>
			<text class="page_title">地图</text>
		</view>
		<map class="map_box" :style="{height: container_height + 'px'}" :longitude="longitude" :latitude="latitude"
			:markers="markers" @markertap="onMarker" @tap="addMarker"></map>
	</view>
</template>


<script>
	import api from '../../api/index.js';
	export default {
		data() {
			return {
				container_height: 0,
				longitude: 0, // 中心经度
				latitude: 0, // 中心纬度
				markers: [], // marker点位
				markersData: [{
					name: '阿富汗租车店',
					coordinates: [106.628372, 26.609795],
				}, {
					name: '叙利亚租车店',
					coordinates: [106.625102, 26.6065],
				}, ],
				type: '',
				top_height: 0,
			}
		},
		onLoad(option) {
			uni.getSystemInfo({
				success: (res) => {
					this.container_height = res.windowHeight;
					this.top_height = res.statusBarHeight;
				}
			});
			uni.getLocation({
				success: (res) => {
					this.longitude = res.longitude;
					this.latitude = res.latitude;
					this.markers.push({
						id: 'my',
						latitude: res.latitude,
						longitude: res.longitude,
						callout: {
							content: '当前位置',
							display: 'ALWAYS'
						},
						iconPath: '/static/img/my_point.png',
						width: 36,
						height: 36
					})
				}
			});
			this.type = option.type;
		},
		mounted() {
			this.type === 'shop' && this.getShopData();
		},
		methods: {
			backPress() {
				let pages = getCurrentPages(); // 当前页面
				let beforePage = pages[pages.length - 2]; // 前一个页面
				uni.navigateBack({
					success: () => {
						beforePage.onLoad({
							address: this.markers[1],
							type: this.type,
						});
					}
				});
			},
			getShopData() {
				api.companyList().then(res => {
					let {data} = res;
					if (data) {
						data.forEach((o, index) => {
							o.latitude && this.markers.push({
								id: o.id,
								longitude: o.latitude.split(',')[0],
								latitude: o.latitude.split(',')[1],
								callout: {
									content: o.name,
									display: 'ALWAYS'
								},
								iconPath: '/static/img/shop_icon.png',
								width: 36,
								height: 36
							})
						});
					}
				});
			},
			onMarker(e) {
				let pages = getCurrentPages(); // 当前页面
				let beforePage = pages[pages.length - 2]; // 前一个页面
				let obj = this._.find(this.markers, o => { return o.id === e.detail.markerId });
				obj ? uni.setStorageSync('complanyId', e.detail.markerId) : uni.setStorageSync('complanyId','');
				uni.navigateBack({
					success: () => {
						beforePage.onLoad({
							shopName: obj,
						});
					}
				});
			},
			addMarker(e) {
				if (this.type !== 'shop') {
					if (this.markers.length >= 2) {
						this.markers = this._.dropRight(this.markers, this.markers.length - 1);
					}
					this.markers.push({
						id: 1,
						latitude: e.detail.latitude,
						longitude: e.detail.longitude,
						callout: {
							content: this.type === 'return' ? '还车地点' : '交车地点',
							display: 'ALWAYS'
						},
						iconPath: '/static/img/shop_icon.png',
						width: 36,
						height: 36
					});
				}
			}
		}
	}
</script>

<style lang="scss">
	.map_box {
		width: 100%;
	}

	.back_icon {
		margin-top: 20px;
	}

	.custom_top {
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
	}

	.page_title {
		flex: 1;
		text-align: center;
		vertical-align: middle;
		margin-top: 20px;
	}
</style>
