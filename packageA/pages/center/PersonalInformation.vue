<template>
	<view class="content">
		<view class="form_item">
			<view class="form_item_title">姓名<space style="color: red;">*</space>
			</view>
			<uni-easyinput class="form_item_input" placeholder="请输入姓名" v-model="name" :inputBorder="false">
			</uni-easyinput>
		</view>
		<view class="line"></view>
		<view class="form_item">
			<view class="form_item_title">驾驶证号/身份证号<space style="color: red;">*</space>
			</view>
			<uni-easyinput class="form_item_input" placeholder="请输入驾驶证号" v-model="idcard" :inputBorder="false"
				:maxlength="18">
			</uni-easyinput>
		</view>
		<view class="line"></view>
		<view class="form_item">
			<view class="form_item_title" style="width: 160rpx;">电话号码<space style="color: red;">*</space></view>
			<view class="form_item_phone">
				<uni-easyinput placeholder="请输入电话号码" v-model="phoneNumber" class="form_item_phone_input"
					:inputBorder="false" :maxlength="11"></uni-easyinput>
				<button open-type="getPhoneNumber" @getphonenumber="getUserInfo" size="mini"
					class="form_item_phone_btn">获取手机号</button>
			</view>
		</view>
		<view class="line"></view>
		<view class="form_item">
			<view class="form_item_title">档案编号</view>
			<uni-easyinput class="form_item_input" placeholder="请输入档案编号" v-model="archivesNum" :inputBorder="false">
			</uni-easyinput>
		</view>
		<view class="line"></view>
		<view class="scan_idcard" @click="identifyIdcard">
			<u-icon name="scan"></u-icon>扫描驾驶证快速添加
		</view>
		<u-button type="primary" class="sumbit_btn" @click="onSumbit">提交</u-button>
	</view>
</template>

<script>
	import config from '../../../common/config.js';
	import api from '../../../api/index.js';
	import {
		phoneRegex,
		card15,
		card18
	} from '../../../common/regex.js'
	export default {
		mounted() {
			this.setInitInfo();
		},
		data() {
			return {
				name: '',
				idcard: '',
				phoneNumber: '',
				archivesNum: '',
			};
		},
		methods: {
			getUserInfo(e) {
				uni.login({
					onlyAuthorize: true,
					success: (res) => {
						uni.showLoading({
							title: '加载中',
							icon: 'none',
						});
						!!res.code && api.getInfo({
							encryptedData: e.detail.encryptedData,
							iv: e.detail.iv,
							code: res.code
						}).then(res => {
							uni.hideLoading();
							uni.setStorageSync('openid', res.data.openid);
							uni.setStorageSync('userInfo', res.data.userInfo);
							this.phoneNumber = res.data.userInfo.phoneNumber;
						});
					}
				});
			},
			setInitInfo() {
				let userInfo = uni.getStorageSync('userInfo');
				if (userInfo) {
					this.name = userInfo.name;
					this.idcard = userInfo.idcard;
					this.phoneNumber = userInfo.phoneNumber;
					this.archivesNum = userInfo.archivesNum;
				}
			},
			identifyIdcard() {
				uni.chooseImage({
					count: 1,
					success: (res) => {
						uni.showLoading({
							mask: true,
							title: '识别中'
						})
						uni.uploadFile({
							url: `${config.API_URL}/tool/ocr/driving?type=8`,
							filePath: res.tempFilePaths[0],
							name: 'file',
							success: (data) => {
								let result = JSON.parse(data.data);
								let {
									url,
									ocr
								} = result.data;
								if (url && !!ocr) {
									this.name = ocr.name;
									this.idcard = ocr.licenseNumber;
								}
								uni.hideLoading();
							},
							fail: (error) => {
								uni.showToast({
									title: '识别错误，请稍后再试',
									icon: 'error',
								})
								uni.hideLoading();
							}
						});
					}
				});
			},
			onSumbit(e) {
				if (!this.idcard) {
					return uni.showToast({
						title: '请输入驾驶证号/身份证号',
						icon: 'none'
					})
				}
				if (!this.name) {
					return uni.showToast({
						title: '请输入姓名',
						icon: 'none'
					})
				}
				if (!this.phoneNumber) {
					return uni.showToast({
						title: '请输入手机号码',
						icon: 'none'
					})
				}
				let phoneRe = new RegExp(phoneRegex);
				if (!phoneRe.test(this.phoneNumber)) {
					return uni.showToast({
						title: '请输入正确手机号码',
						icon: 'none',
						duration: 2000,
					})
				}
				let card15Re = new RegExp(card15);
				let card18Re = new RegExp(card18);
				if (!card15Re.test(this.idcard) && !card18Re.test(this.idcard)) {
					return uni.showToast({
						title: '请输入正确身份证',
						icon: 'none',
						duration: 2000,
					})
				}
				api.updateUser({
					name: this.name,
					idcard: this.idcard,
					phoneNumber: this.phoneNumber,
					archivesNum: this.archivesNum,
					openid: uni.getStorageSync('openid'),
				}).then(res => {
					if (!res.data) {
						api.getUserInfo(uni.getStorageSync('openid')).then(res => {
							uni.setStorageSync('userInfo', res.data);
							uni.reLaunch({
								url: '/pages/center/index'
							});
						});
					}
				});
			}
		}
	}
</script>

<style lang="scss">
	.page_title {
		margin-bottom: 20px;
	}

	.form_item {
		display: flex;
		flex-direction: row;
		width: 90%;
		margin-top: 20rpx;
		align-items: center;
	}

	.form_item_title {
		height: 36px;
		line-height: 36px;
	}

	.form_item_input {
		flex: 1;
	}

	.line {
		height: 1px;
		width: 90%;
		background-color: #888888;
		margin: 10px 0px 10px 0px;
	}

	.sumbit_btn {
		margin-top: 20rpx;
		width: 80%;
	}

	.form_item_phone {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
	}

	.form_item_phone_input {
		flex: 1;
		margin-right: 10px;
	}

	.form_item_phone_btn {
		background-color: #FFFFFF;
		color: #000000;
		border-radius: 20px;
		border: 1px #000000 solid;
	}

	.scan_idcard {
		margin-top: 150rpx;
		margin-bottom: 50rpx;
		font-size: 12px;
		color: #666666;
	}
</style>
