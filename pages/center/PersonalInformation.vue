<template>
	<view class="container">
		<view class="page_title">驾照信息</view>
		<view class="form_item">
			<view class="form_item_title">上传驾照主页</view>
			<uni-file-picker @select="upload" :limit="1" file-mediatype="image" v-model="license"></uni-file-picker>
		</view>
		<view class="form_item">
			<view class="form_item_title">电话号码<space style="color: red;">*</space></view>
			<view class="form_item_phone">
				<uni-easyinput placeholder="请输入电话号码" v-model="phoneNumber" class="form_item_phone_input"></uni-easyinput>
				<button open-type="getPhoneNumber" @getphonenumber="getUserInfo" size="mini" class="form_item_phone_btn">获取手机号</button>
			</view>
			
		</view>
		<view class="form_item">
			<view class="form_item_title">驾驶证号<space style="color: red;">*</space></view>
			<uni-easyinput placeholder="请输入驾驶证号" v-model="idcard"></uni-easyinput>
		</view>
		<view class="form_item">
			<view class="form_item_title">姓名<space style="color: red;">*</space></view>
			<uni-easyinput placeholder="请输入姓名" v-model="name"></uni-easyinput>
		</view>
		<view class="form_item">
			<view class="form_item_title">性别</view>
			<uni-data-checkbox :localdata="range" placeholder="请选择性别" v-model="sex"></uni-data-checkbox>
		</view>
		<view class="form_item">
			<view class="form_item_title">准驾车型</view>
			<uni-easyinput placeholder="请输入准驾车型" v-model="driverType"></uni-easyinput>
		</view>
		<view class="form_item">
			<view class="form_item_title">证件有效期</view>
			<uni-datetime-picker placeholder="请选择驾照有效期" type="dateranger" v-model="invalidCarTime">
			</uni-datetime-picker>
		</view>
		<button type="primary" class="sumbit_btn" @click="onSumbit">提交</button>
	</view>
</template>

<script>
	import config from '../../common/config.js';
	import api from '../../api/index.js';
	export default {
		mounted() {
			this.setInitInfo();
		},
		data() {
			return {
				license: [],
				licenseUrl: '',
				name: '',
				sex: '',
				idcard: '',
				driverType: '',
				invalidCarTime: [],
				phoneNumber: '',
				range: [{
					"value": '0',
					"text": "男"
				}, {
					"value": '1',
					"text": "女"
				}, {
					"value": '2',
					"text": "未知"
				}]
			};
		},
		methods: {
			getUserInfo(e){
				uni.login({
					onlyAuthorize: true,
					success: (res) => {
						!!res.code && api.getInfo({
							encryptedData: e.detail.encryptedData,
							iv: e.detail.iv,
							code: res.code
						}).then(res => {
							uni.setStorageSync('openid', res.data.openid);
							uni.setStorageSync('userInfo', res.data.userInfo);
							this.setInitInfo();
						});
					}
				});
			},
			setInitInfo() {
				let userInfo = uni.getStorageSync('userInfo');
				console.log(userInfo);
				if (userInfo) {
					let extname = (userInfo.licenseMainUrl || '').substring((userInfo.licenseMainUrl || '').lastIndexOf('.') + 1);
					let name = (userInfo.licenseMainUrl || '').substring((userInfo.licenseMainUrl || '').lastIndexOf('/') + 1);
					this.license = [{
							name,
							extname,
							url: `${config.IMG_URL}${userInfo.licenseMainUrl}`,
						}],
						this.licenseUrl = userInfo.licenseMainUrl;
					this.name = userInfo.name;
					this.sex = userInfo.sex;
					this.idcard = userInfo.idcard;
					this.driverType = userInfo.driveType;
					this.invalidCarTime = (userInfo.invalidCarTime || '').split(',');
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
						title: '请输入驾驶证号',
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
					sex: this.sex,
					idcard: this.idcard,
					driverType: this.driverType,
					phoneNumber: this.phoneNumber,
					licenseMainUrl: this.licenseUrl,
					invalidCarTime: this.invalidCarTime.toString(','),
					openid: uni.getStorageSync('openid'),
				}).then(res => {
					if (!res.data) {
						api.getUserInfo(uni.getStorageSync('openid')).then(res => {
							uni.setStorageSync('userInfo', res.data);
							uni.navigateBack();
						});
					}
				});
			}
		}
	}
</script>

<style lang="scss">
	.container {
		padding: 10px
	}

	.page_title {
		margin-bottom: 20px;
	}

	.form_item {
		display: flex;
		flex-direction: column;
		margin-top: 20rpx;
	}

	.form_item_title {
		height: 24px;
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
		margin: 0;
	}
</style>
