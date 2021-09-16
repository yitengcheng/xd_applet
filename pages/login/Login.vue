<template>
	<view class="content">
		<image :src="avatar" class="avatarImg"></image>
		<text>{{name}}</text>
		<button type="primary" class="loginBtn" @click="login">登录</button>
	</view>
</template>

<script>
	import api from '../../api/index.js';
	export default {
		mounted() {
			uni.getUserInfo({
				success: (res) => {
					this.name = res.userInfo.nickName;
					this.avatar = res.userInfo.avatarUrl;
				}
			});
			let openid = uni.getStorageSync('openid');
			!!openid && uni.switchTab({
				url: '/pages/car/Car'
			});
		},
		data() {
			return {
				name: '',
				avatar: '',
			};
		},
		methods: {
			login() {
				uni.login({
					onlyAuthorize: true,
					success: (res) => {
						!!res.code && api.login({
							code: res.code
						}).then(res => {
							uni.setStorageSync('openid', res.data.openid);
							uni.switchTab({
								url: '/pages/car/Car'
							});
						});
					}
				});
			}
		}
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
