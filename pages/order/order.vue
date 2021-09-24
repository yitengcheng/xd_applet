<template>
	<view>
		<uni-datetime-picker type="daterange" v-model="dateRange" @change="changeDate"></uni-datetime-picker>
		<uni-list>
			<uni-list-item v-for="(item,index) in data" :title="item.title" :note="item.note" :thumb="item.thumb"
				thumbSize="lg" :rightText="item.rightText" :clickable="true" @click="onClick(item)" :key="index"></uni-list-item>
		</uni-list>
	</view>
	
</template>

<script>
	import api from '../../api/index.js';
	export default {
		data() {
			return {
				dateRange:[],
				pageNo: 1,
				openid: uni.getStorageSync('openid'),
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
		mounted() {
			this.getOrderList(1);
		},
		methods: {
			onClick(e){
				uni.navigateTo({
					url: `/pages/order/OrderDetail?${e.id}`
				})
			},
			getOrderList(pageNo){
				let pageNum = pageNo || this.pageNo;
				if(this.dateRange.length === 0 || this.dateRange.length === 2){
					api.orderList({
						pageNum,
						pageSize: 10,
						openid: this.openid,
						beginTime: this.dateRange[0],
						endTime: this.dateRange[1],
					}).then(res => {
						console.log(res);
					});
				} else {
					uni.showToast({
						title: '请选择订单查询范围',
						icon: 'none',
					})
				}
				
			},
			changeDate(){
				
			}
		}
	}
</script>

<style>

</style>
