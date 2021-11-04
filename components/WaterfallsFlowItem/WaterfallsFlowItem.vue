<template>
    <view class="wf-item-page">
        <image :src="item.image" mode="widthFix" class="item-img"/>
        <view class="item-info">
            <image v-show="item.avatar" :src="item.avatar" mode="aspectFill" class="info-avatar"/>
            <view class="info-nickname">{{ item.nickName }}</view>
        </view>
		<view class="item-info" v-if="item.price">
			<view class="info-price"><span class="info-price-symbol">￥</span>{{ item.price }}<span class="info-price-unit">/天</span></view>
		</view>
		<view class="item-info">
            <view class="info-text">{{ item.info }}</view>
        </view>
		
    </view>
</template>

<script>
export default {
    props: {
        item: {
            type: Object,
            require: true
        }
    },
}
</script>

<style lang="scss" scoped>
.wf-item-page {
    background: #fff;
    overflow: hidden;
    border-radius: 5px;
}

.item-img {
    width: 100%;
}

.item-info {
    display: flex;
    align-items: center;
    padding: 5px;
}

.info-avatar {
    width: 25px;
    height: 25px;
    border-radius: 50%;
    margin-right: 5px;
}

.info-nickname {
    font-size: 12px;
    color: #333;
}
.info-text {
	font-size: 8px;
	font-family: 'Microsoft YaHei';
	font-weight: 400;
	line-height: 10px;
	color: #666666;
}
.info-price {
	color: #FF4343;
	font-size: 18px;
}
.info-price-symbol {
	font-size: 8px;
}
.info-price-unit {
	font-size: 8px;
	color: #333333;
}
</style>
