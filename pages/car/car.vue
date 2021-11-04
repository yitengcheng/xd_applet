<template>
	<scroll-view class="bg_color">
		<u-sticky>
			<view class="search">
				<uni-easyinput  v-model="keyword" placeholder="请输入关键字搜索" suffixIcon="search" @iconClick="search" input-align="center"></uni-easyinput>
				<u-tabs :list="carTypeList" :is-scroll="true" name="text" :current="type" @change="changeCarType" active-color="#fdd51e"></u-tabs>
			</view>
		</u-sticky>
		<WaterfallsFlow :wfList='list' @itemTap="itemTap" class="water_fall"/>
	</scroll-view>
</template>

<script>
	import WaterfallsFlow from '../../components/WaterfallsFlow/WaterfallsFlow.vue';
	import api from '../../api/index.js';
	import config from '../../common/config.js';
	export default {
		components: {
			WaterfallsFlow,
		},
		onLoad(option) {
			this.dictInit('car_type');
			uni.$on('refreshCar', ()=>{
				this.getCarList(1, true);
			})
		},
		mounted() {
			this.getCarList(1, true);
		},
		onReachBottom() {
			// 模拟触底刷新
			this.getCarList(this.pageNo);
		},
		onPullDownRefresh() {
			this.getCarList(1);
		},
		data() {
			return {
				list: [],
				keyword: '',
				pageNo: 1,
				type: 0,
				carTypeList: [],
				carType: '',
			}
		},
		methods: {
			itemTap(e) {
				uni.navigateTo({
					url: `/packageA/pages/car/CarDetail?id=${e.id}`,
				})
			},
			search() {
				this.getCarList(1);
			},
			getCarList(pageNo, init = false) {
				let pageNum = pageNo || this.pageNo;
				let type = this.carType === -1 ? '' : this.carType;
				api.carList({
					pageNum,
					pageSize: 10,
					keyword: this.keyword,
					type,
				}).then((res ={}) => {
					if(res.rows){
						let tmpList = [];
						res.rows.forEach(o => {
							let carPhotos = o.carPhotos.split(',');
							tmpList.push({
								nickName: o.carBrand,
								info: (o.complany || {}).complanyName || '未知',
								image: carPhotos.length >= 1 ? `${config.IMG_URL}${carPhotos[0]}` :
									'/static/img/car_defalut.png',
								type: o.type,
								price: o.unitPrice,
								id: o.id,
							});
						});
						pageNum === 1 ? this.list = tmpList : this.list = this._.concat(this.list, tmpList);
						pageNum === 1 ? this.pageNo = 2 : this.pageNo = this.pageNo + 1;
						if (init) {
							api.companyCarType(uni.getStorageSync('complanyId')).then((res = {})=> {
								if((res.data || []).length > 0){
									this.carTypeList.push({text: '全部', value: -1});
									res.data.forEach(o => {
										this.carTypeList.push({text: o, value: o});
									});
								} else {
									this.carTypeList = this._.concat([{
										text: '全部',
										value: -1
									}], uni.getStorageSync('car_type'));
								}
							})
						}
					}
					uni.stopPullDownRefresh();
				});
			},
			changeCarType(e) {
				this.carType = this.carTypeList[e].value;
				this.type = e;
				this.$nextTick(()=>{
					this.getCarList(1);
				});
			},
		}
	}
</script>

<style lang="scss">
	.search {
		background-color: #FFFFFF;
	}
</style>
