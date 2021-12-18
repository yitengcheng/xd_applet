<template>
	<view></view>
</template>

<script>
import config from '../../../common/config.js';
export default {
	onLoad(option) {
		if (option?.data) {
			wx.navigateTo({
				url: `plugin://qyssdk-plugin/doc?ticket=${option.data}&env=${config.QYS}`,
				events: {
					signSuccessCb: () => {
						// 签署成功回调
						const url = '/pages/index/Index'; // 需要跳转的小程序页面地址，必须是绝对路径，可不传
						eventChannel.emit('jumpTo', url); // 触发跳转逻辑，回调存在时必需调用，url不传默认返回
					},
					authSuccessCb() {
						eventChannel.emit('jumpTo');
					},
					authFailCb() {
						eventChannel.emit('jumpTo');
					}
				},
				success(res) {
					eventChannel = res.eventChannel;
				}
			});
		}
	},
	data() {
		return {};
	}
};
</script>

<style lang="scss"></style>
