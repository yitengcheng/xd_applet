<script>
	export default {
		onLaunch: () => {
			console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		},
	}
</script>

<style lang="scss">
	@import './static/icon/iconfont-weapp-icon.css';
	@import "uview-ui/index.scss";

	/*每个页面公共css */
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		overflow: hidden;
		background-color: #f4f4f4;
		width: 100%;
		min-height: 1320rpx;
	}
	
	.bg_color{
		background-color: #f4f4f4;
	}
</style>
