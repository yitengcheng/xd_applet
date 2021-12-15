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
	previe: (id) => {
		return request.globalRequest(`/qys/view?contractId=${id}`, 'get');
	},
	cancelOrder: (data) => {
		return request.globalRequest(`/tool/wxorder/api/delete/${data}`, 'delete');
	}
}


export default order