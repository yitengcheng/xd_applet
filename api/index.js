import user from './modules/user.js'
import car from './modules/car.js'
import company from './modules/company.js'
import pay from './modules/pay.js'
import order from './modules/order.js'
import coupons from './modules/coupons.js'
import collection from './modules/collection.js'
import qys from './modules/qys.js'
const api = {
	...user,
	...car,
	...company,
	...pay,
	...order,
	...coupons,
	...collection,
	...qys,
}
export default api