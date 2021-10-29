<template>
	<scroll-view>
		<view v-for="(card, index ) in cardList" :key="index" class="card_box">
			<view class="card_box_left">
				<view class="card_title">{{card.title}}</view>
				<view class="card_expiration">{{card.expirationTime}}到期</view>
				<view class="card_rule">{{`满${card.conditions}元可使用`}}</view>
			</view>
			<view class="card_box_right">
				<view class="card_price">￥{{card.preferentialPrice}}</view>
				<button class="card_use" :disabled="card.disabled" @click="toUse(card.id)">去使用</button>
			</view>
		</view>
	</scroll-view>
</template>

<script>
	import api from '../../../api/index.js';
	export default {
		data() {
			return {
				pageNo: 1,
				cardList: []
			};
		},
		mounted() {
			this.getCouponsList();
		},
		onReachBottom() {
			// 模拟触底刷新
			this.getCouponsList(this.pageNo);
		},
		onPullDownRefresh() {
			this.getCouponsList(1);
		},
		methods:{
			toUse(id){
				uni.setStorageSync('complanyId', id);
				uni.reLaunch({
					url: `/pages/index/Index`
				});
				uni.$emit('refreshCar');
				uni.$emit('refreshIndex');
				
			},
			getCouponsList(pageNo){
				let pageNum = pageNo || this.pageNo;
				api.couponsList({
					pageNum,
					pageSize: 10,
					openid: uni.getStorageSync('openid'),
				}).then(res => {
					let tmpList = [];
					if(res.rows){
						res.rows.forEach((o,index) => {
							tmpList.push({
								title: o.title,
								expirationTime: this.dayjs(o.endTime).format('YYYY年MM月DD日'),
								preferentialPrice: o.price,
								conditions: o.strip,
								disabled: this.dayjs().isAfter(this.dayjs(o.endTime)),
								id: o.complanyId,
							});
						});
						pageNum === 1 ? this.cardList = tmpList : this.cardList = this._.concat(this.cardList, tmpList);
						pageNum === 1 ? this.pageNo = 2 : this.pageNo = this.pageNo + 1;
					}
					uni.stopPullDownRefresh();
				});
			}
		},
	}
</script>

<style lang="scss">
	.card_box {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		border: 1px solid #666;
		border-radius: 5px;
		margin: 10px;
	}

	.card_box_left {
		display: flex;
		flex-direction: column;
		justify-content: space-around;
		flex: 1;
		margin: 10px;
		border-right: 1px gray dashed;
	}

	.card_title {
		font-size: 18px;
		font-weight: 700;
	}

	.card_expiration {
		font-size: 12px;
		color: #888;
	}

	.card_rule {
		font-size: 12px;
		color: #888;
	}

	.card_box_right {
		display: flex;
		flex-direction: column;
		margin: 10px;
		justify-content: center;
	}

	.card_price {
		color: red;
		font-size: 18px;
	}

	.card_use {
		border: 1px solid red;
		background-color: red;
		color: white;
		padding: 5px;
		border-radius: 8px;
		height: 35px;
		line-height: 25px;
	}
</style>
