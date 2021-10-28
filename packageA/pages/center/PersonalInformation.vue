<template>
	<view class="per_content" :style="[{ minHeight: height + 'px', width: '100%'}]" >
		<view class="form_item">
			<view class="form_item_title">姓名<space style="color: red;">*</space></view>
			<uni-easyinput class="form_item_input" placeholder="请输入姓名" v-model="name" :inputBorder="false"></uni-easyinput>
		</view>
		<view class="line"></view>
		<view class="form_item">
			<view class="form_item_title">驾驶证号/身份证号<space style="color: red;">*</space></view>
			<uni-easyinput class="form_item_input" placeholder="请输入驾驶证号/身份证号" v-model="idcard" :inputBorder="false"></uni-easyinput>
		</view>
		<view class="line"></view>
		<view class="form_item">
			<view class="form_item_title" style="width: 80px;">电话号码<space style="color: red;">*</space></view>
			<view class="form_item_phone">
				<uni-easyinput placeholder="请输入电话号码" v-model="phoneNumber" class="form_item_phone_input" :inputBorder="false"></uni-easyinput>
				<button open-type="getPhoneNumber" @getphonenumber="getUserInfo" size="mini" class="form_item_phone_btn">获取手机号</button>
			</view>
		</view>
		<view class="line"></view>
		<button>扫描身份证快速添加</button>
		<button type="primary" class="sumbit_btn" @click="onSumbit">提交</button>
	</view>
</template>

<script>
	import config from '../../../common/config.js';
	import api from '../../../api/index.js';
	export default {
		onLoad() {
			uni.getSystemInfo({
				success: (e) => {
					this.height = e.safeArea.height;
				}
			})
		},
		mounted() {
			this.setInitInfo();
		},
		data() {
			return {
				name: '',
				idcard: '',
				phoneNumber: '',
				height: 0,
			};
		},
		methods: {
			getUserInfo(e){
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
				}
			},
			upload(e) {
				uni.showLoading({
					title: '上传中',
					mask: true,
				});
				for (let i = 0; i < e.tempFiles.length; i++) {
					let item = e.tempFiles[i]
					uni.uploadFile({
						url: `${config.API_URL}/tool/ocr/driving?type=8`,
						filePath: item.path,
						name: 'file',
						success: (res) => {
							let result = JSON.parse(res.data);
							if (result.data.ocr.error_code === 282103) {
								uni.showToast({
									title: '请上传正确的驾驶证主页',
									icon: 'none',
								});
								return;
							}
							this.licenseUrl = result.data.url;
							let {
								words_result
							} = ((result || {}).data || {}).ocr;
							if (words_result) {
								this.name = words_result.姓名.words;
								this.sex = this._.find(this.range, o => o.text === words_result.性别.words)
									.value;
								this.idcard = words_result.证号.words;
								this.driverType = words_result.准驾车型.words;
								this.invalidCarTime = [this.dayjs(words_result.有效起始日期.words).format(
									'YYYY-MM-DD'), this.dayjs(words_result.失效日期.words).format(
									'YYYY-MM-DD')];
							}
						},
						fail: (error) => {
							uni.showToast({
								title: error.errMsg,
								icon: 'none',
							});
						},
						complete: () => {
							uni.hideLoading();
						},
					});
				}
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
				api.updateUser({
					name: this.name,
					idcard: this.idcard,
					phoneNumber: this.phoneNumber,
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
	.per_content {
		display: flex;
		flex: 1;
		flex-direction: column;
		width: 100%;
		padding: 10px;
		align-items: center;
		overflow-y: hidden;
		background-color: #f4f4f4;
	}

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
</style>
