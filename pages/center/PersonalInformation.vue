<template>
	<view class="container">
		<view class="page_title">驾照信息</view>
		<view class="form_item">
			<view class="form_item_title">上传驾照</view>
			<uni-file-picker @select="upload" :limit="1" file-mediatype="image"></uni-file-picker>
		</view>
		<view class="form_item">
			<view class="form_item_title">姓名</view>
			<uni-easyinput placeholder="请输入姓名" v-model="name"></uni-easyinput>
		</view>
		<view class="form_item">
			<view class="form_item_title">性别</view>
			<uni-data-checkbox :localdata="range" placeholder="请选择性别" v-model="gender"></uni-data-checkbox>
		</view>
		<view class="form_item">
			<view class="form_item_title">驾驶证号</view>
			<uni-easyinput placeholder="请输入驾驶证号" v-model="licenseNo"></uni-easyinput>
		</view>
		<view class="form_item">
			<view class="form_item_title">准驾车型</view>
			<uni-easyinput placeholder="请输入准驾车型" v-model="driverType"></uni-easyinput>
		</view>
		<view class="form_item">
			<view class="form_item_title">有效期</view>
			<uni-datetime-picker placeholder="请选择驾照有效期" type="dateranger" v-model="validity"></uni-datetime-picker>
		</view>
		<button type="primary" class="sumbit_btn" @click="onSumbit">提交</button>
	</view>
</template>

<script>
	import config from '../../common/config.js';
	export default {
		data() {
			return {
				licenseUrl: [],
				name: '',
				gender: '',
				licenseNo: '',
				driverType: '',
				validity: [],
				range: [{
					"value": 0,
					"text": "男"
				}, {
					"value": 1,
					"text": "女"
				}, {
					"value": 2,
					"text": "未知"
				}]
			};
		},
		methods:{
			upload(e){
				uni.showLoading({
					title: '上传中',
					mask: true,
				});
				for (let i = 0; i < e.tempFiles.length; i++) {
					let item = e.tempFiles[i]
					console.log(item);
					uni.uploadFile({
						url:`${config.API_URL}/tool/orc/driving?type=8`,
						filePath: item.path,
						name:'file',
						success:(res) =>{
							let result = JSON.parse(res.data);
							this.$emit('getOcrData', result.data);
							result.data && this.fileList.push(result.data);
						},
						fail: (error) => {
							uni.showToast({
								title: error.errMsg,
								icon: 'none',
							});
						},
						complete:()=>{
							uni.hideLoading();
						},
					});
				}
			},
			onSumbit(){
				if(!this.name){
					return uni.showToast({
						title:'请输入姓名',
						icon:'none'
					})
				}
				if(!this.gender){
					return uni.showToast({
						title:'请选择性别',
						icon:'none'
					})
				}
				if(!this.licenseNo){
					return uni.showToast({
						title:'请输入驾驶证号',
						icon:'none'
					})
				}
				if(!this.driverType){
					return uni.showToast({
						title:'请输入准驾车型',
						icon:'none'
					})
				}
				if(this.validity.length !== 2){
					return uni.showToast({
						title:'请选择证件有效期',
						icon:'none'
					})
				}
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
</style>
