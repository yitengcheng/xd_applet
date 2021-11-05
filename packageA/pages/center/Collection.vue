<template>
	<scroll-view>
		<view v-for="(complany, index) in list" :key="index" class="item" @click="toCar(complany)">
			<image :src="complany.image" class="item_img"></image>
			<view class="item_box">
				<view class="item_text">{{complany.title}}</view>
				<view class="item_text_address">{{complany.address}}</view>
			</view>
		</view>
	</scroll-view>
</template>

<script>
	import api from '../../../api/index.js';
	export default {
		data() {
			return {
				list: [],
				pageNo: 1,
			};
		},
		mounted() {
			this.getCollectList(1);
		},
		onPullDownRefresh() {
			this.getCollectList(1);
		},
		onReachBottom() {
			this.getCollectList(this.pageNo);
		},
		methods: {
			getCollectList(pageNum) {
				api.collectionList({
					openid: uni.getStorageSync('openid'),
					pageNum,
					pageSize: 10,
				}).then((res = {}) => {
					if (res.rows) {
						let tmp = []
						res.rows.forEach(o => {
							tmp.push({
								title: o.complanyName,
								address: o.complanyAddress,
								image: '/packageA/static/img/shop_icon.png',
								id: o.id,
							});
						});
						pageNum === 1 ? this.list = tmp : this.list = this._.concat(this.list, tmp);
						pageNum === 1 ? this.pageNo = 2 : this.pageNo = pageNum + 1;
					}
				})
			},
			toCar(complany) {
				uni.setStorageSync('complanyId', complany.id);
				uni.reLaunch({
					url: `/pages/car/Car`
				});
				uni.$emit('refreshIndex');
				uni.$emit('refreshCar');
				uni.$emit('changePageTitle', complany.title);
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
		font-size: 18px;
		font-weight: 700;
		color: #333333;
	}
	
	.item_text_address {
		font-size: 12px;
		color: #888888;
	}

	.item_box {
		flex: 1;
		margin-left: 10px;
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: flex-start;
	}
</style>
