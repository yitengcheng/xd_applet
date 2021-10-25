<template>
	<view>
		<u-image width="100%" height="300rpx" src="https://xd.qiantur.com/minio/xdcloud/20211025032454728.jpg"></u-image>
		<view class="menusBox">
			<view v-for="(menu, index) in menus" class="menuItem">
				<text class="t-icon btn_icon" :class="'t-' + menu.icon"></text>
				<text>{{menu.text}}</text>
			</view>
		</view>
		<view>
			小滴服务
		</view>
		<view>
			小滴精选
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
				]
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
</style>
