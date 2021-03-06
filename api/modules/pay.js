import request from '../../common/request.js'

const pay = {
	getPayInfo:(data)=>{
		return request.globalRequest('/tool/pays/wx/createMiniOrder', 'post', data);
	},
	pay: (data) => {
		return request.globalRequest('/tool/pays/mini/pay', 'post', data);
	},
	refund: (data) => {
		return request.globalRequest('/tool/pays/mini/refund', 'post', data);
	}
}


export default pay