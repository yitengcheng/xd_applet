<template>
	<view class="bg_color">
		<u-sticky><uni-nav-bar :statusBar="true" :title="pageTitle"></uni-nav-bar></u-sticky>
		<u-swiper :list="swiperList" mode="none" height="200px" img-mode="scaleToFill"></u-swiper>
		<view class="menusBox">
			<view v-for="(menu, index) in menus" class="menuItem" :key="index" @touchstart="toOtherPage(index)">
				<u-image width="50px" height="50px" :src="menu.icon"></u-image>
				<text>{{ menu.text }}</text>
			</view>
		</view>
		<view class="serviceBox">
			<image class="novice_service" src="../../static/img/new_hand.png" mode="aspectFill" @click="toNewbie"></image>
			<view class="right_box">
				<image class="right_box_top" src="../../static/img/rent_car.png" @click="toCarPage"></image>
				<image class="right_box_bottom" src="../../static/img/shop_query.png" @click="toMap"></image>
			</view>
		</view>
		<view>
			<view class="sift"><image src="../../static/img/zuchelogo.png" class="rental_car_logo"></image></view>
			<view class="handpick_box">
				<view v-for="(car, index) in carList" :key="car.id" class="handpick_card" @touchstart="toCarInfo(car.id)">
					<u-image width="100%" height="300rpx" :src="car.image" mode="aspectFit" ></u-image>
					<view class="handpick_card_text">{{ car.carBrand }}</view>
					<view class="car_box">
						<view style="display: flex;flex-direction: row;align-items: center;">
							<span class="car_price" style="font-size: 8px;">￥</span>
							<span class="car_price">{{ car.unitPrice }}</span>
							/天
						</view>
						<view class="to_icon">></view>
					</view>
				</view>
			</view>
		</view>
		<u-popup :show="showModal" mode="center" :safeAreaInsetBottom="false" :closeOnClickOverlay="false">
			<view class="privacy_box">
				<view class="privacy_title">服务协议</view>
				<view style="display: block;">请您务必认真阅读、充分理解“用户服务协议”和“隐私政策”各条款，包括但不限于：为了向你提供数据、分享等服务所要获取的权限信息。您可以阅读
					<view class="privacy_box_web" @click="goWeb('https://xd.qiantur.com/treaty')">《用户服务协议》</view>
					<view class="privacy_box_web" @click="goWeb('https://xd.qiantur.com/policy')">《隐私政策》</view>
					了解详细信息。如您同意，请点击“同意”开始接受我们的服务。
				</view>
				<view class="privacy_box_btns">
					<u-button type="primary" @click="privacyChange(true)">同意</u-button>
					<u-button type="error" @click="privacyChange(false)">拒绝</u-button>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
