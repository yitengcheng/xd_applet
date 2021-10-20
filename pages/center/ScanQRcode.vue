<template>
</template>

<script>
	import api from '../../api/index.js';
	export default {
		data() {
			return {
				
			};
		},
		mounted() {
			uni.scanCode({
				onlyFromCamera: true,
				success: (code) => {
					let { result } = code;
					let user = uni.getStorageSync('userInfo');
					if(!user){
						uni.reLaunch({
							url: '/pages/center/PersonalInformation'
						})
						return;
					}
					// 请求合同签署令牌
					api.getTicket({
						contractId: result,
						phone: user.phoneNumber,
					}).then(res => {
						let { data } = res;
						if(data){
							// 跳转合同签署
							// #ifdef MP-WEIXIN
								wx.navigateTo({
									url: `plugin://qyssdk-plugin/doc?ticket=${data}&env=cn`,
									events: {
									        signSuccessCb: () => { // 签署成功回调
												uni.showToast({
													title: '签署成功',
													icon: 'success',
												});
									            eventChannel.emit('jumpTo', '/pages/center/index'); // 触发跳转逻辑，回调存在时必需调用，url不传默认返回
									        },
									        authFailCb() { // 认证失败回调
									            uni.showToast({
									            	title: '签署失败',
									            	icon: 'error',
									            });
									            eventChannel.emit('jumpTo');
									        },
									    },
								});
							// #endif
						}
					})
				}
			});
		}
	}
</script>

<style lang="scss">
</style>
