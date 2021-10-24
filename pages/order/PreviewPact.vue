<template>
	<view class="content">
		<image v-if="image" :src="pact"></image>
		<web-view v-if="!image" :src="pact"></web-view>
	</view>
</template>

<script>
	import config from '../../common/config.js';
	import api from '../../api/index.js';
	export default {
		onLoad(option) {
			if(option.image === '1'){
				this.image = true;
				this.pact = `${config.IMG_URL}${option.param}`;
			} else {
				this.image = false;
				api.previe(option.param).then((res = {})=>{
					if(res.data){
						this.pact = res.data;
					}
				});
			}
		},
	}
</script>

<style lang="scss">

</style>
