<template>
</template>

<script>
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
					// 请求合同签署令牌
					
					// 跳转合同签署
					// #ifdef MP-WEIXIN
						wx.navigateTo({
							url: `plugin://qyssdk-plugin/doc?ticket=${ticket}`,
						});
					// #endif
					
				}
			});
		}
	}
</script>

<style lang="scss">
</style>
