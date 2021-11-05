import {
	convertSerialize
} from './utils.js'
import _ from 'lodash';
import config from './config.js';
const request = {}
const headers = {}

request.globalRequest = (url, method, data) => {
	uni.showLoading({
		title: '加载中...',
		mask: true
	})
	let header = {}
	let complanyId = uni.getStorageSync('complanyId');
	//接口公共参数
	let obj = {};
	complanyId ? obj = {complanyId} : {};
	
	let JSONParams = {
		url: `${config.API_URL}${url}`,
		method: method,
		data: {
			...obj,
			...data
		},
		dataType: 'JSON',
		header: header,
		sslVerify: "false",
	}
	console.log('request:', JSONParams);
	return uni.request(JSONParams).then(res => {
		console.log('response:', res.length > 1 ? JSON.parse(res[1].data) : JSON.parse(res));
		uni.hideLoading();
		if (res[1]) {
			let data = JSON.parse(res[1].data);
			//TODO 根据实际后台返回格式修改
			if (data.code == 200) {
				return data;
			} else {
				throw data;
			}
		}
	}).catch(params => {
		uni.showToast({
			title: params.msg || '服务器连接失败',
			icon: 'none',
			duration: 2000,
		});
	})
}

export default request
