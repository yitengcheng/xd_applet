<template>
	<view class="content" :enable-flex="true">
		<u-swiper class="swiper_box" :list="photos" mode="none" height="500"></u-swiper>
		<view class="car_band">{{ carInfo.carBrand || '无' }}</view>
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
						<uni-datetime-picker :value="startTime" type="datetime" :start="start" :border="false" @change="changeDate" />
					</view>
					<view class="car_time_address" @click="toMapTake">{{takeAddress}}<u-icon name="map"></u-icon></view>
				</view>
			</view>
			<view class="time_address">
				<view class="dot_line">
					<view class="line"></view>
					<view class="dot"></view>
				</view>
				<view class="time_box">
					<view class=".car_time_address">
						<view>还车</view>
						<uni-datetime-picker :value="startTime" type="datetime" :start="start" :border="false" @change="changeDate" />
					</view>
					<view class="car_time_address" @click="toMapReturn">{{returnAddress}}<u-icon name="map"></u-icon></view>
				</view>
			</view>
		</view>
		
		
		<view class="info_box">
			<view class="info">
				<text>优惠券：</text>
				<uni-data-picker :value="idcard" placeholder="请选择优惠券" :v-model="couponId" :localdata="couponList" @change='changeCoupon'></uni-data-picker>
			</view>
			<view class="datePick">
				<text v-show="rangeSeparator">租车时间：{{rangeSeparator}}天</text>
				<text v-show="rangeMoney">租车金额：{{rangeMoney}}元</text>
			</view>
			
		</view>
		<button type="primary" class="appointmentBtn" @click="appointment">预约用车</button>
		<button v-if="type" type="primary" class="button" @click="goBack">回到店铺首页</button>
	</view>
</template>

