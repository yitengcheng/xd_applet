<template>
	<view class="content">
		<view class="top_box">
			<image src="../../static/img/center_bg.png" class="center_bg"></image>
			<view class="info_box">
				<image src="../../static/img/defalut_head.png" class="head_img"></image>
				<view class="info">
					<text>姓名: {{user.name || '小滴妹妹'}}</text>
					<text style="font-size: 14px;">ID：{{ _.random(100000000, 999999999, false) || 'youxingxiaodi'}}</text>
				</view>
			</view>
		</view>
		<view class="static_box">
			<view class="number" @click="toCollection">
				<u-count-to class="number_text" :start-val="0" :end-val="collectionNumber"></u-count-to>
				<view>足迹</view>
			</view>
			<view class="number" @click="toCoupons">
				<u-count-to class="number_text" :start-val="0" :end-val="couponNumber"></u-count-to>
				<view>优惠券</view>
			</view>
			<view class="number" @click="clickNo">
				<u-count-to class="number_text" :start-val="0" :end-val="0"></u-count-to>
				<view>里程数</view>
			</view>
			<view class="number" @click="clickNo">
				<u-count-to class="number_text" :start-val="0" :end-val="0"></u-count-to>
				<view>积分</view>
			</view>
		</view>
		<view class="order_box">
			<view class="order_box_title">
				<view class="order">
					<image src="../../static/img/order_center.png" class="orader_img"></image>
					<view>我的订单</view>
				</view>
				<view class="look_order" @click="toOrderList(0,'')">查看订单></view>
			</view>
			<view class="line">-</view>
			<view class="order_box_options">
				<view class="order_box_option" @click="toOrderList(1,'NOTPAY')">
					<image src="../../static/img/payment.png" class="order_box_option_img"></image>
					<view class="order_box_option_text">待付款</view>
				</view>
				<view class="order_box_option" @click="toOrderList(3,'REFUNDED')">
					<image src="../../static/img/refund.png" class="order_box_option_img"></image>
					<view class="order_box_option_text">已退款</view>
				</view>
				<view class="order_box_option" @click="toOrderList(2,'SUCCESS')">
					<image src="../../static/img/order_icon.png" class="order_box_option_img"></image>
					<view class="order_box_option_text">付款成功</view>
				</view>
				<view class="order_box_option" @click="toOrderList(4,'到店付款')">
					<image src="../../static/img/offline_pay.png" class="order_box_option_img"></image>
					<view class="order_box_option_text">到店付款</view>
				</view>
			</view>
		</view>
		<view class="verify_box">
			<view class="verify_box_info">
				<text class="verify_box_info_title">个人信息</text>
				<text class="verify_box_info_text">验证快速租车>></text>
			</view>
			<image src="../../static/img/perason.png" class="verify_box_info_img"></image>
			<u-button type="primary" :custom-style="verify_box_info_btn" @click="toPerson">验证</u-button>
		</view>
		<view class="bottom_title" @click="phoneCall">
			<image src="../../static/img/service.png" class="bottom_title_img"></image>
			<text class="bottom_title_text">平台服务</text>
		</view>
		<view class="bottom_box">
			<view class="bottom_item" @click="clickNo">
				<image src="../../static/img/contact.png" class="bottom_item_img"></image>
				<text class="bottom_item_text">联系客服</text>
			</view>
			<view class="bottom_item" @click="scanQR">
				<image src="../../static/img/pact.png" class="bottom_item_img"></image>
				<text class="bottom_item_text">合同扫码</text>
			</view>
			<view class="bottom_item" @click="clickNo">
				<image src="../../static/img/about_us.png" class="bottom_item_img"></image>
				<text class="bottom_item_text">关于我们</text>
			</view>
			<view class="bottom_item" @click="clearStorage">
				<image src="../../static/img/clear.png" class="bottom_item_img"></image>
				<text class="bottom_item_text">清理缓存</text>
			</view>
		</view>
	</view>
</template>

<script>
	import api from '../../api/index.js';
	export default {
		mounted() {
			this.collectionNumber = this.user.collectionNumber;
			this.couponNumber = this.user.couponNumber;
		},
		data() {
			return {
				user: uni.getStorageSync('userInfo'),
				collectionNumber: 0,
				couponNumber: 0,
				height: 0,
				verify_box_info_btn: {
					width: '73px',
					height: '30px',
					backgroundColor: '#FFDC40',
					fontSize: '14px',
					fontFamily: 'Microsoft YaHei',
					fontWeight: 'bold',
					lineHeight: '30px',
					color: '#333333',
					borderRadius: '910px',
				}
			}
		},
		methods: {
			toCollection(){
				uni.navigateTo({
					url: '/packageA/pages/center/Collection'
				});
			},
			toCoupons(){
				uni.navigateTo({
					url: '/packageA/pages/center/Coupons'
				})
			},
			phoneCall(){
				uni.makePhoneCall({
					phoneNumber: uni.getStorageSync('phoneNumber'),
				})
			},
			clickNo(){
				uni.showToast({
					title: '功能尚在开发中，敬请期待',
					icon: 'error'
				});
			},
			toOrderList(type, payStatus){
				uni.reLaunch({
					url: `/pages/order/Order?type=${type}&payStatus=${payStatus}`
				});
				uni.$emit('refreshOrder');
			},
			scanQR() {
				uni.scanCode({
					onlyFromCamera: true,
					success: (code) => {
						let {
							result
						} = code;
						let user = uni.getStorageSync('userInfo');
						if (!user.phoneNumber) {
							uni.navigateTo({
								url: '/packageA/pages/center/PersonalInformation'
							})
							return;
						}
						// 请求合同签署令牌
						api.getTicket({
							contractId: result,
							phone: user.phoneNumber,
						}).then(res => {
							let {
								data
							} = res;
							if (data) {
								// 跳转合同签署
								wx.navigateTo({
									url: `plugin://qyssdk-plugin/doc?ticket=${data}&env=cn`,
									events: {
										signSuccessCb: () => { // 签署成功回调
											const url = '/pages/index/Index'; // 需要跳转的小程序页面地址，必须是绝对路径，可不传
											eventChannel.emit('jumpTo',url); // 触发跳转逻辑，回调存在时必需调用，url不传默认返回
										},
									},
									success(res) {
										uni.showModal({
											title: '签署成功',
											icon: 'success',
											showCancel:false,
											success: (e) => {
												eventChannel = res.eventChannel;
											}
										});
									},
								});
							}
						})
					}
				});
			},
			toPerson(){
				uni.navigateTo({
					url: '/packageA/pages/center/PersonalInformation'
				})
			},
			clearStorage(){
				let complanyId = uni.getStorageSync('complanyId');
				let appletType = uni.getStorageSync('appletType');
				uni.clearStorage();
				uni.setStorageSync('complanyId', complanyId);
				uni.setStorageSync('appletType', appletType);
				uni.showToast({
					title: '清理完成，请关闭小程序重新进入',
					icon:'none',
					duration: 3000,
				});
			}
		}
	}
