import request from '../../common/request.js'

const car = {
	carList:(data)=>{
		return request.globalRequest('/system/car/api/waitcar', 'get', data);
	},
}


export default car