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
		}
	}
</script>

<style lang="scss">
	@import './static/icon/iconfont-weapp-icon.css';

	/*每个页面公共css */
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		overflow: hidden;
	}
</style>
