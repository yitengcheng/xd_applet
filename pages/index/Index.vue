<template>
	<view class="bg_color" :style="[{ minHeight: height + 'px', width: '100%'}]">
		<uni-nav-bar :title="pageTitle" :statusBar="true"></uni-nav-bar>
		<u-image width="100%" height="300rpx" src="https://xd.qiantur.com/minio/xdcloud/20211025032454728.jpg">
		</u-image>
		<view class="menusBox">
			<view v-for="(menu, index) in menus" class="menuItem" :key="index" @click="toOtherPage(index)">
				<u-image width="50px" height="50px" :src="menu.icon"></u-image>
				<text>{{ menu.text }}</text>
			</view>
		</view>
		<view class="serviceBox">
			<image class="novice_service" src="../../static/img/new_hand.png" mode="aspectFill"></image>
			<view class="right_box">
				<image class="right_box_top" src="../../static/img/rent_car.png" @click="toCarPage"></image>
				<image class="right_box_bottom" src="../../static/img/shop_query.png" @click="toMap"></image>
			</view>
		</view>
		<view>
			<view class="sift">租车精选</view>
			<view class="handpick_box">
				<u-card v-for="car in carList" :key="car.id" class="handpick_card" :show-head="false" :show-foot="false"
					@click="toCarInfo(car.id)" margin="1px" border-radius="30">
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
					!!res.code && api.login(res.code).then((res = {}) => {
						uni.setStorageSync('openid', (res.data || {}).openid);
						uni.setStorageSync('userInfo', {
							collectionNumber: ((res.data || {}).collect||[]).length,
							couponNumber: (res.data || {}).couponNum,
							...(res.data || {}).userInfo,
							});
						uni.hideLoading();
						if (this.carId) {
							uni.reLaunch({
								url: `/packageA/pages/car/CarDetail?id=${this.carId}&type=index`
							});
						}
					});
				}
			});
			uni.$on('refreshIndex', () => {
				this.initCarList();
			});
			uni.getSystemInfo({
				success: (e) => {
					this.height = e.safeArea.height - 92;
				}
			});
			uni.$on('changePageTitle',(title)=>{ this.changePageTitle(title)});
		},
		data() {
			return {
				carId: '',
				height: '',
				menus: [{
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
					},
				],
				noviceServiceBtn: {
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
				carList: [],
				pageTitle: ''
			}
		},
		mounted() {
			this.initCarList();
			this.changePageTitle();
		},
		methods: {
			changePageTitle(title){
				this.pageTitle = title ? title : '优行小滴';
			},
			initCarList() {
				api.carSelectList().then((res = {}) => {
					if (res.data) {
						let {
							data
						} = res;
						let tmp = []
						data.forEach(row => {
							let carPhotos = row.carPhotos.split(',');
							tmp.push({
								image: carPhotos.length >= 1 ? `${config.IMG_URL}${carPhotos[0]}` :
									'/static/img/car_defalut.png',
								...row
							});
						});
						this.carList = tmp;
					}
				});
			},
			toCarInfo(id) {
				uni.navigateTo({
					url: `/packageA/pages/car/CarDetail?id=${id}`,
				})
			},
			scanQR() {
				uni.scanCode({
					onlyFromCamera: true,
					success: (code) => {
						let {
							result
						} = code;
						let user = uni.getStorageSync('userInfo');
						if (!user.phoneNumber) {
							uni.navigateTo({
								url: '/packageA/pages/center/PersonalInformation'
							})
							return;
						}
						// 请求合同签署令牌
						api.getTicket({
							contractId: result,
							phone: user.phoneNumber,
						}).then(res => {
							let {
								data
							} = res;
							if (data) {
								// 跳转合同签署
								wx.navigateTo({
									url: `plugin://qyssdk-plugin/doc?ticket=${data}&env=cn`,
									events: {
										signSuccessCb: () => { // 签署成功回调
											const url = '/pages/index/Index'; // 需要跳转的小程序页面地址，必须是绝对路径，可不传
											eventChannel.emit('jumpTo',url); // 触发跳转逻辑，回调存在时必需调用，url不传默认返回
										},
									},
									success(res) {
										uni.showModal({
											title: '签署成功',
											icon: 'success',
											showCancel:false,
											success: (e) => {
												eventChannel = res.eventChannel;
											}
										});
									},
								});
							}
						})
					}
				});
			},
			toOtherPage(index) {
				switch (index) {
					case 1:
						this.scanQR();
						break;
					default:
						uni.showToast({
							title: '功能正在开发中',
							icon: 'error',
						});
						break;
				}
			},
			toCarPage(){
				uni.switchTab({
					url: '/pages/car/Car'
				});
			},
			toMap(){
				uni.navigateTo({
					url: '/packageA/pages/car/Map'
				})
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
		height: 187.5rpx;
		border-radius: 8px;
	}

	.right_box_bottom {
		width: 365rpx;
		height: 187.5rpx;
		border-radius: 8px;
	}

	.handpick_box {
		display: flex;
		width: 100%;
		flex-direction: row;
		flex-wrap: wrap;
	}

	.handpick_card {
		width: 50%;
		height: 440rpx;
	}

	.handpick_card_text {
		width: 100%;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
</style>
