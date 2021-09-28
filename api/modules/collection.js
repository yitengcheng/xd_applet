import request from '../../common/request.js'

const collection = {
	collectionList:(openid)=>{
		return request.globalRequest(`/system/customer/api/complany/${openid}`, 'get');
	}
}


export default collection