import api from '../../api/index.js';
import config from '../../common/config.js';
export default {
	onLoad(option) {
		const updateManager = uni.getUpdateManager();
		updateManager.onCheckForUpdate(res => {
			if (res.hasUpdate) {
				uni.showLoading({
					mask: true,
					title: '新版本更新中'
				});
			} else {
				let url = option.q ? decodeURIComponent(option.q) : '';
				url ? uni.setStorageSync('appletType', 2) : uni.setStorageSync('appletType', 1); // 1: 平台用户 2： 租车公司用户
				url && uni.setStorageSync('complanyId', url.split('=')[1]);
				url.split('=')[2] ? (this.carId = url.split('=')[2]) : (this.carId = '');
				url.split('=')[3] ? (this.type = url.split('=')[3]) : (this.type = '');
				if (option.carId) {
					this.carId = option.carId;
				}
				if (option.payment) {
					this.type = option.payment;
				}
				option.complanyId && uni.setStorageSync('complanyId', option.complanyId);
				uni.$on('refreshIndex', () => {
					this.initCarList();
				});
				uni.$on('changePageTitle', title => {
					this.changePageTitle(title);
				});
				this.personalInfo();
				this.login();
			}
		});
		updateManager.onUpdateReady(res => {
			uni.hideLoading();
			uni.showModal({
				title: '更新提示',
				content: '新版本已经准备好，是否重启应用？',
				success(res) {
					if (res.confirm) {
						updateManager.applyUpdate();
					}
				}
			});
		});
		updateManager.onUpdateFailed(res => {
			uni.hideLoading();
			uni.showModal({
				title: '更新提示',
				content: '更新失败，请重新进入应用',
				showCancel: false,
				success(res) {
					if (res.confirm) {
						updateManager.applyUpdate();
					}
				}
			});
		});
	},
	onPullDownRefresh() {
		this.initCarList();
	},
	onShareAppMessage(res) {
		return {
			title: '优行小滴欢迎你',
			path: `/pages/index/Index?complanyId=${uni.getStorageSync('complanyId')}`
		};
	},
	data() {
		return {
			carId: '',
			type: '', // 1 线上 2 线下
			menus: [
				{
					icon: '/static/img/led.png',
					text: '我要领劵'
				},
				{
					icon: '/static/img/pactScan.png',
					text: '合同扫码'
				},
				{
					icon: '/static/img/trip.png',
					text: '出行宝典'
				},
				{
					icon: '/static/img/accached.png',
					text: '挂靠登记'
				}
			],
			noviceServiceBtn: {
				width: '40%',
				fontSize: '12px',
				height: '25px',
				marginTop: '70px',
				marginLeft: '20px'
			},
			reservationStyle: {
				width: '35%',
				fontSize: '10px',
				height: '15px',
				marginTop: '30px',
				marginLeft: '20px'
			},
			queryStyle: {
				width: '35%',
				fontSize: '10px',
				height: '15px',
				marginTop: '30px',
				marginLeft: '20px'
			},
			carList: [],
			pageTitle: '',
			swiperList: [],
			showModal: false
		};
	},
	mounted() {
		this.initCarList();
	},
	methods: {
		privacyChange(flag){
			uni.setStorageSync('privacyFlag', flag);
			this.showModal = false;
		},
		goWeb(url){
			uni.navigateTo({
				url: `/packageA/pages/center/WebView?url=${url}`
			})
		},
		personalInfo() {
			let flag = uni.getStorageSync('privacyFlag');
			if(!flag){
				this.showModal = true;
			}
		},
		login() {
			uni.login({
				onlyAuthorize: true,
				success: res => {
					!!res.code &&
						api
							.login({
								code: res.code
							})
							.then((res = {}) => {
								if ((res.data || {}).openid) {
									uni.setStorageSync('openid', (res.data || {}).openid);
									this.changePageTitle((res.data || {}).complanyName);
									uni.setStorageSync('phoneNumber', (res.data || {}).phoneNumber);
									uni.setStorageSync('userInfo', {
										collectionNumber: ((res.data || {}).collect || []).length,
										couponNumber: (res.data || {}).couponNum,
										...(res.data || {}).userInfo
									});
									api.rotation(uni.getStorageSync('complanyId') || 0).then(res => {
										if (res.data) {
											let tmp = [];
											let data = res.data.split(',');
											data.forEach(o => {
												tmp.push(`${config.IMG_URL}${o}`);
											});
											this.swiperList = tmp;
										} else {
											this.swiperList = ['https://xd.qiantur.com/minio/xdcloud/20211025032454728.jpg'];
										}
									});
									if (this.carId) {
										uni.navigateTo({
											url: `/packageA/pages/car/CarDetail?id=${this.carId}&type=index&payment=${this.type}`
										});
									}
								} else {
									this.login();
								}
							});
				}
			});
		},
		changePageTitle(title) {
			this.pageTitle = title ? title : '优行小滴';
		},
		initCarList() {
			api.carSelectList().then((res = {}) => {
				if (res.data) {
					let { data } = res;
					let tmp = [];
					data.forEach(row => {
						let carPhotos = row.carPhotos.split(',');
						tmp.push({
							image: (carPhotos?.[0] !== '[object Object]' && carPhotos?.[0] !== '') ? `${config.IMG_URL}${carPhotos[0]}` : '/static/img/defalut.png',
							...row
						});
					});
					this.carList = tmp;
					uni.stopPullDownRefresh();
				}
			});
		},
		toCarInfo(id) {
			uni.navigateTo({
				url: `/packageA/pages/car/CarDetail?id=${id}`
			});
		},
		scanQR() {
			uni.scanCode({
				onlyFromCamera: true,
				success: code => {
					let { result } = code;
					let user = uni.getStorageSync('userInfo');
					if (!user.phoneNumber) {
						uni.navigateTo({
							url: '/packageA/pages/center/PersonalInformation'
						});
						return;
					}
					// 请求合同签署令牌
					api.getTicket({
						contractId: result,
						phone: user.phoneNumber
					}).then(res => {
						let { data } = res;
						if (data) {
							uni.navigateTo({
								url: `/packageA/pages/utils/Pact?data=${data}`
							});
						}
					});
				}
			});
		},
		toOtherPage(index) {
			switch (index) {
				case 0:
					this.addConpou();
					break;
				case 1:
					this.scanQR();
					break;
				default:
					uni.showToast({
						title: '功能正在开发中',
						icon: 'error'
					});
					break;
			}
		},
		toCarPage() {
			uni.switchTab({
				url: '/pages/car/Car'
			});
		},
		toMap() {
			uni.navigateTo({
				url: '/packageA/pages/car/Map'
			});
		},
		addConpou() {
			uni.scanCode({
				onlyFromCamera: true,
				success: code => {
					let { result } = code;
					api.addCoupon({ openId: uni.getStorageSync('openId'), couponId: result }).then(res => {
						if (!res) {
							uni.showToast({
								title: '领取成功',
								icon: 'success'
							});
						}
					});
				}
			});
		},
		toNewbie() {
			uni.navigateTo({
				url: '/packageA/pages/index/Newbie'
			});
		}
	}
};
</script>

