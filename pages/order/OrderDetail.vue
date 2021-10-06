<template>
	<view class="content">
		<swiper class="swiper_box" :indicator-dots='true' :autoplay='true'>
			<swiper-item v-for="(item, index) in photos" :key="index">
				<image :src="item" class="swiper_img" mode="aspectFit"></image>
			</swiper-item>
		</swiper>
		<view class="car_info_box">
			<text>车辆品牌:{{info.car.carBrand || '无'}}</text>
			<text>车辆颜色: {{info.car.color || '无'}}</text>
			<text>车牌号: {{info.car.carNum || '无'}}</text>
			<text>荷载人数: {{info.car.maxManned || '未知'}}</text>
			<text>下单时间: {{dayjs(info.createTime).format('YYYY-MM-DD')}}</text>
			<text>总价：{{info.totalMoney/100 || '未知'}}</text>
			<text>优惠券：{{info.coupon || '无'}}</text>
			<text>应付：{{info.shouldMoney/100 || '未知'}}</text>
		</view>
		<button class="pay_btn" type="primary" @click="toPay" v-show="info.payStatus === 'NOTPAY'">{{buttonText}}</button>
	</view>
</template>

<script>
	import api from '../../api/index.js';
	import config from '../../common/config.js';
	export default {
		data() {
			return {
				photos: [],
				info: {},
				buttonText: '实际付款：￥'
			};
		},
		onLoad(option) {
			option.id && this.getOrderInfo(option.id);
		},
		methods:{
			getOrderInfo(id){
				api.orderInfo(id).then((res = {}) => {
					let { data } = res;
					if(data){
						let tmp = data.car.carPhotos.split(',');
						tmp.forEach(o => {
							this.photos.push(`${config.IMG_URL}${o}`);
						});
						this.info = data;
						this.buttonText = `实际付款：￥${data.shouldMoney/100 || '未知金额'}`;
					}
				});
			},
			toPay(){
				// #ifdef MP-WEIXIN
					wx.login({
						success:({code}) => {
							if(code){
								api.pay({
									orderId: this.info.orderId,
									couponId: this.info.couponId,
									subMchId: this.info.complany.subMchId,
									code,
									couponType: '',
								}).then(res => {
									uni.getProvider({
										service: 'payment',
										success: ({provider} = e) => {
											// #ifdef MP-WEIXIN
												delete res.data.appId;
												wx.requestPayment({
													...res.data,
													success: (payRes) => {
														console.log(payRes);
														uni.showToast({
															title:'支付成功',
															icon: 'none',
															success: () => {
																uni.switchTab({
																	url: '/pages/car/Car'
																})
															}
														})
													},
													fail: (payErr) => {
														console.log(payErr)
													}
												})
											// #endif
										}
									}) 
								});
							}
						}
					})
				// #endif
				
			}
		}
	}
</script>

<style lang="scss">
	.swiper_box {
		width: 100%;
		height: 350rpx;
	}

	.swiper_img {
		width: 100%;
		height: 300rpx;
	}

	.car_info_box {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: flex-start;
		margin: 10px;
		width: 100%;
		margin-left: 50px;
		margin-top: 20px;
	}
	
	.pay_btn {
		margin-top: 50rpx;
		width: 60%;
	}
</style>
