import request from '../../common/request.js'

const company = {
	companyList:(data)=>{
		return request.globalRequest('/system/complany/api/list', 'get', data);
	},
}


export default company