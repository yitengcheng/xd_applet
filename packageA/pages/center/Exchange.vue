<template>
	<view class="content" style="justify-content: center;background-color: #FFFFFF;">
		<uni-easyinput  placeholder="请输入兑换码" v-model="code" border="bottom" class="input_box"/>
		<u-button type="primary" @click="toExchange">兑换</u-button>
	</view>
</template>

<script>
	import api from '../../../api/index.js';
	export default {
		data() {
			return {
				code: '',
			};
		},
		methods:{
			toExchange(){
				api.exchange({code: this.code, openid: uni.getStorageSync('openid')}).then((res)=>{
					let userInfo = uni.getStorageSync('userInfo');
					uni.setStorageSync('userInfo', {
						...userInfo,
						couponNumber: res.data,
					});
					uni.showModal({
						title: '兑换成功',
						icon: 'success',
						showCancel:false,
						success: () => {
							uni.navigateBack();
						}
					});
				})
			}
		}
	}
</script>

<style lang="scss">
.input_box{
	margin-top: 50%;
	margin-bottom: 50px;
}
</style>
