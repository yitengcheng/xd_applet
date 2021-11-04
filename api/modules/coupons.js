import request from '../../common/request.js'

const coupons = {
	couponsList:(data)=>{
		return request.globalRequest('/system/coupon/api/selfpage/list', 'get', data);
	},
	coupons:(data)=>{
		return request.globalRequest('/system/coupon/api/self/list', 'post', data);
	},
	addCoupon: (data)=>{
		return request.globalRequest('/system/coupon/api/receive', 'post', data);
	},
}


export default coupons