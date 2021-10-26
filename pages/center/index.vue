<template>
	<view class="content">
		<view class="btn_box">
			<view v-for="(item,index) in buttonList" :key='index' class="btn_item" @click="goToPage(item.path)">
				<text class="t-icon btn_icon" :class="'t-' + item.icon"></text>
				<text class="btn_title">{{item.title}}</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				name: '',
				head: '',
				buttonList: [{
						icon: 'icon-gerenxinxi',
						title: '个人信息',
						path: '/packageA/pages/center/PersonalInformation',
					},
					{
						icon: 'icon-youhuiquan',
						title: '优惠券',
						path: '/packageA/pages/center/Coupons',
					},
					{
						icon: 'icon-shoucangjia',
						title: '我的收藏',
						path: '/packageA/pages/center/Collection',
					},
					{
						icon: 'icon-dianzihetongyuedingshu',
						title: '合同扫码',
						path: '/packageA/pages/center/ScanQRcode',
					},
					{
						icon: 'icon-guanyuwomen',
						title: '关于我们',
						path: '/packageA/pages/center/AboutUs',
					},
				],
			}
		},
		methods: {
			goToPage(url) {
				uni.navigateTo({
					url,
				})
			}
		}
	}
</script>

<style lang="scss">
	.head_img {
		height: 300rpx;
		width: 300rpx;
		border-radius: 50%;
		margin-top: 50rpx;
		margin-bottom: 20rpx;
	}

	.nameText {
		font-size: 20px;
	}

	.btn_box {
		display: flex;
		width: 100%;
		flex-direction: column;
	}

	.btn_item {
		border-bottom: 1px #888888 solid;
		height: 25px;
		padding: 10px;
		display: flex;
		justify-content: flex-start;
		align-items: center;
	}

	.btn_icon {
		width: 24px;
		height: 24px;
	}

	.btn_title {
		margin-left: 10px;
	}
</style>
