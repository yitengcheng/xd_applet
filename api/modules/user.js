import request from '../../common/request.js'

const user = {
	login:(data)=>{
		return request.globalRequest(`/tool/wxlogin?code=${data}`, 'post');
	},
	getInfo:(data)=>{
		return request.globalRequest('/tool/wx/getinfo', 'post', data);
	},
	updateUser:(data)=>{
		return request.globalRequest('/system/customer/api/update', 'post', data);
	},
	getUserInfo:(openid)=>{
		return request.globalRequest(`/system/customer/api/${openid}`, 'get');
	}
}


export default user