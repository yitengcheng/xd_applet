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
			<text>取车时间: {{info.time}}</text>
			<text>租车费：{{info.shouldMoney/100 || '未知'}}</text>
			<text>平台服务费：{{info.serviceMoney/100 || '未知'}}</text>
			<text>保险费：{{info.insureMoney/100 || '未知'}}</text>
			<text>总价：{{info.totalMoney/100 || '未知'}}</text>
			<text>优惠券：{{info.coupon.title || '无'}}</text>
			<text>优惠金额：{{info.coupon.price || '无'}}</text>
		</view>
		<button class="pay_btn" type="primary" @click="toPay"
			v-show="(info.payStatus === 'NOTPAY' && !!info.complany.subMchId)">{{buttonText}}</button>
		<button class="refund_btn" type="warn" @click="toRefund" v-show="info.payStatus === 'SUCCESS' && !info.crvTime">退款申请</button>
		<button class="refund_btn" type="primary" @click="showPact" v-show="pactFlag">合同预览</button>
		<uni-popup ref="popup" type="dialog">
		    <uni-popup-dialog mode="input" type="info" @confirm="confirm" placeholder="请输入退款理由"></uni-popup-dialog>
		</uni-popup>
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
				buttonText: '实际付款：￥',
				pactFlag: false,
			};
		},
		onLoad(option) {
			option.id && this.getOrderInfo(option.id);
		},
		methods: {
			getOrderInfo(id) {
				api.orderInfo(id).then((res = {}) => {
					let {
						data
					} = res;
					if (data) {
						let tmp = data.car.carPhotos.split(',');
						let time = this.dayjs().format('YYYY-MM-DD');
						tmp.forEach(o => {
							this.photos.push(`${config.IMG_URL}${o}`);
						});
						delete data.wantCarTime;
						data.contract ? this.pactFlag = true : this.pactFlag = false;
						this.info = {time, ...data};
						this.buttonText = `实际付款：￥${data.totalMoney/100 || '未知金额'}`;
					}
				});
			},
			toRefund() {
				this.$refs.popup.open();
			},
			showPact(){
				let index = this.info.contract.indexOf('/');
				if(index === -1){
					uni.navigateTo({
						url: `/pages/order/PreviewPact?isImage=0&param=${this.info.contract}`
					})
				} else {
					uni.navigateTo({
						url: `/pages/order/PreviewPact?isImage=1&param=${this.info.contract}`
					})
				}
			},
			confirm(e){
				if(!e){
					return uni.showToast({
						title:'请输入退款缘由',
						icon: 'none',
					})
				}
				api.refund({
					orderId: this.info.orderId,
					remark: e,
				}).then(res => {
					uni.navigateBack();
				});
			},
			toPay() {
				// #ifdef MP-WEIXIN
				api.pay({
					orderId: this.info.orderId,
					couponId: this.info.couponId,
					subMchId: this.info.complany.subMchId,
					openid: uni.getStorageSync('openid'),
					couponType: '',
				}).then(res => {
					uni.getProvider({
						service: 'payment',
						success: ({
							provider
						} = e) => {
							delete res.data.appId;
							wx.requestPayment({
								...res.data,
								success: (payRes) => {
									uni.showToast({
										title: '支付成功',
										icon: 'none',
										success: () => {
											uni.switchTab({
												url: '/packageA/pages/car/Car',
												success: (res) => {
													uni.$emit('refresh');
												}
											});
										}
									})
								},
								fail: (payErr) => {
									console.log(payErr)
								}
							})
						}
					})
				});
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

	.refund_btn {
		margin-top: 50rpx;
		width: 60%;
	}
</style>
