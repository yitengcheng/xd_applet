import request from '../../common/request.js'

const company = {
	companyList:(data)=>{
		return request.globalRequest('/system/complany/api/list', 'get', data);
	},
	rotation:(data)=>{
		return request.globalRequest(`/system/complany/api/rotation/${data}`, 'get' );
	},
	companyCarType: (data)=>{
		return request.globalRequest(`/system/car/api/car/type/${data}`, 'get');
	}
	
}


export default company