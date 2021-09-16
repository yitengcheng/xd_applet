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
		<uni-datetime-picker v-model="datetimerange" type="datetimerange" :start="start" rangeSeparator="至" class="datePick" />
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
			};
		},
		methods: {
			appointment() {
				if(this.datetimerange.length === 2){
					
				} else {
					uni.showToast({
						icon:'none',
						title:'请选择预约时间',
						duration:2000,
					})
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
