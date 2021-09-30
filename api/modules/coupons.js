import request from '../../common/request.js'

const coupons = {
	couponsList:(data)=>{
		return request.globalRequest('/system/coupon/api/selfpage/list', 'get', data);
	},
	coupons:(data)=>{
		return request.globalRequest('/system/coupon/api/self/list', 'get', data);
	},
}


export default coupons