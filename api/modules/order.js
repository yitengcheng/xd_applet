import request from '../../common/request.js'

const order = {
	orderInfo: (id) => {
		return request.globalRequest(`/tool/wxorder/${id}`, 'get');
	},
	orderList: (data) => {
		return request.globalRequest(`/tool/api/wxorder/list`, 'get', data);
	}
}


export default order