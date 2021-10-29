<template>
	<scroll-view>
		<view v-for="(complany, index) in list" :key="index" class="item" @click="toCar(complany)">
			<image :src="complany.image" class="item_img"></image>
			<view class="item_text">{{complany.title}}</view>
		</view>
	</scroll-view>
</template>

<script>
	import api from '../../../api/index.js';
	export default {
		data() {
			return {
				list: []
			};
		},
		mounted() {
			this.getCollectList()
		},
		methods: {
			getCollectList() {
				api.collectionList(uni.getStorageSync('openid')).then((res = {}) => {
					if (res.rows) {
						res.rows.forEach(o => {
							this.list.push({
								title: o.complanyName,
								image: '/packageA/static/img/shop_icon.png',
								id: o.id,
							});
						})
					}
				})
			},
			toCar(complany){
				uni.setStorageSync('complanyId', complany.id);
				uni.reLaunch({
					url: `/pages/car/Car`
				});
				uni.$emit('refreshIndex');
				uni.$emit('refreshCar');
			}
		}
	}
</script>

<style lang="scss">
	.item {
		display: flex;
		flex-direction: row;
		margin: 10px;
		padding: 10px;
		border-bottom: 1px solid #f8f8f8;
	}

	.item_img {
		width: 40px;
		height: 40px;
	}

	.item_text {
		flex: 1;
		display: flex;
		justify-content: center;
		align-items: center;
	}
</style>
