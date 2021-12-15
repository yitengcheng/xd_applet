<template>
	<view class="content" style="align-items: center;">
		<u-sticky>
			<view>
				<uni-datetime-picker type="daterange" v-model="dateRange" @change="changeDate" start-placeholder="开始时间"
					end-placeholder="结束时间"></uni-datetime-picker>
				<view style="width: 750rpx">
					<u-tabs :list="payStatusList" name="name" :current="type" @change="changePayType"
						active-color="#fdd51e"></u-tabs>
				</view>

			</view>
		</u-sticky>

		<view class="order_card" v-for="(order,index) in data" :key="index" @click="onClick(order)">
			<view class="top">
				<text class="car_band">{{order.car.carBrand}}</text>
				<text>{{dayjs(order.wantCarTime).format('YYYY-MM-DD')}}</text>
				<text>{{dayjs(order.wantCarTime).format('HH:mm:ss')}}</text>
				<u-tag :text="order.payText" shape="circle" :type="order.payType"></u-tag>
			</view>
			<view class="middle">
				<view class="dot_line">
					<view class="dot"></view>
					<view class="line"></view>
				</view>
				<view class="address_box">
					<view class="car">
						<view class="car_type">取车</view>
						<view class="car_address">{{order.address || '无'}}</view>
					</view>
				</view>
			</view>
			<view class="bottom">
				<view class="dot_line">
					<u-icon name="map-fill" size="20"></u-icon>
				</view>
				<view class="return_address_box">
					<view class="car">
						<view class="car_type">还车</view>
						<view class="car_address">{{order.returnAddress || '无'}}</view>
						<view class="car_price">
							<span class="symbol">￥</span>
							{{order.totalMoney === '0' ? order.shouldMoney/100 : order.totalMoney/100}}
							<span class="unit">元</span>
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
		onLoad(option) {
			this.payStatus = option.payStatus || '';
			this.type = option.type * 1 || 0;
			uni.$on('refreshOrder', () => {
				this.getOrderList(1);
			})
		},
		data() {
			return {
				dateRange: [],
				pageNo: 1,
				openid: uni.getStorageSync('openid'),
				data: [],
				payStatusList: [{
						name: '全部',
						value: ''
					},
					{
						name: '待付款',
						value: "NOTPAY"
					},
					{
						name: '支付成功',
						value: 'SUCCESS'
					},
					{
						name: '已退款',
						value: "REFUNDED"
					},
					{
						name: '已拒绝',
						value: "REFUSE"
					},
					{
						name: '到店付款',
						value: "到店付款"
					},
				],
				payStatus: '',
				type: 0,
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
			onClick(e) {
				uni.navigateTo({
					url: `/packageA/pages/order/OrderDetail?id=${e.orderId}`
				});
			},
			getOrderList(pageNo) {
				let pageNum = pageNo || this.pageNo;
				if (this.dateRange.length === 0 || this.dateRange.length === 2) {
					api.orderList({
						pageNum,
						pageSize: 10,
						openid: this.openid,
						beginTime: this.dateRange[0] || '',
						endTime: this.dateRange[1] || '',
						payStatus: this.payStatus,
					}).then((res = {}) => {
						if (res.rows && res.rows.length >= 0) {
							let tmpImg = '';
							let tmpList = [];
							res.rows.forEach(o => {
								tmpList.push({
									payText: o.payStatus === 'SUCCESS' ? '支付成功' : o.payStatus ===
										'NOTPAY' ? "等待付款" : o.payStatus === 'REFUNDED' ? '退款完成' : o
										.payStatus === 'CLOSED' ? '订单关闭' : o.payStatus ===
										'REFUSE' ? '已拒绝' : o.payStatus,
									payType: o.payStatus === 'SUCCESS' ? 'primary' : o
										.payStatus === 'NOTPAY' ? "success" : o.payStatus ===
										'REFUNDED' ? 'error' : o.payStatus === 'CLOSED' ? 'info' :
										o.payStatus === 'REFUSE' ? 'error' : 'primary',
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
			changeDate(e) {
				this.dateRange = e;
				this.$nextTick(() => {
					this.getOrderList(1);
				});
			},
			changePayType(e) {
				this.payStatus = this.payStatusList[e].value;
				this.type = e;
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
		width: 90%;
		height: 250rpx;
		display: flex;
		flex-direction: column;
		border-radius: 8px;
	}

	.car_band {
		width: 200rpx;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
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
		border-left: 1px dashed black;
	}

	.address_box {
		display: flex;
		width: 100%;
		flex-direction: column;
	}

	.return_address_box {
		display: flex;
		width: 90%;
		flex-direction: column;
	}

	.car {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		position: relative;
	}

	.car_type {
		font-size: 16px;
		font-family: 'Microsoft YaHei';
		font-weight: bold;
		color: #333333;
	}

	.car_address {
		font-size: 10px;
		font-family: 'Microsoft YaHei';
		font-weight: 400;
		color: #999999;
		width: 480rpx;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.car_price {
		position: absolute;
		top: 10%;
		right: 5%;
		font-family: 'Microsoft YaHei';
		font-weight: 400;
		line-height: 10px;
		color: #FF4343;
		display: flex;
		flex-direction: row;
		
	}

	.symbol {
		font-size: 8px;
	}

	.unit {
		font-size: 8px;
		color: #333333;
	}
</style>