</script>

<style lang="scss">
	.center_bg {
		width: 100%;
		height: 300rpx;
	}

	.top_box {
		position: relative;
		width: 100%;
	}

	.info_box {
		position: absolute;
		top: 30%;
		left: 10%;
		display: flex;
		flex-direction: row;
	}

	.head_img {
		width: 53px;
		height: 53px;
		border-radius: 50%;
		margin-right: 10px;
	}

	.info {
		display: flex;
		flex-direction: column;
		justify-content: center;
		font-family: 'PingFangSC-Medium';
		color: #333333;
		font-size: 17px;
	}

	.static_box {
		width: 100%;
		height: 100rpx;
		margin-top: 20rpx;
		margin-bottom: 20rpx;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-around;
	}

	.number {
		display: flex;
		flex-direction: column;
		align-items: center;
		font-family: 'Microsoft YaHei';
		font-weight: 'Regular';
		color: #666666;
		font-size: 14px;
	}

	.number_text {
		font-size: 24px;
		font-family: 'PingFangSC-Semibold';
		color: #333333;
	}

	.order_box {
		display: flex;
		flex-direction: column;
		width: 90%;
		height: 200rpx;
		background-color: #FFFFFF;
		margin-bottom: 20rpx;
		border-radius: 8px;
	}

	.line {
		width: 100%;
		background-color: #F4F4F4;
		height: 1px;
		color: #FFFFFF;
	}

	.order_box_title {
		height: 60rpx;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		padding: 10px;
	}

	.order {
		display: flex;
		flex-direction: row;
		align-items: center;
		font-size: 14px;
		color: #333333;
	}

	.orader_img {
		width: 24px;
		height: 24px;
		margin-right: 20rpx;
	}

	.look_order {
		font-size: 12px;
	}

	.order_box_options {
		display: flex;
		flex: 1;
		flex-direction: row;
		align-items: center;
		justify-content: space-around;
	}

	.order_box_option {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.order_box_option_img {
		width: 25px;
		height: 24px;
	}

	.order_box_option_text {
		margin-top: 10rpx;
		font-size: 14px;
		font-family: Microsoft YaHei;
		font-weight: 400;
		color: #666666;
	}

	.verify_box {
		display: flex;
		width: 95%;
		height: 100rpx;
		border-radius: 50rpx;
		margin-bottom: 20rpx;
		background-color: #FFFFFF;
		justify-content: space-around;
		align-items: center;
	}

	.verify_box_info {
		display: flex;
		flex-direction: column;
		width: 150rpx;
		margin-left: 50rpx;
	}

	.verify_box_info_title {
		font-size: 14px;
		font-family: 'Microsoft YaHei';
		font-weight: 400;
		color: #333333;
		margin-bottom: 10rpx;
	}

	.verify_box_info_text {
		font-size: 10px;
		font-family: 'Microsoft YaHei';
		font-weight: 400;
		color: #333333;
	}
	.verify_box_info_img {
		width: 80px;
		height: 54px;
	}
	.bottom_title {
		display: flex;
		flex-direction: row;
		width: 90%;
		align-items: center;
		margin: 20rpx 0px 20rpx 0px;
	}
	.bottom_title_img {
		width: 24px;
		height: 24px;
		margin-right: 10rpx;
	}
	.bottom_title_text {
		width: 56px;
		height: 19px;
		font-size: 14px;
		font-family: 'Microsoft YaHei';
		font-weight: 400;
		line-height: 19px;
		color: #333333;
	}
	.bottom_box {
		display: flex;
		flex-direction: row;
		justify-content: space-around;
		align-items: center;
		background-color: #FFFFFF;
		margin-bottom: 50rpx;
		width: 95%;
		padding-top: 30px;
		padding-bottom: 30px;
	}
	.bottom_item {
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	.bottom_item_img {
		width: 23px;
		height: 23px;
		margin-bottom: 10rpx;
	}
	.bottom_item_text {
		font-size: 14px;
		font-family: 'Microsoft YaHei';
		font-weight: 400;
		color: #666666;
	}
</style>
