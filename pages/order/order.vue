<template>
	<uni-list>
		<uni-list-item v-for="(item,index) in data" :title="item.title" :note="item.note" :thumb="item.thumb"
			thumbSize="lg" :rightText="item.rightText" :clickable="true" @click="onClick(item)"></uni-list-item>
	</uni-list>
</template>

<script>
	export default {
		data() {
			return {
				data: [{
					title: '车辆型号',
					note: '车身颜色，租金',
					thumb: 'https://img2.baidu.com/it/u=1352817218,2289436358&fm=26&fmt=auto',
					rightText: `取车时间：${this.dayjs().format('YYYY-MM-DD')}`
				},{
					title: '车辆型号',
					note: '车身颜色，租金',
					thumb: 'https://img2.baidu.com/it/u=1352817218,2289436358&fm=26&fmt=auto',
					rightText: `取车时间：${this.dayjs().format('YYYY-MM-DD')}`
				},{
					title: '车辆型号',
					note: '车身颜色，租金',
					thumb: 'https://img2.baidu.com/it/u=1352817218,2289436358&fm=26&fmt=auto',
					rightText: `取车时间：${this.dayjs().format('YYYY-MM-DD')}`
				},{
					title: '车辆型号',
					note: '车身颜色，租金',
					thumb: 'https://img2.baidu.com/it/u=1352817218,2289436358&fm=26&fmt=auto',
					rightText: `取车时间：${this.dayjs().format('YYYY-MM-DD')}`
				}]
			}
		},
		methods: {
			onClick(e){
				uni.navigateTo({
					url: `/pages/order/OrderDetail?${e.id}`
				})
			}
		}
	}
</script>

<style>

</style>
