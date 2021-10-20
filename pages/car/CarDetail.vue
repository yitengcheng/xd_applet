<template>
	<view class="content" :enable-flex="true">
		<swiper class="swiper_box" :indicator-dots='true' :autoplay='true'>
			<swiper-item v-for="(item, index) in photos" :key="index">
				<image :src="item" class="swiper_img" mode="aspectFit"></image>
			</swiper-item>
		</swiper>
		<view class="info_box">
			<text>车辆信息</text>
			<text>车辆品牌：{{ _.find(carType, o => {return o.value == carInfo.carBrand}).text || '无' }}</text>
			<text>车辆类型：{{ carInfo.carBrand || '无' }}</text>
			<text>车牌号：{{ carInfo.carNum || '无' }}</text>
			<text>车牌颜色：{{ carInfo.color || '无' }}</text>
			<text>燃油类型：{{ _.find(carType, o => {return o.value == carInfo.fuelType}).text || '汽油' }}</text>
			<text>租车单价：{{ carInfo.unitPrice || '无' }} 元/天</text>
			<text>超过里程收取金额：{{ carInfo.maxMileagePrice || '无' }} 每日</text>
			<view class="info" @click="toMap">
				<text>取车点：{{takeAddress || '点击选择取车地址'}}</text>
				<text class="map_icon t-icon t-icon-ditu" ></text>
			</view>
			<view class="info" @click="toMap('return')">
				<text>还车点：{{returnAddress || '点击选择还车地址'}}</text>
				<text class="map_icon t-icon t-icon-ditu"></text>
			</view>
			<view class="info">
				<text>优惠券：</text>
				<uni-data-picker :value="idcard" placeholder="请选择优惠券" :v-model="couponId" :localdata="couponList" @change='changeCoupon'></uni-data-picker>
			</view>
			<view class="datePick">
				<uni-datetime-picker ref="datetime" :v-model="datetimerange" type="datetimerange" :start="start"
					start-placeholder="租车时间" end-placeholder="还车时间" @change="changeDate" @close="close" />
				<text v-show="rangeSeparator">租车时间：{{rangeSeparator}}天</text>
				<text v-show="rangeMoney">租车金额：{{rangeMoney}}元</text>
			</view>
			
		</view>
		<button type="primary" class="appointmentBtn" @click="appointment">预约用车</button>
	</view>
</template>

<script>
	import api from '../../api/index.js';
	import config from '../../common/config.js';
	export default {
		onLoad(option) {
			this.dictInit('car_type', 'fuel_number').then(() => {
				this.carType = uni.getStorageSync('car_type');
				this.fuelNumber = uni.getStorageSync('fuel_number');
			});
			let user = uni.getStorageSync('userInfo');
			if(!user.idcard && !user.phoneNumber){
				uni.showModal({
					title: '您尚未绑定个人驾驶信息，请前往个人中心的个人信息页面进行绑定',
					icon: 'none',
					success: (e) => {
						if(e.confirm){
							uni.navigateTo({
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
				carType: [],
				fuelNumber: [],
				datetimerange: [],
				start: this.dayjs().format('YYYY-MM-DD HH:mm'),
				rangeSeparator: '',
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
					this.$nextTick(()=>{
						this.initCoupon();
					})
				});
			},
			appointment() {
				if(!this.carInfo.complany.subMchId){
					uni.showModal({
						title: '此车辆无法进行线上支付，是否继续预约',
						icon: 'error',
						success: (e) => {
							if(e.confirm){
								
							}
						}
					});
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
			toMap(type){
				uni.chooseLocation({
					success: (res) => {
						this.selectAddress({type, ...res});
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

	.info_box {
		width: 90%;
		display: flex;
		flex-direction: column;
		padding-top: 10px;
	}

	.appointmentBtn {
		width: 60%;
		margin-top: 50rpx;
		margin-bottom: 50rpx;
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
