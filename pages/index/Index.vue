<template>
	<view class="bg_color">
		<u-image width="100%" height="300rpx" src="https://xd.qiantur.com/minio/xdcloud/20211025032454728.jpg"></u-image>
		<view class="menusBox">
			<view v-for="(menu, index) in menus" class="menuItem" :key="index" @click="toOtherPage(index)">
				<text class="t-icon btn_icon" :class="'t-' + menu.icon"></text>
				<text>{{ menu.text }}</text>
			</view>
		</view>
		<view class="serviceBox">
			<view class="novice_service"><u-button type="warning" size="small" :custom-style="noviceServiceBtn">详情>></u-button></view>
			<view class="right_box">
				<view class="right_box_top"><u-button type="warning" size="small" :custom-style="reservationStyle">立即预定></u-button></view>
				<view class="right_box_bottom"><u-button type="warning" size="small" :custom-style="queryStyle">立即查询></u-button></view>
			</view>
		</view>
		<view>
			<view>小滴精选</view>
			<view class="handpick_box">
				<u-card v-for="car in carList" :key="car.id" class="handpick_card" :show-head="false" :show-foot="false" @click="toCarInfo(car.id)">
					<view slot="body">
						<u-image width="100%" height="300rpx" :src="car.image" mode="aspectFit"></u-image>
						<view class="handpick_card_text">{{car.carBrand}}</view>
						<view>{{car.price}}元/天</view>
					</view>
				</u-card>
			</view>
		</view>
	</view>
</template>

<script>
import api from '../../api/index.js';
import config from '../../common/config.js';
export default {
	onLoad(option) {
		let url = option.q ? decodeURIComponent(option.q) : '';
		url ? uni.setStorageSync('appletType', 2) : uni.setStorageSync('appletType', 1); // 1: 平台用户 2： 租车公司用户
		url && uni.setStorageSync('complanyId', url.split('=')[1]);
		url.split('=')[2] ? this.carId = url.split('=')[2] : this.carId = '';
		uni.showLoading({
			title: '信息加载中...',
			mask: true,
		});
		uni.login({
			onlyAuthorize: true,
			success: (res) => {
				!!res.code && api.login(res.code).then(res => {
					uni.setStorageSync('openid', res.data.openid);
					uni.setStorageSync('userInfo', res.data.userInfo);
					uni.hideLoading();
					if (this.carId) {
						uni.reLaunch({
							url: `/packageA/pages/car/CarDetail?id=${this.carId}&type=index`
						});
					}
				});
			}
		});
		uni.$on('refreshIndex',()=>{
			this.initCarList();
		});
	},
	data() {
		return {
			carId: '',
			menus: [
				{icon: 'icon-121zhanweitu', text: '挂靠登记'},
				{icon: 'icon-121zhanweitu', text: '优惠券'},
				{icon: 'icon-121zhanweitu', text: '合同扫码'},
				{icon: 'icon-121zhanweitu', text: '出行宝典'},
			],
			noviceServiceBtn:{
				width: '40%',
				fontSize: "12px",
				height: '25px',
				marginTop: '70px',
				marginLeft: '20px',
			},
			reservationStyle: {
				width: '35%',
				fontSize: "10px",
				height: '15px',
				marginTop: '30px',
				marginLeft: '20px',
			},
			queryStyle: {
				width: '35%',
				fontSize: "10px",
				height: '15px',
				marginTop: '30px',
				marginLeft: '20px',
			},
			carList: []
		}
	},
	mounted() {
		this.initCarList();
	},
	methods: {
		initCarList(){
			api.carList({
				pageNum: 1,
				pageSize: 10,
				carType: '',
			}).then((res = {}) => {
				if(res.rows){
					let { rows } = res;
					let tmp = []
					rows.forEach(row => {
						let carPhotos = row.carPhotos.split(',');
						tmp.push({
							image: carPhotos.length >= 1 ? `${config.IMG_URL}${carPhotos[0]}` : '/static/img/car_defalut.png',
								...row
						});
					});
					this.carList = tmp;
				}
			});
		},
		toCarInfo(id){
			uni.navigateTo({
				url: `/packageA/pages/car/CarDetail?id=${id}`,
			})
		},
		toOtherPage(index){
			switch(index){
				case 0:
					uni.navigateTo({
						url: '/packageA/pages/car/Map'
					});
					break;
				default:
					uni.showToast({
						title: '功能正在开发中',
						icon: 'error',
					});
					break;
			}
		}
	}
}
</script>

<style lang="scss">
.menusBox {
	margin-top: 20rpx;
	margin-bottom: 20rpx;
	display: flex;
	width: 100%;
	height: 45px;
	flex-direction: row;
	justify-content: space-around;
}
.menuItem {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
}
.btn_icon {
	width: 24px;
	height: 24px;
	margin-bottom: 5px;
}
.serviceBox {
	display: flex;
	flex-direction: row;
	width: 100%;
	height: 300rpx;
	padding: 10px;
}
.novice_service {
	flex: 1;
	background-color: red;
	border-radius: 8px;
	margin-right: 5px;
}
.right_box {
	flex: 1;
	display: flex;
	flex-direction: column;
}
.right_box_top {
	width: 100%;
	flex: 1;
	border-radius: 8px;
	background-color: green;
	margin-bottom: 10px;
}
.right_box_bottom {
	width: 100%;
	flex: 1;
	border-radius: 8px;
	background-color: blue;
}
.handpick_box {
	display: flex;
	width: 100%;
	flex-direction: row;
	flex-wrap: wrap;
}
.handpick_card {
	width: 50%;
	height: 500rpx;
}
.handpick_card_text {
	width: 100%;
	overflow: hidden;
	text-overflow:ellipsis;
	white-space: nowrap;
}
</style>
