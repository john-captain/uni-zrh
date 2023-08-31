// +----------------------------------------------------------------------
// | CRMEB [ CRMEB赋能开发者，助力企业发展 ]
// +----------------------------------------------------------------------
// | Copyright (c) 2016~2023 https://www.crmeb.com All rights reserved.
// +----------------------------------------------------------------------
// | Licensed CRMEB并不是自由软件，未经许可不能去掉CRMEB相关版权
// +----------------------------------------------------------------------
// | Author: CRMEB Team <admin@crmeb.com>
// +----------------------------------------------------------------------

import request from "@/utils/request.js";

/**
 * 下架
 */
export function delShow(data) {
	return request.post('v3/bond/del', data);
}
/**
 * 上架
 */
export function setShow(data) {
	return request.post('v3/bond/setShow', data);
}
/**
 * 上传名片信息
 */
export function upCardInfo(data) {
	return request.post('user/card', data);
}
/**
 * 获取名片信息
 */
export function getCardInfo(data) {
	return request.get('userinfo', {}, {
		noAuth: true
	});
}
/**
 * 获取rra表单
 * 
 */
export function getRra(params) {
	return request.get('v3/bond/releaseRra', params, {
		noAuth: true
	});
}

/**
 * 获取ra表单
 */
export function getRa(params) {
	return request.get('v3/bond/releaseRa', params, {
		noAuth: true
	});
}

/**
 * 获取bid
 */
export function getBid(params) {
	return request.get('v3/bond/releaseBid', params, {
		noAuth: true
	});
}

/**
 * 获取ofr
 */
export function getOfr(params) {
	return request.get('v3/bond/releaseOfr', params, {
		noAuth: true
	});
}

/**
 * 提交Ra表单
 */
export function postRa(data) {
	return request.post(`v3/bond/releaseRa`, data);

}

/**
 * 提交Rra表单
 */
export function postRra(data) {
	return request.post(`v3/bond/releaseRra`, data);

}

/**
 * 提交ofr
 */
export function postOfr(data) {
	return request.post(`v3/bond/releaseOfr`, data);
}

/**
 * 提交Bid
 */
export function postBid(data) {
	return request.post(`v3/bond/releaseBid`, data);
}
