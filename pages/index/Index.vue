<template>
	<view>
		<u-image width="100%" height="300rpx" src="https://xd.qiantur.com/minio/xdcloud/20211025032454728.jpg"></u-image>
		<view class="menusBox">
			<view v-for="(menu, index) in menus" class="menuItem">
				<text class="t-icon btn_icon" :class="'t-' + menu.icon"></text>
				<text>{{menu.text}}</text>
			</view>
		</view>
		<view class="serviceBox">
			<view class="novice_service">
				<u-button type="warning" size="small" :custom-style="noviceServiceBtn">详情>></u-button>
			</view>
			<view class="right_box">
				<view class="right_box_top">
					<u-button type="warning" size="small" :custom-style="reservationStyle">立即预定></u-button>
				</view>
				<view class="right_box_bottom">
					<u-button type="warning" size="small" :custom-style="queryStyle">立即查询></u-button>
				</view>
			</view>
		</view>
		<view>
			<view>小滴精选</view>
			<view>
				
			</view>
		</view>
	</view>
</template>

<script>
	import api from '../../api/index.js';
	export default {
		onLoad(option) {
			let url = option.q ? decodeURIComponent(option.q) : '';
			url ? uni.setStorageSync('appletType', 2) : uni.setStorageSync('appletType', 1); // 1: 平台用户 2： 租车公司用户
			url && uni.setStorageSync('complanyId', url.split('=')[1]);
			url.split('=')[2] ? this.carId = url.split('=')[2] : this.carId = '';
			uni.login({
				onlyAuthorize: true,
				success: (res) => {
					!!res.code && api.login(res.code).then(res => {
						uni.setStorageSync('openid', res.data.openid);
						uni.setStorageSync('userInfo', res.data.userInfo);
						if (this.carId) {
							uni.reLaunch({
								url: `/pages/car/CarDetail?id=${this.carId}&type=index`
							});
						}
					});
				}
			});
		},
		
		data() {
			return {
				carId: '',
				menus: [
					{icon: 'icon-121zhanweitu', text: '功能1'},
					{icon: 'icon-121zhanweitu', text: '功能2'},
					{icon: 'icon-121zhanweitu', text: '功能3'},
					{icon: 'icon-121zhanweitu', text: '功能4'},
				],
				noviceServiceBtn:{
					width: '40%',
					fontSize: "12px",
					height: '25px',
					marginTop: '70px',
					marginLeft: '20px',
				},
				reservationStyle: {
					width: '35%',
					fontSize: "10px",
					height: '15px',
					marginTop: '30px',
					marginLeft: '20px',
				},
				queryStyle: {
					width: '35%',
					fontSize: "10px",
					height: '15px',
					marginTop: '30px',
					marginLeft: '20px',
				}
			}
		},
		methods: {
			
		}
	}
</script>

<style lang="scss">
	.menusBox {
		margin-top: 20rpx;
		margin-bottom: 20rpx;
		display: flex;
		width: 100%;
		height: 45px;
		flex-direction: row;
		justify-content: space-around;
	}
	.menuItem {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		
	}
	.btn_icon {
		width: 24px;
		height: 24px;
	}
	.serviceBox {
		display: flex;
		flex-direction: row;
		width: 100%;
		height: 300rpx;
		padding: 10px;
	}
	.novice_service {
		flex: 1;
		background-color: red;
		border-radius: 8px;
		margin-right: 5px;
	}
	.right_box {
		flex:1;
		display: flex;
		flex-direction: column;
	}
	.right_box_top {
		width: 100%;
		flex: 1;
		border-radius: 8px;
		background-color: green;
		margin-bottom: 10px;
	}
	.right_box_bottom {
		width: 100%;
		flex: 1;
		border-radius: 8px;
		background-color: blue;
	}
</style>
