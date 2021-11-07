<template>
	<view>
		<view class="address_text" @click="showAddress">
			<text>{{address}}</text>
			<span>></span>
		</view>
		<u-select v-model="show" mode="mutil-column-auto" :list="list" @confirm="confirm" />
		<map class="map_box" :style="{ height: container_height - 335 + 'px' }" :longitude="longitude"
			:latitude="latitude" :markers="markers" @markertap="onMarker"></map>
		<scroll-view class="list_box">
			<view v-for="shop in shopList" :key="shop.id" class="shop_box">
				<view class="shop_address_name">
					<view class="shop_name">{{shop.shopName}}</view>
					<view class="shop_phone">{{shop.shopPhone}}</view>
				</view>
				<view class="shop_address">{{shop.shopAddress}}</view>
			</view>
		</scroll-view>
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
				address: '请选择地点',
				show: false,
				shopList: [ {
					id: 1,
					shopName: '测试店铺1',
					shopAddress: '测试店铺地址1',
					shopPhone: '13984842424',
					longitude: 26,
					latitude: 103
				}, {
					id: 2,
					shopName: '测试店铺2',
					shopAddress: '测试店铺地址2',
					shopPhone: '13984842424',
					longitude: 26,
					latitude: 103
				}, {
					id: 3,
					shopName: '测试店铺3',
					shopAddress: '测试店铺地址3',
					shopPhone: '13984842424',
					longitude: 26,
					latitude: 103
				}, {
					id: 4,
					shopName: '测试店铺4',
					shopAddress: '测试店铺地址4',
					shopPhone: '13984842424',
					longitude: 26,
					latitude: 103
				}, ],
				list: [ {
					value: 1,
					label: '中国',
					children: [ {
						value: 2,
						label: '广东',
						children: [ {
							value: 3,
							label: '深圳'
						}, {
							value: 4,
							label: '广州'
						} ]
					}, {
						value: 5,
						label: '广西',
						children: [ {
							value: 6,
							label: '南宁'
						}, {
							value: 7,
							label: '桂林'
						} ]
					} ]
				}, {
					value: 8,
					label: '美国',
					children: [ {
						value: 9,
						label: '纽约',
						children: [ {
							value: 10,
							label: '皇后街区'
						} ]
					} ]
				} ]
			}
		},
		onLoad( option ) {
			uni.getSystemInfo( {
				success: ( res ) => {
					this.container_height = res.windowHeight;
				}
			} );
			uni.getLocation( {
				success: ( res ) => {
					this.longitude = res.longitude;
					this.latitude = res.latitude;
					this.markers.push( {
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
					} )
				}
			} );
		},
		mounted() {
			this.getShopData();
		},
		methods: {
			showAddress() {
				this.show = true;
			},
			confirm( e ) {
				this.address = this._.map( e, 'label' ).join( '-' );
			},
			getShopData() {
				api.companyList().then( res => {
					let {
						data
					} = res;
					if ( data ) {
						data.forEach( ( o, index ) => {
							o.latitude && this.markers.push( {
								id: o.id,
								longitude: o.latitude.split( ',' )[ 0 ],
								latitude: o.latitude.split( ',' )[ 1 ],
								callout: {
									content: o.name,
									display: 'ALWAYS'
								},
								iconPath: '/packageA/static/img/shop_icon.png',
								width: 36,
								height: 36
							} )
						} );
					}
				} );
			},
			onMarker( e ) {
				( e.detail.markerId !== 'my' && e.detail.markerId !== 900000000 ) && uni.setStorageSync( 'complanyId', e
					.detail.markerId );
				let tmp = this._.find( this.markers, o => {
					return o.id === e.detail.markerId
				} );
				uni.$emit( 'refreshIndex' );
				uni.$emit( 'refreshCar' );
				uni.$emit( 'changePageTitle', ( ( tmp || {} ).callout || {} ).content );
				uni.navigateBack();
			},
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
</style>
