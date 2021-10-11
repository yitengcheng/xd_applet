<template>
	
</template>

<script>
	import api from '../../api/index.js';
	export default {
		onLoad(option) {
			let url = option.q ? decodeURIComponent(option.q) : undefined;
			url ? uni.setStorageSync('appletType', 2) : uni.setStorageSync('appletType', 1); // 1: 平台用户 2： 租车公司用户
			url && uni.setStorageSync('complanyId', url.split('=')[1]);
			uni.login({
				onlyAuthorize: true,
				success: (res) => {
					!!res.code && api.login(res.code).then(res => {
						uni.setStorageSync('openid', res.data.openid);
						uni.setStorageSync('userInfo', res.data.userInfo);
						uni.switchTab({
							url: '/pages/car/Car'
						});
					});
				}
			});
		},
	}
</script>

<style lang="scss">
	.avatarImg {
		width: 360rpx;
		height: 360rpx;
	}

	.loginBtn {
		width: 60%;
		margin-top: 50rpx;
	}
</style>
