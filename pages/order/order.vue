<template>
	<scroll-view>
		<uni-datetime-picker type="daterange" v-model="dateRange" @change="changeDate" start-placeholder="开始时间" end-placeholder="结束时间"></uni-datetime-picker>
		<uni-list>
			<uni-list-item v-for="(item,index) in data" :title="item.title" :note="item.note" :thumb="item.thumb"
				thumbSize="lg" :rightText="item.rightText" :clickable="true" @click="onClick(item)" :key="index"></uni-list-item>
		</uni-list>
	</scroll-view>
</template>

<script>
	import api from '../../api/index.js';
	import config from '../../common/config.js';
	export default {
		data() {
			return {
				dateRange:[],
				pageNo: 1,
				openid: uni.getStorageSync('openid'),
				data: [],
			}
		},
		onReachBottom() {
			// 模拟触底刷新
			this.getOrderList(this.pageNo);
		},
		onPullDownRefresh() {
			this.getOrderList(1);
		},
		mounted() {
			this.getOrderList(1);
		},
		methods: {
			onClick(e){
				uni.navigateTo({
					url: `/pages/order/OrderDetail?id=${e.id}`
				});
			},
			getOrderList(pageNo){
				let pageNum = pageNo || this.pageNo;
				if(this.dateRange.length === 0 || this.dateRange.length === 2){
					api.orderList({
						pageNum,
						pageSize: 10,
						openid: this.openid,
						beginTime: this.dateRange[0] || '',
						endTime: this.dateRange[1] || '',
					}).then((res = {}) => {
						if(res.rows && res.rows.length >= 0){
							let tmpImg = '';
							let tmpList = [];
							res.rows.forEach(o => {
								let carPhotos = ((o.car || {}).carPhotos || '').split(',');
								tmpImg = carPhotos.length >= 1 ? `${config.IMG_URL}${carPhotos[0]}` : '/static/img/car_defalut.png';
								tmpList.push({
									title: (o.car || {}).carBrand,
									note: `${(o.car || {}).color},租期：${o.rentCarDays}天`,
									thumb: tmpImg,
									rightText: `取车时间：${this.dayjs(o.wantCarTime).format('YYYY-MM-DD')}`,
									id: o.orderId,
								})
							});
							pageNum === 1 ? this.data = tmpList : this.data = this._.concat(this.data, tmpList);
							pageNum === 1 ? this.pageNo = 2 : this.pageNo = this.pageNo + 1;
						}
						uni.stopPullDownRefresh();
					});
				} else {
					uni.showToast({
						title: '请选择订单查询范围',
						icon: 'none',
					})
				}
			},
			changeDate(e){
				this.dateRange = e;
				this.$nextTick(() => {
					this.getOrderList(1);
				});
			}
		}
	}
</script>

<style>

</style>
