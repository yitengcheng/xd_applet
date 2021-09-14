<template>
	<view class="tan-main-wrap">
	    <view class="tan-list-box" v-for="(item,index) in listData" :key="index">
	        <view class="tan-img-pic">
				<image :src="item.imgSrc" mode="widthFix"></image>
				</view>
	        <view class="tan-list-title"> {{item.title + index}}</view>
	    </view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				listData: [
					{title:'测试',imgSrc: 'https://dss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=1743338427,2200622767&fm=26&gp=0.jpg'},
					{title:'测试',imgSrc: 'https://dss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=2534506313,1688529724&fm=26&gp=0.jpg'},
					{title:'测试',imgSrc: 'https://dss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=1906469856,4113625838&fm=26&gp=0.jpg'},
					{title:'测试',imgSrc: 'https://dss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=1141259048,554497535&fm=26&gp=0.jpg'},
					{title:'测试',imgSrc: 'https://dss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=3892521478,1695688217&fm=26&gp=0.jpg'},
					{title:'测试',imgSrc: 'https://dss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=1089874897,1268118658&fm=26&gp=0.jpg'},
				]
			}
		},
		methods: {
			
		}
	}
</script>

<style lang="scss">
.tan-main-wrap{
    display: flex;  
    flex-flow:column wrap;
	width: 100vh;
}
.tan-list-box{
    margin: 10rpx;
    width: calc(100% / 2 - 20rpx);
    background-color: #f5f5f5;
    border-radius: 8px;
    
    overflow: hidden;
}
.tan-img-pic{
    width: 100%;
    image{
        width: 100%;
        height: 100%;
    }
}
.tan-list-title{
    margin: 20rpx;
    font-size: 30rpx;
}
</style>
