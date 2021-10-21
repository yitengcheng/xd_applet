import request from '../../common/request.js'

const order = {
	orderInfo: (id) => {
		return request.globalRequest(`/tool/wxorder/api/${id}`, 'get');
	},
	orderList: (data) => {
		return request.globalRequest(`/tool/wxorder/api/list`, 'get', data);
	},
	offLineOrder: (data) => {
		return request.globalRequest(`/system/wxorder/create`, 'post', data);
	},
}


export default order