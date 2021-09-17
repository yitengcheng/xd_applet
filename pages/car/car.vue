<template>
	<view>
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
			}
		},
		methods: {
			itemTap(e) {
				uni.navigateTo({
					url: `/pages/car/CarDetail?${e.id}`,
				})
			}
		}
	}
</script>

<style lang="scss">
</style>
