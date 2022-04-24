import request from '../../common/request.js'

const exchange = {
	exchange:(data)=>{
		return request.globalRequest('/system/coupon/api/unicom', 'post', data);
	},
}


export default exchange