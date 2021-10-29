<template>
	<view class="content" >
		<uni-datetime-picker type="daterange" v-model="dateRange" @change="changeDate" start-placeholder="开始时间" end-placeholder="结束时间"></uni-datetime-picker>
		<view :style="[{ minHeight: height + 'px', width: '100%'}]">
			<view class="order_card" v-for="(order,index) in data" :key="index" @click="onClick(order)">
				<view class="top">
					<text>{{dayjs(order.createTime).format('YYYY-MM-DD')}}</text>
					<text>{{dayjs(order.createTime).format('HH:mm:ss')}}</text>
					<u-tag :text="order.payText" shape="circleRight" :type="order.payType"></u-tag>
				</view>
				<view class="middle">
					<view class="dot_line">
						<view class="dot"></view>
						<view class="line"></view>
					</view>
					<view class="address_box">
						<view class="take_car">
							<view>{{order.address}}</view>
						</view>
					</view>
				</view>
				<view class="bottom">
					<view class="dot_line">
						<view class="line"></view>
						<u-icon name="map-fill" size="34"></u-icon>
					</view>
					<view class="return_address_box">
						<view class="return_car">
							<view>{{order.returnAddress}}</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		
	</view>
</template>

<script>
	import api from '../../api/index.js';
	import config from '../../common/config.js';
	export default {
		onLoad() {
			uni.getSystemInfo({
				success: (e) => {
					this.height = e.safeArea.height - 136;
				}
			})
		},
		data() {
			return {
				dateRange:[],
				pageNo: 1,
				openid: uni.getStorageSync('openid'),
				data: [],
				height: 0,
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
					url: `/packageA/pages/order/OrderDetail?id=${e.orderId}`
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
								tmpList.push({
									payText: o.payStatus === 'SUCCESS' ? '支付成功' : o.payStatus === 'NOTPAY' ? "等待付款" : o.payStatus === 'REFUNDED' ? '退款完成' : o.payStatus === 'CLOSED' ? '订单关闭' : o.payStatus,
									payType: o.payStatus === 'SUCCESS' ? 'primary' : o.payStatus === 'NOTPAY' ? "success" : o.payStatus === 'REFUNDED' ? 'error' : o.payStatus === 'CLOSED' ? 'info' : 'primary',
									...o
								});
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

<style lang="scss">
	.order_card {
		background-color: #FFFFFF;
		padding: 10px 0px 10px 0px;
		margin: 10px;
		width: 95%;
		height: 250rpx;
		display: flex;
		flex-direction: column;
		border-radius: 8px;
	}
	.top {
		display: flex;
		flex-direction: row;
		justify-content: space-around;
		align-items: center;
		margin-bottom: 5px;
	}
	.middle {
		flex: 1;
		display: flex;
		flex-direction: row;
	}
	.bottom {
		flex: 1;
		display: flex;
		flex-direction: row;
	}
	.dot_line {
		flex: 1;
		padding: 1px 10px 1px 10px;
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	
	.dot {
		background-color: #fdd51e;
		width: 18px;
		height: 18px;
		border: 1px solid #fdd51e;
		border-radius: 50%;
	}
	
	.line {
		flex: 1;
		width: 1px;
		border: 1px dashed black;
	}
	
	.address_box {
		display: flex;
		width: 100%;
		flex-direction: column;
	}
	
	.return_address_box {
		display: flex;
		width: 100%;
		flex-direction: column;
		justify-content: flex-end;
	}
	
	.take_car {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		font-size: 14px;
		font-weight: 700;
	}
	
	.return_car {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		font-size: 14px;
		font-weight: 700;
	}
</style>
