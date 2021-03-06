import request from '../../common/request.js'

const car = {
	carList:(data)=>{
		return request.globalRequest('/system/car/api/waitcar', 'post', data);
	},
	carInfo: (id) => {
		return request.globalRequest(`/system/car/api/${id}`, 'get');
	},
	carSelectList: (id) => {
		return request.globalRequest(`/system/car/api/selected?complanyId=`, 'get');
	},
}


export default car