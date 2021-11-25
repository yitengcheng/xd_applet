<template>
	<view class="content" style="align-items: center; background-color: #FFFFFF;padding-bottom: 50rpx;">
		<text class="page_title">租车其实可以很简单</text>
		<view class="page_section">
			<u-image src="/packageA/static/img/text_1.png" width="131px" height="90px" style="float: left;"></u-image>
			<view class="page_section_title">租车流程</view>
			<view class="page_section_text">1、客户通过扫公司小程序二维码，在小程序查看出租车辆信息，然后选择自己要租的车辆。</view>
			<view class="page_section_text">2、客户需要填写租车认证信息，姓名、身份证号码、电话号码，实名制认证。</view>
			<view class="page_section_text">3、下单支付租车费用。</view>
			<view class="page_section_text">4、公司系统就会收到订单信息。</view>
			<view class="page_section_text">5、核查信息：人脸识别、老赖查询、违章查询、身份证验证、驾驶证验证。</view>
			<view class="page_section_text">6、信息核实通过，就在合同管理，签线上租车合同。</view>
		</view>
		<view class="page_section">
			<u-image src="/packageA/static/img/text_2.png" width="106px" height="101px" style="float:right"></u-image>
			<view class="page_section_title">租车所需证件</view>
			<view class="page_section_text">1、用车人身份证（年满18周岁，有效期一个月以上）。</view>
			<view class="page_section_text">2、用车人驾驶证（有效期大于半年）。</view>
		</view>
		<view class="page_section">
			<u-image src="/packageA/static/img/text_3.png" width="133px" height="100px" style="float:left"></u-image>
			<view class="page_section_title">多种取车服务</view>
			<view class="page_section_text">1、多种取车服务让您选择：上门送车、到点取车、接送到店等。</view>
			<view class="page_section_text">2、取车时应出具有效证件，门店人员与您一同拍照验车。</view>
			<view class="page_section_text">3、验车无误后，开始使用。</view>
		</view>
		<view class="page_section">
			<u-image src="/packageA/static/img/text_4.png" width="116px" height="100px" style="float:right"></u-image>
			<view class="page_section_title">还车流程</view>
			<view class="page_section_text">1、选择换车后门店人员上门取车。</view>
			<view class="page_section_text">2、验车、核对费用明细，多退少补。</view>
			<view class="page_section_text">3、退还租车押金，冻结违章押金，换车结束。</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {

			};
		}
	}
</script>

<style lang="scss">
	.page_title {
		color: #FF9A40;
		font-size: 20px;
		margin-top: 50rpx;
		margin-bottom: 100rpx;
	}

	.page_section {
		width: 100%;
		padding: 10px;
	}

	.page_section_groud {
		display: flex;
		flex-direction: column;
		flex: 1;
		align-items: flex-start;
		justify-content: space-around;
	}

	.page_section_title {
		font-size: 14px;
		font-family: Microsoft YaHei;
		font-weight: bold;
		color: #333333;
		line-height: 19px;
	}

	.page_section_text {
		font-size: 14px;
		font-family: Microsoft YaHei;
		font-weight: 400;
		color: #666666;
		line-height: 30px;
	}
</style>
