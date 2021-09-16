<template>
	<view class="content">
		<image :src="head"></image>
		<text class="nameText">{{name}}</text>
	</view>
</template>

<script>
	export default {
		mounted() {
			uni.getUserInfo({
				success: (user) => {
					let {userInfo} = user;
					this.name = userInfo.nickName;
					this.head = userInfo.avatarUrl;
				}
			})
		},
		data() {
			return {
				name: '',
				head: '',
			}
		},
		methods: {
			
		}
	}
</script>

<style lang="scss">
.nameText {
	font-size: 20px;
}
</style>
