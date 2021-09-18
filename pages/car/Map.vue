<template>
	<map class="map_box" :style="{height: container_height + 'px'}" :longitude="longitude" :latitude="latitude"
		:markers="markers" @markertap="onMarker"></map>
</template>

<script>
	export default {
		data() {
			return {
				container_height: 0,
				longitude: 0, // 中心经度
				latitude: 0, // 中心纬度
				markers: [], // marker点位
				markersData: [{
					name: '阿富汗租车店',
					coordinates:[106.628372,26.609795],
				},{
					name: '叙利亚租车店',
					coordinates:[106.625102,26.6065],
				},]
			}
		},
		onLoad() {
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
						id: 0,
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
			})
		},
		mounted() {
			this.getShopData();
		},
		methods: {
			getShopData(){
				this.markersData.forEach((o,index) => {
					this.markers.push({
						id: index + 1,
						latitude: o.coordinates[1],
						longitude: o.coordinates[0],
						callout: {
							content: o.name,
							display: 'ALWAYS'
						},
						iconPath: '/static/img/shop_icon.png',
						width: 36,
						height: 36
					})
				});
			},
			onMarker(e){
				let pages = getCurrentPages(); // 当前页面
				let beforePage = pages[pages.length - 2]; // 前一个页面
				uni.navigateBack({
					success: () => {
						beforePage.onLoad(this.markersData[e.detail.markerId - 1]);
					}
				});
			},
		}
	}
</script>

<style lang="scss">
	.map_box {
		width: 100%;
	}
</style>
