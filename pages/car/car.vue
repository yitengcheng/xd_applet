<template>
	<view>
		<view class="custom_top" :style="{height: top_height + 40 + 'px'}">
			<view class="map_Btn" @click="toMap">
				<text class="map_icon t-icon t-icon-ditu"></text>
				<text class="shop_name">{{shopName}}</text>
			</view>
			<text class="page_title">租车</text>
		</view>
		<uni-easyinput v-model="keyword" placeholder="请输入关键字搜索" suffixIcon="search"></uni-easyinput>
		<WaterfallsFlow :wfList='list' @itemTap="itemTap" />
	</view>
</template>

<script>
	import WaterfallsFlow from '../../components/WaterfallsFlow/WaterfallsFlow.vue';
	export default {
		components: {
			WaterfallsFlow,
		},
		onLoad(option) {
			uni.getSystemInfo({
				success: (res) => {
					this.top_height = res.statusBarHeight;
				}
			});
			option !== {} && this.changeShopName(option);
		},
		mounted() {
			this.list = [{
					nickName: '测试',
					image: 'https://dss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=1743338427,2200622767&fm=26&gp=0.jpg',
					id: 1
				},
				{
					nickName: '测试',
					image: 'https://dss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=2534506313,1688529724&fm=26&gp=0.jpg',
					id: 2
				},
				{
					nickName: '测试',
					image: 'https://dss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=1906469856,4113625838&fm=26&gp=0.jpg',
					id: 3
				},
				{
					nickName: '测试',
					image: 'https://dss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=1141259048,554497535&fm=26&gp=0.jpg',
					id: 4
				},
				{
					nickName: '测试',
					image: 'https://dss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=3892521478,1695688217&fm=26&gp=0.jpg',
					id: 5
				},
				{
					nickName: '测试',
					image: 'https://dss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=1089874897,1268118658&fm=26&gp=0.jpg',
					id: 6
				},
			];
		},
		data() {
			return {
				list: [],
				keyword: '',
				top_height: 0,
				shopName: '叙利亚租车店'
			}
		},
		methods: {
			itemTap(e) {
				uni.navigateTo({
					url: `/pages/car/CarDetail?${e.id}`,
				})
			},
			changeShopName(shop){
				this.shopName = shop.name;
			},
			toMap(){
				uni.navigateTo({
					url: '/pages/car/Map',
				});
			}
		}
	}
</script>

<style lang="scss">
	.custom_top {
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
	}
	.map_Btn {
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		align-items: center;
		flex: 1;
		padding-left: 5px;
		margin-top: 20px;
	}
	.shop_name {
		flex: 1;
		font-size: 12px;
	}
	.map_icon {
		width: 24px;
		height: 24px;
	}
	.page_title {
		flex:1.2;
		margin-top: 20px;
		font-size: 13px;
	}
</style>
