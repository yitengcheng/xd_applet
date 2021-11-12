<template>
	<view>
		<map class="map_box" :style="{ height: container_height - 335 + 'px' }" :longitude="longitude"
			:latitude="latitude" :markers="markers" @markertap="onMarker"></map>
		<view class="list_box">
			<view v-for="(shop, index) in shopList" :key="index" class="shop_box" @click="toShop(shop)">
				<view class="shop_address_name">
					<view class="shop_name">{{shop.shopName}}</view>
					<view class="shop_phone">{{shop.shopPhone}}</view>
				</view>
				<view class="shop_address">{{shop.shopAddress}}</view>
				<view class="line"></view>
			</view>
		</view>
	</view>
</template>
<script>
	import api from '../../../api/index.js';
	export default {
		data() {
			return {
				container_height: 0,
				longitude: 0, // 中心经度
				latitude: 0, // 中心纬度
				markers: [], // marker点位
				shopList: [],
			}
		},
		onLoad(option) {
			uni.getSystemInfo({
				success: (res) => {
					this.container_height = res.windowHeight;
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
						iconPath: '/packageA/static/img/my_point.png',
						width: 36,
						height: 36
					})
				}
			});
		},
		mounted() {
			this.getShopData();
		},
		methods: {
			getShopData() {
				api.companyList().then(res => {
					let {
						data
					} = res;
					if (data) {
						data.forEach((o, index) => {
							o.latitude && this.markers.push({
								id: o.id,
								longitude: o.latitude.split(',')[0],
								latitude: o.latitude.split(',')[1],
								callout: {
									content: o.name === 'null' ? '' : o.name,
									display: 'ALWAYS'
								},
								iconPath: '/packageA/static/img/shop_icon.png',
								width: 36,
								height: 36
							});
							this.shopList.push({
								id: o.id,
								shopName: o.name ?? '',
								shopAddress: o.address ?? o.businessAddress ?? '暂无',
								shopPhone: o.phoneNumber ?? '暂无',
								longitude: o.latitude?.split(',')[0],
								latitude: o.latitude?.split(',')[1],
							})
						});
					}
				});
			},
			onMarker(e) {
				(e.detail.markerId !== 'my' && e.detail.markerId !== 900000000) && uni.setStorageSync('complanyId', e
					.detail.markerId);
				let tmp = this._.find(this.markers, o => {
					return o.id === e.detail.markerId
				});
				uni.$emit('refreshIndex');
				uni.$emit('refreshCar');
				uni.$emit('changePageTitle', ((tmp || {}).callout || {}).content);
				uni.navigateBack();
			},
			toShop(shop){
				this.longitude = shop.longitude;
				this.latitude = shop.latitude;
			}
		}
	}
</script>
<style lang="scss">
	.address_text {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		width: 100%;
		height: 35px;
		font-size: 18px;
		padding: 0px 20px 0px 20px;
	}

	.map_box {
		width: 100%;
	}

	.list_box {
		height: 300px;
		width: 100%;
		overflow: auto;
		overflow-y: auto;
	}

	.shop_box {
		display: flex;
		flex-direction: column;
		padding: 10px;
	}

	.shop_address_name {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
	}

	.shop_name {
		font-size: 18px;
		font-weight: 700;
		color: #333333;
	}

	.shop_phone {
		font-size: 16px;
		font-weight: 300;
	}

	.shop_address {
		font-size: 16px;
		color: #888888;
	}

	.line {
		width: 100%;
		height: 1px;
		align-self: center;
		background-color: #888888;
		margin: 5px;
	}
</style>
