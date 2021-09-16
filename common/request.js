import {
	convertSerialize
} from './utils.js'
import _ from 'lodash';
import config from './config.js';
const request = {}
const headers = {}

request.globalRequest = (url, method, data) => {
	let header = {}

	//接口公共参数
	const obj = {
		complanyIds: uni.getStorageSync('complanyIds'),
	}
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

	return uni.request(JSONParams).then(res => {
		console.log('response:', res.length > 1 ? JSON.parse(res[1].data) : JSON.parse(res));
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
		// #ifdef MP-WEIXIN
		wx.showToast({
			title: params.msg || '',
			icon: 'none',
			duration: 2000,
		});
		// #endif
	})
}

export default request