<template>
	<view>
		<map class="map_box" :style="{ height: container_height + 'px' }" :longitude="longitude" :latitude="latitude" :markers="markers" @markertap="onMarker"></map>
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
							iconPath: '/packageA/static/img/shop_icon.png',
							width: 36,
							height: 36
						})
					});
				}
			});
		},
		onMarker(e) {
			(e.detail.markerId !== 'my' && e.detail.markerId !== 900000000) && uni.setStorageSync('complanyId', e.detail.markerId);
			uni.$emit('refreshIndex');
			uni.$emit('refreshCar');
			uni.navigateBack();
		},
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
