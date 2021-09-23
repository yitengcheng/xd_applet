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
			<text>荷载人数：{{ carInfo.maxManned || '无' }}</text>
			<text>车辆价值：{{ carInfo.price || '无' }}元</text>
			<text>燃油类型：{{ _.find(carType, o => {return o.value == carInfo.fuelType}).text || '无' }}</text>
			<text>租车单价：{{ carInfo.unitPrice || '无' }} 元/天</text>
			<text>超过里程收取金额：{{ carInfo.maxMileagePrice || '无' }} 每日</text>
		</view>
		<uni-datetime-picker ref="datetime" v-model="datetimerange" type="datetimerange" :start="start" class="datePick" start-placeholder="租车时间" end-placeholder="还车时间" @change="changeDate" @close="close"/>
		<text v-show="rangeSeparator">租车时间：{{rangeSeparator}}天</text>
		<button type="primary" class="appointmentBtn" @click="appointment">预约用车</button>
	</view>
</template>

<script>
	export default {
		onLoad() {
			this.dictInit('car_type', 'fuel_number').then(() => {
				this.carType = uni.getStorageSync('car_type');
				this.fuelNumber = uni.getStorageSync('fuel_number');
			});
		},
		data() {
			return {
				photos: [
					'https://dss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=1743338427,2200622767&fm=26&gp=0.jpg',
					'https://dss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=2534506313,1688529724&fm=26&gp=0.jpg'
				],
				carType: [],
				fuelNumber: [],
				datetimerange: [],
				start: this.dayjs().format('YYYY-MM-DD HH:mm'),
				rangeSeparator: ''
			};
		},
		methods: {
			appointment() {
				if(this.datetimerange.length === 2 && this.rangeSeparator !== ''){
					
				} else {
					uni.showToast({
						icon:'none',
						title:'请选择合理的预约时间',
						duration:2000,
					})
				}
			},
			changeDate(e){
				let endDate = this.dayjs(e[1]);
				let  startDate = e[0];
				let diffDate = endDate.diff(startDate, 'day');
				if(diffDate === 0){
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
	}
	.datePick {
		margin-top: 50rpx;
	}
</style>
