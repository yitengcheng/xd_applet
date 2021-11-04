import request from '../../common/request.js'

const collection = {
	collectionList:(data)=>{
		return request.globalRequest(`/system/customer/api/complany`, 'post', data);
	}
}


export default collection