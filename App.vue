<script>
	export default {
		onLaunch: () => {
			uni.getSetting({
				success: (res) => {
					if (!res.authSetting.userInfo) {
						uni.authorize({
							scope: 'userInfo'
						});
					}
				},
				fail: (error) => {
					console.log(error);
				}
			});
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

<style>
	/*每个页面公共css */
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		overflow: hidden;
	}
</style>
