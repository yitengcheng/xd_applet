<template>
	<view class="content">
		<swiper class="swiper_box" :indicator-dots='true' :autoplay='true'>
			<swiper-item v-for="(item, index) in photos" :key="index">
				<image :src="item" class="swiper_img" mode="aspectFit"></image>
			</swiper-item>
		</swiper>
		<view class="car_info_box">
			<text>车辆品牌</text>
			<text>车辆颜色</text>
			<text>车辆型号</text>
			<text>车辆价值</text>
			<text>车牌号</text>
			<text>荷载人数</text>
			<text>租金</text>
			<text>下单时间</text>
			<text>取车时间</text>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				photos: [
					'https://dss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=1743338427,2200622767&fm=26&gp=0.jpg',
					'https://dss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=2534506313,1688529724&fm=26&gp=0.jpg'
				],
			};
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
		margin-left: 20px;
		margin-top: 20px;
	}
</style>
