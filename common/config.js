let API_URL = ""
let IMG_URL = ""
let QYS = ""
//默认路径应与 manifest.json 一致，同时修改
// let DEVELOPMENT_API_URL = "https://test.qiantur.com/stage-api";
let DEVELOPMENT_API_URL = "http://192.168.2.5:8080";
// let DEVELOPMENT_API_URL = "https://xd.qiantur.com/prod-api";
let PRODUCT_API_URL = "https://xd.qiantur.com/prod-api";
// let DEFAULT_IMG_URL = 'https://test.qiantur.com/minio';
let DEFAULT_IMG_URL = 'https://xd.qiantur.com/minio';
let PRODUCT_IMG_URL = 'https://xd.qiantur.com/minio';
let DEFAULT_QYS = 'cn';
// let DEFAULT_QYS = 'com';
let PRODUCT_QYS = 'com';

if (process.env.NODE_ENV === 'development') {
	// #ifdef H5
	API_URL = DEVELOPMENT_API_URL
	IMG_URL = DEFAULT_IMG_URL
	QYS = DEFAULT_QYS
	// #endif

	// #ifdef MP-WEIXIN
	API_URL = DEVELOPMENT_API_URL
	IMG_URL = DEFAULT_IMG_URL
	QYS = DEFAULT_QYS
	// #endif

	// #ifdef APP-PLUS
	API_URL = DEVELOPMENT_API_URL
	IMG_URL = DEFAULT_IMG_URL
	QYS = DEFAULT_QYS
	// #endif

} else {
	API_URL = PRODUCT_API_URL
	IMG_URL = PRODUCT_IMG_URL
	QYS = PRODUCT_QYS
}

export default {
	API_URL,
	IMG_URL,
	QYS,
}