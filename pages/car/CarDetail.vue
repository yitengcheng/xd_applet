<template>
	<view class="content">
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
				<text>取车点：{{takeAddress}}</text>
				<text class="map_icon t-icon t-icon-ditu" ></text>
			</view>
			<view class="info" @click="toMap('return')">
				<text>还车点：{{returnAddress}}</text>
				<text class="map_icon t-icon t-icon-ditu"></text>
			</view>
			<view class="info">
				<text>姓名：</text>
				<uni-easyinput :value="name" placeholder="请输入姓名"></uni-easyinput>
			</view>
			<view class="info">
				<text>电话：</text>
				<uni-easyinput :value="phone" placeholder="请输入手机号"></uni-easyinput>
			</view>
			<view class="info">
				<text>身份证：</text>
				<uni-easyinput :value="idcard" placeholder="请输入身份证号"></uni-easyinput>
			</view>
			<view class="datePick">
				<uni-datetime-picker ref="datetime" v-model="datetimerange" type="datetimerange" :start="start"
					start-placeholder="租车时间" end-placeholder="还车时间" @change="changeDate" @close="close" />
				<text v-show="rangeSeparator">租车时间：{{rangeSeparator}}天</text>
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
			(option || {}).id && this.getCarInfo(option.id);
			(option || {}).address && this.selectAddress(option);
		},
		data() {
			return {
				photos: [],
				carType: [],
				fuelNumber: [],
				datetimerange: [],
				start: this.dayjs().format('YYYY-MM-DD HH:mm'),
				rangeSeparator: '',
				carInfo: {},
				takeAddress: '点击选择取车地址',
				returnAddress: '点击选择还车地址',
				name: '',
				idcard: '',
				phone: '',
			};
		},
		methods: {
			selectAddress(option){
				let latitude = option.address.latitude;
				let longitude = option.address.longitude;
				let latlon = this._.ceil(longitude, 5)  + ',' + this._.ceil(latitude, 5);
				option.type === 'return' ? this.returnAddress = latlon : this.takeAddress = latlon;
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
				});
			},
			appointment() {
				if (this.datetimerange.length === 2 && this.rangeSeparator !== '') {
					api.getPayInfo({
						carId: this.carInfo.id,
						complanyId: this.carInfo.complanyId,
						couponId: '',
						openid: uni.getStorageSync('openid'),
						rentCarDays: this.rangeSeparator,
						latitude: this.takeAddress,
						subMchId: this.carInfo.complany.subMchId,
						returnLatitude: this.returnAddress,
						wantCarTime: this.dayjs(this.datetimerange[0]).format('YYYY-MM-DD HH:mm:SS'),
						estimateReturnTime: this.dayjs(this.datetimerange[1]).format('YYYY-MM-DD HH:mm:SS'),
						description: this.carInfo.carNum + this.carInfo.carBrand,
					}).then((res = {}) => {
						if(res.data){
							uni.navigateTo({
								url:`/pages/order/OrderDetail?id=${res.data.id}`
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
				uni.navigateTo({
					url: `/pages/car/Map?type=${type}`,
				});
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
					this.rangeSeparator = diffDate;
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