<script>
	import api from '../../../api/index.js';
	import config from '../../../common/config.js';
	import SelectSwitch from "../../components/xuan-switch/xuan-switch.vue";
	export default {
		components:{
			SelectSwitch,
		},
		onLoad(option) {
			this.type = option.type;
			let user = uni.getStorageSync('userInfo');
			if(typeof user.idcard !== 'string' && typeof user.phoneNumber !== 'string' && typeof user.name !== 'string'){
				uni.showModal({
					title: '您尚未绑定个人驾驶信息，请前往个人中心的个人信息页面进行绑定',
					icon: 'none',
					success: (e) => {
						if(e.confirm){
							uni.reLaunch({
								url: '../center/PersonalInformation',
							})
						}else{
							uni.navigateBack();
						}
					}
				});
			}
			(option || {}).id && this.getCarInfo(option.id);
		},
		data() {
			return {
				photos: [],
				startTime: this.dayjs().format('YYYY-MM-DD HH:mm'),
				endTime: this.dayjs().add(1, 'day').format('YYYY-MM-DD HH:mm'),
				start: this.dayjs().format('YYYY-MM-DD HH:mm'),
				rangeSeparator: 1,
				rangeMoney: '',
				carInfo: {},
				takeAddress: '',
				takeLatlon: '',
				returnAddress: '',
				returnLatlon: '',
				name: '',
				idcard: '',
				phone: '',
				couponId: '',
				couponList: [],
				takeChecked: true,
				returnChecked: true,
				type: ''
			};
		},
		methods: {
			selectAddress(option){
				let latitude = option.latitude;
				let longitude = option.longitude;
				let latlon = this._.ceil(longitude, 5)  + ',' + this._.ceil(latitude, 5);
				option.type === 'return' ? this.returnLatlon = latlon : this.takeLatlon = latlon;
				option.type === 'return' ? this.returnAddress = option.name : this.takeAddress = option.name;
			},
			changeCoupon(e){
				this.couponId = e.detail.value[0].value;
			},
			initCoupon(){
				api.coupons({
					openid: uni.getStorageSync('openid'),
					complanyId: this.carInfo.complanyId,
				}).then((res = {}) => {
					let { rows } = res;
					if(rows){
						rows.forEach((o, index) => {
							this.couponList.push({
								text: `${o.title} 满${o.strip}元可以使用，抵扣${o.price}元`,
								value: o.id,
								disable: this.dayjs().isAfter(this.dayjs(o.endTime)),
								item: o,
							})
						});
					}
				});
			},
			getCarInfo(id) {
				api.carInfo(id).then(res => {
					let {
						data
					} = res;
					let tmp = data.carPhotos.split(',');
					tmp.forEach(o => {
						this.photos.push(`${config.IMG_URL}${o}`);
					});
					this.carInfo = data;
					this.takeAddress  = data.complany.complanyAddress;
					this.takeLatlon  = data.complany.latitude;
					this.returnAddress  = data.complany.complanyAddress;
					this.returnLatlon  = data.complany.latitude;
					this.rangeMoney = data.unitPrice;
					this.$nextTick(()=>{
						this.initCoupon();
					})
				});
			},
			appointment() {
				if(!this.carInfo.complany.subMchId){
					api.offLineOrder({
						carId: this.carInfo.id,
						complanyId: this.carInfo.complanyId,
						couponId: this.couponId,
						openid: uni.getStorageSync('openid'),
						rentCarDays: this.rangeSeparator,
						latitude: this.takeLatlon,
						returnLatitude: this.returnLatlon,
						wantCarTime: this.dayjs(this.datetimerange[0]).format('YYYY-MM-DD HH:mm:ss'),
						estimateReturnTime: this.dayjs(this.datetimerange[1]).format('YYYY-MM-DD HH:mm:ss'),
						description: this.carInfo.carNum + this.carInfo.carBrand,
						address: this.takeAddress,
						returnAddress:this.returnAddress,
					}).then(res => {
						if(res){
							uni.showToast({
								title: '预约完成，请等待商户联系',
								icon: 'success',
								success: () => {
									uni.navigateBack();
								}
							})
						}
					})
					return;
				}
				if (this.datetimerange.length === 2 && this.rangeSeparator !== '') {
					let coupon = this._.find(this.couponList, o => {return o.value == this.couponId});
					if(typeof coupon !== 'undefined' && this.rangeMoney < ((coupon || {}).item || {}).strip){
						uni.showToast({
							title: '租车金额不符合优惠券使用条件',
							icon: 'none',
						});
						return;
					}
					api.getPayInfo({
						carId: this.carInfo.id,
						complanyId: this.carInfo.complanyId,
						couponId: this.couponId,
						openid: uni.getStorageSync('openid'),
						rentCarDays: this.rangeSeparator,
						latitude: this.takeLatlon,
						subMchId: this.carInfo.complany.subMchId,
						returnLatitude: this.returnLatlon,
						wantCarTime: this.dayjs(this.datetimerange[0]).format('YYYY-MM-DD HH:mm:ss'),
						estimateReturnTime: this.dayjs(this.datetimerange[1]).format('YYYY-MM-DD HH:mm:ss'),
						description: this.carInfo.carNum + this.carInfo.carBrand,
						address: this.takeAddress,
						returnAddress:this.returnAddress,
					}).then((res = {}) => {
						if(res.data){
							uni.navigateTo({
								url:`/pages/order/OrderDetail?id=${res.data.orderId}`
							})
						}else {
							uni.showToast({
								title: res.msg,
								icon:'none'
							})
						}
					});
				} else {
					uni.showToast({
						icon: 'none',
						title: '请选择合理的预约时间',
						duration: 2000,
					})
				}
			},
			toMapTake(){
				uni.chooseLocation({
					success: (res) => {
						this.selectAddress({type:'take', ...res});
					}
				})
			},
			toMapReturn(){
				uni.chooseLocation({
					success: (res) => {
						this.selectAddress({type:'return', ...res});
					}
				})
			},
			changeDate(e) {
				let endDate = this.dayjs(e[1]);
				let startDate = e[0];
				let diffDate = endDate.diff(startDate, 'day');
				if (diffDate === 0) {
					uni.showToast({
						title: '租车时间与还车时间相隔最少为一天',
						icon: 'none',
						duration: 2000,
					})
				} else {
					this.datetimerange = e;
					this.rangeSeparator = diffDate;
					this.rangeMoney = diffDate * this.carInfo.unitPrice;
				}
			},
			goBack(){
				uni.switchTab({
					url: '/pages/car/Car'
				})
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
		height: 400rpx;
	}
	
	.dot_line {
		flex: 1;
		padding: 0px 10px 0px 10px;
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
		border: 1px dashed black;
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
	
	.car_time_address {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
	}

	.appointmentBtn {
		width: 60%;
		margin-top: 50rpx;
		margin-bottom: 50rpx;
	}
	
	.button {
		width: 60%;
	}

	.datePick {
		margin-top: 10px;
	}

	.info {
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		align-items: center;
		margin-top: 10px;
		width: 100%;
	}

	.map_icon {
		width: 22px;
		height: 22px;
	}
</style>
