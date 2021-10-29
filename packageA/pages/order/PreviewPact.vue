<template>
	<view class="content">
		<image v-if="image" :src="pact"></image>
		<web-view v-if="!image" :src="pact"></web-view>
	</view>
</template>

<script>
	import config from '../../../common/config.js';
	import api from '../../../api/index.js';
	export default {
		onLoad(option) {
			if (option.isImage === '1') {
				this.image = true;
				this.pact = `${config.IMG_URL}${option.param}`;

			} else {
				this.image = false;
				let user = uni.getStorageSync('userInfo');
				api.getTicket({
					contractId: option.param,
					phone: user.phoneNumber,
				}).then(res => {
					let { data } = res;
					if(data){
						// 跳转合同签署
						// #ifdef MP-WEIXIN
							wx.navigateTo({
								url: `plugin://qyssdk-plugin/doc?ticket=${data}&env=cn`,
							});
						// #endif
					}
				})
			}
		},
		data() {
			return {
				pact: '',
				image: true,
			}
		}
	}
</script>

<style lang="scss">

</style>