<style lang="scss">
.car_box {
	display: flex;
	flex-direction: row;
	justify-content: space-between;
}

.to_icon {
	width: 18px;
	height: 18px;
	border-radius: 50%;
	background-color: #fdd51e;
	text-align: center;
	line-height: 18px;
	font-weight: 700;
}

.car_price {
	color: #ff4343;
	font-size: 18px;
}

.rental_car_logo {
	width: 180rpx;
	height: 55rpx;
}

.status_bar_title {
	flex: 1;
	font-size: 14px;
}

.menusBox {
	margin-top: 20rpx;
	margin-bottom: 20rpx;
	display: flex;
	width: 100%;
	height: 75px;
	flex-direction: row;
	justify-content: space-around;
}

.menuItem {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
}

.sift {
	margin-left: 10px;
	font-family: 'Microsoft YaHei';
	font-size: 20px;
	font-weight: blod;
}

.serviceBox {
	display: flex;
	flex-direction: row;
	width: 100%;
	height: 395rpx;
	padding: 20rpx 0 20rpx 20rpx;
}

.novice_service {
	height: 355rpx;
	width: 365rpx;
	border-radius: 8px;
}

.right_box {
	flex: 1;
	display: flex;
	flex-direction: column;
}

.right_box_top {
	width: 365rpx;
	height: 181.5rpx;
	border-radius: 8px;
}

.right_box_bottom {
	width: 365rpx;
	height: 181.5rpx;
	border-radius: 8px;
}

.handpick_box {
	display: flex;
	width: 100%;
	flex-direction: row;
	justify-content: center;
	flex-wrap: wrap;
}

.handpick_card {
	width: 40%;
	height: 455rpx;
	display: flex;
	flex-direction: column;
	background-color: #ffffff;
	padding: 15px;
	border-radius: 10px;
	margin: 1%;
}

.handpick_card_text {
	width: 100%;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}
.privacy_box{
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 20px;
}
.privacy_title {
	font-size: 18px;
	font-weight: bold;
	margin-bottom: 10px;
}
.privacy_box_btns {
	display: flex;
	flex-direction: row;
	margin-top: 10px;
	width: 100%;
	button{
		flex:1
	}
}
.privacy_box_web {
	display: inline;
	color: #2B85E4;
	text-decoration: underline;
}
</style>
