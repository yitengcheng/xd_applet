import request from '../../common/request.js'

const car = {
	getPayInfo:(data)=>{
		return request.globalRequest('/tool/pays/wx/createMiniOrder', 'post', data);
	},
}


export default car