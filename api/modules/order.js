import request from '../../common/request.js'

const order = {
	orderInfo: (id) => {
		return request.globalRequest(`/tool/wxorder/api/${id}`, 'get');
	},
	orderList: (data) => {
		return request.globalRequest(`/tool/wxorder/api/list`, 'get', data);
	}
}


export default order