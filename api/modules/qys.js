import request from '../../common/request.js'

const qys = {
	getTicket: (data) => {
		return request.globalRequest('/qys/mini/token', 'post', data);
	},
}


export default qys