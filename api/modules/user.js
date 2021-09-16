import request from '../../common/request.js'

const user = {
	login:(data)=>{
		return request.globalRequest('/tool/wxlogin', 'get', data);
	},
}


export default user