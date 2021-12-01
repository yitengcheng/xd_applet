<template>
	<view class="content">
		<u-swiper class="swiper_box" :list="photos" mode="none" height="470"></u-swiper>
		<view class="car_band">{{ carInfo.car.carBrand || '无' }}</view>
		<view class="complany_name">{{ carInfo.complany.complanyName }}</view>
		<view class="option_card">
			<view class="time_address">
				<view class="dot_line">
					<view class="dot"></view>
					<view class="line"></view>
				</view>
				<view class="time_box">
					<view class="car_time_address">
						<view>取车</view>
						<view>{{dayjs(carInfo.wantCarTime).format('YYYY-MM-DD')}}</view>
					</view>
					<view class="car_time_address">
						{{carInfo.address}}
					</view>
				</view>
			</view>
			<view class="time_address">
				<view class="dot_line">
					<view class="dot"></view>
				</view>
				<view class="return_time_box">
					<view class="car_time_address">
						<view>还车</view>
						<view>{{dayjs(carInfo.estimateReturnTime).format('YYYY-MM-DD')}}</view>
					</view>
					<view class="car_time_address">
						{{carInfo.returnAddress}}
					</view>
				</view>
			</view>
		</view>
		<view class="price_info">
			<text class="range_text">租车时间：{{carInfo.rentCarDays}}天</text>
			<text class="range_text">基础服务费：{{carInfo.serviceMoney / 100}}元</text>
			<text class="range_text">租赁费：{{carInfo.shouldMoney / 100}}元</text>
			<text class="range_money">总金额：￥{{_.isString((carInfo.complany || {}).subMchId) ? carInfo.totalMoney/100 : carInfo.shouldMoney/100}}元</text>
		</view>
		<uni-popup ref="popup" type="dialog">
			<uni-popup-dialog mode="input" type="info" @confirm="confirm" placeholder="请输入退款理由"></uni-popup-dialog>
		</uni-popup>
		<view class="bottom_buttons">
			<u-button type="primary" @click="toPay"
				v-if="(carInfo.payStatus === 'NOTPAY' && !!carInfo.complany.subMchId)">{{buttonText}}</u-button>
			<u-button type="warn" @click="toRefund"
				v-if="carInfo.payStatus === 'SUCCESS' && !carInfo.crvTime">退款申请</u-button>
			<u-button type="primary" @click="showPact" v-show="pactFlag">合同预览</u-button>
		</view>
	</view>
</template>

<script>
	import api from '../../../api/index.js';
	import config from '../../../common/config.js';
	export default {
		data() {
			return {
				photos: [],
				carInfo: {},
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
						this.carInfo = {
							time,
							...data
						};
						this.buttonText = `实际付款：￥${data.totalMoney/100 || '未知金额'}`;
					}
				});
			},
			toRefund() {
				this.$refs.popup.open();
			},
			showPact() {
				let index = this.carInfo.contract.indexOf('/');
				if (index === -1) {
					uni.navigateTo({
						url: `/packageA/pages/order/PreviewPact?isImage=0&param=${this.carInfo.contract}`
					})
				} else {
					uni.navigateTo({
						url: `/packageA/pages/order/PreviewPact?isImage=1&param=${this.carInfo.contract}`
					})
				}
			},
			confirm(e) {
				if (!e) {
					return uni.showToast({
						title: '请输入退款缘由',
						icon: 'none',
					})
				}
				api.refund({
					orderId: this.carInfo.orderId,
					remark: e,
				}).then(res => {
					uni.navigateBack();
				});
			},
			toPay() {
				// #ifdef MP-WEIXIN
				api.pay({
					orderId: this.carInfo.orderId,
					couponId: this.carInfo.couponId,
					subMchId: this.carInfo.complany.subMchId,
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
												url: '/pages/order/Order',
												success: (res) => {
													uni.$emit('refreshOrder');
												}
											});
										}
									})
								},
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
	}
	
	.car_band {
		width: 100%;
		font-size: 16px;
		padding: 10px;
		font-weight: 700;
	}
	
	
	
	.complany_name {
		width: 100%;
		font-size: 12px;
		padding: 10px;
	}
	
	.option_card {
		display: flex;
		flex-direction: column;
		margin: 10px;
		padding: 10px;
		border-radius: 8px;
		background-color: #FFFFFF;
		width: 95%;
		height: 300rpx;
	}
	
	.dot_line {
		flex: 1;
		padding: 1px 10px 1px 10px;
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	
	.dot {
		background-color: #fdd51e;
		width: 18px;
		height: 18px;
		border: 1px solid #fdd51e;
		border-radius: 50%;
	}
	
	.line {
		flex: 1;
		width: 1px;
		border-left: 1px dashed black;
	}
	
	.time_address {
		flex: 1;
		display: flex;
		flex-direction: row;
	}
	
	.time_box {
		display: flex;
		width: 100%;
		flex-direction: column;
	}
	
	.return_time_box {
		display: flex;
		width: 100%;
		flex-direction: column;
	}
	
	.car_time_address {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
	}
	.price_info {
		display: flex;
		flex-direction: column;
		width: 100%;
		padding: 20px;
	}
	.range_text {
		font-size: 16px;
		margin-bottom: 10px;
	}
	
	.range_money {
		font-size: 16px;
		font-weight: 700;
	}
	.bottom_buttons {
		position: absolute;
		bottom: 0%;
		display: flex;
		flex-direction: row;
		width: 100%;
		margin-top: 20px;
		button{
			flex: 1;
			border-radius: 0px;
		}
	}
</style>
