<template>
	<scroll-view>
		<view v-for="(card, index ) in cardList" :key="index" class="card_box">
			<view class="card_box_left">
				<view class="card_title">{{card.title}}</view>
				<view class="card_expiration">{{card.expirationTime}}到期</view>
				<view class="card_rule">使用规则></view>
			</view>
			<view class="card_box_right">
				<view class="card_price">￥{{card.preferentialPrice}}</view>
				<view class="card_use">去使用</view>
			</view>
		</view>
	</scroll-view>
</template>

<script>
	export default {
		data() {
			return {
				cardList: [{
					title: '测试优惠券',
					expirationTime: this.dayjs().format('YYYY年MM月DD日'),
					preferentialPrice: '200',
				}, {
					title: '测试优惠券',
					expirationTime: this.dayjs().format('YYYY年MM月DD日'),
					preferentialPrice: '20',
				}, {
					title: '测试优惠券',
					expirationTime: this.dayjs().format('YYYY年MM月DD日'),
					preferentialPrice: '20',
				}, ]
			};
		}
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
	}
</style>
