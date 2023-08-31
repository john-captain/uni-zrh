<template>
	<view class="focus-box">
		
		<view class="tabContent" v-show="true">
		
		
			<view v-for="(item, index) in tableList" :key="index">
		
				<view class="paramBox" v-if="index == 0">
					<view class="param-title">{{item.name}}</view>
					<view class="param-item">
						<label>用户ID：</label>
						<text>xxxx债劵</text>
					</view>
					<view class="param-item">
						<label>简称：</label>
						<text>23宏利01</text>
					</view>
					<view class="param-item">
						<label>债劵代码：</label>
						<text>251271.SH</text>
					</view>
				</view>
				
				<view class="paramBox" v-else-if="index == 1">
					<view class="param-title">{{item.name}}</view>
					<view class="param-item">
						<label>交易方向：</label>
						<text>ofr</text>
					</view>
					<view class="param-item">
						<label>交易模式：</label>
						<text>zj</text>
					</view>
					<view class="param-item">
						<label>交易价格：</label>
						<text>zj15</text>
					</view>
				</view>
				
				<view class="paramBox" v-else-if="index == 2">
					<view class="param-title">{{item.name}}</view>
					<view class="param-item">
						<label>交易时间：</label>
						<text>预计8月3日</text>
					</view>
					<view class="param-item">
						<label>交易张数：</label>
						<text>10000张</text>
					</view>
					<view class="param-item">
						<label>交易净价：</label>
						<text>100</text>
					</view>
				</view>
				
				<view class="paramBox" v-else>
					<view class="param-title">{{item.name}}</view>
					<view class="param-item">
						<label>是否一口价：</label>
						<text>是</text>
					</view>
					<view class="param-item">
						<label>是否有返费：</label>
						<text>否</text>
					</view>
					<view class="param-item">
						<label>返费要求：</label>
						<text>返0.1，可协商</text>
					</view>
				</view>
				
				
		
		
			</view>
		
		
		
		
		
		
			<view style="height: 10rpx;"></view>
		</view>
		
		
		
		
		
		
		
		<!-- #ifdef MP -->
		<!-- <authorize :isAuto="isAuto" :isShowAuth="isShowAuth" @authColse="authColse"></authorize> -->
		<!-- #endif -->
		<!-- <view class="uni-p-b-96"></view> -->
		<!-- <pageFooter :countNum="cartCount"></pageFooter> -->
		<tabBar v-if="!is_diy" :pagePath="'/pages/order_addcart/order_addcart'"></tabBar>
		<pageFooter v-else></pageFooter>
	</view>
	
	
</template>

<script>
	// #ifdef APP-PLUS
	let sysHeight = uni.getSystemInfoSync().statusBarHeight + 'px';
	// #endif
	// #ifndef APP-PLUS
	let sysHeight = 0
	// #endif
	import {
		getCartList,
		getCartCounts,
		changeCartNum,
		cartDel,
		getResetCart
	} from '@/api/order.js';
	import {
		getProductHot,
		collectAll,
		getProductDetail
	} from '@/api/store.js';
	import {
		toLogin
	} from '@/libs/login.js';
	import tabBar from "@/pages/index/visualization/components/tabBar.vue"
	import {
		mapGetters
	} from "vuex";
	import recommend from '@/components/recommend';
	import productWindow from '@/components/productWindow';
	// #ifdef MP
	import authorize from '@/components/Authorize';
	// #endif
	import pageFooter from '@/components/pageFooter/index.vue'
	import colors from "@/mixins/color";
	import {
		HTTP_REQUEST_URL
	} from '@/config/app';
	import tableData from './tableData.js'
	export default {
		components: {
			pageFooter,
			recommend,
			productWindow,
			tabBar,
			// #ifdef MP
			authorize
			// #endif
		},
		mixins: [colors],
		data() {
			return {
				imgHost: HTTP_REQUEST_URL,
				is_diy: uni.getStorageSync('is_diy'),
				canShow: false,
				cartCount: 0,
				goodsHidden: true,
				footerswitch: true,
				hostProduct: [],
				cartList: {
					valid: [],
					invalid: []
				},
				isAllSelect: false, //全选
				selectValue: [], //选中的数据
				selectCountPrice: 0.00,
				isAuto: false, //没有授权的不会自动授权
				isShowAuth: false, //是否隐藏授权
				hotScroll: false,
				hotPage: 1,
				hotLimit: 10,
				loading: false,
				loadend: false,
				loadTitle: this.$t(`我也是有底线的`), //提示语
				page: 1,
				limit: 20,
				loadingInvalid: false,
				loadendInvalid: false,
				loadTitleInvalid: this.$t(`加载更多`), //提示语
				pageInvalid: 1,
				limitInvalid: 20,
				attr: {
					cartAttr: false,
					productAttr: [],
					productSelect: {}
				},
				productValue: [], //系统属性
				storeInfo: {},
				attrValue: '', //已选属性
				attrTxt: this.$t(`请选择`), //属性页面提示
				cartId: 0,
				product_id: 0,
				sysHeight: sysHeight,
				newData: {},
				activeRouter: '',
				is_diy_set: false,
				adding: false,
				tableList: [1, 2, 3, 4],
			};
		},
		computed: mapGetters(['isLogin']),
		onLoad(options) {
			uni.hideTabBar()
			let that = this;
			let routes = getCurrentPages(); // 获取当前打开过的页面路由数组
			let curRoute = routes[routes.length - 1].route //获取当前页面路由
			this.activeRouter = '/' + curRoute
			this.selectedIndexs = []
			this.getData(1)
		},
		onShow() {
			if (!this.isLogin) toLogin();
			this.canShow = false
		},
		methods: {
			// 授权关闭
			authColse: function(e) {
				this.isShowAuth = e;
			},
			
			
			
			
			
			goRouter(item) {
				var pages = getCurrentPages();
				var page = (pages[pages.length - 1]).$page.fullPath;
				if (item.link == page) return
				uni.switchTab({
					url: item.link,
					fail(err) {
						uni.redirectTo({
							url: item.link
						})
					}
				})
			},
			manage: function() {
				let that = this;
				that.footerswitch = !that.footerswitch;
				let arr1 = [];
				let arr2 = [];
				let newValid = that.cartList.valid.map(item => {
					if (that.footerswitch) {
						if (item.attrStatus) {
							if (item.checked) {
								arr1.push(item.id);
							}
						} else {
							item.checked = false;
							arr2.push(item);
						}
					} else {
						if (item.checked) {
							arr1.push(item.id);
						}
					}
					return item;
				});
				that.cartList.valid = newValid;
				if (that.footerswitch) {
					that.isAllSelect = newValid.length === arr1.length + arr2.length;
				} else {
					that.isAllSelect = newValid.length === arr1.length;
				}
				that.selectValue = arr1;
				that.switchSelect();
			},
			unsetCart: function() {
				let that = this,
					ids = [];
				for (let i = 0, len = that.cartList.invalid.length; i < len; i++) {
					ids.push(that.cartList.invalid[i].id);
				}
				cartDel(ids).then(res => {
					that.$util.Tips({
						title: that.$t(`清除成功`)
					});
					that.$set(that.cartList, 'invalid', []);
					that.getCartNum();
				}).catch(res => {

				});
			}
		},
		onReachBottom() {
			let that = this;
			if (that.loadend) {
				that.getInvalidList();
			}
			if (that.cartList.valid.length == 0 && that.cartList.invalid.length == 0) {
				that.getHostProduct();
			}
		}
		
	}
</script>

<style scoped lang="scss">
  .tabContent {
  	background: #fff;
  	overflow: hidden;
  }
  
  .param-title {
  	background: #f5f5f5;
  	height: 40rpx;
  	line-height: 80rpx;
  	margin: 20rpx 30rpx 0;
  	font-size: 28rpx;
  	text-indent: 30rpx;
  }
  
  .param-item {
  	height: 80rpx;
  	line-height: 80rpx;
  	font-size: 24rpx;
  	border-bottom: 1rpx solid #f5f5f5;
  	margin: 0 30rpx;
  	border-left: 1rpx solid #f5f5f5;
  	border-right: 1rpx solid #f5f5f5;
  	padding: 0 30rpx;
  	display: flex;
  }
  
  .param-item label {
  	width: 260rpx;
  	color: #999;
  }
  
  .uni-group {
  	display: flex;
  	align-items: center;
  }
  .focus-box {
    padding: 20rpx 0 0 0;
    background: #f7f8f9;
    height: calc(100vh - 70rpx);
    box-sizing: border-box;
	
	.box-black {
		width: 100%;
		height: 200rpx;
		background-color: #fff;
	}
   }
   
   
   
	.shoppingCart {
		/* #ifdef H5 */
		// padding-bottom: 0;
		// padding-bottom: constant(safe-area-inset-bottom);  
		// padding-bottom: env(safe-area-inset-bottom);
		/* #endif */
	}

	.shoppingCart .labelNav {
		height: 76rpx;
		padding: 0 30rpx;
		font-size: 22rpx;
		color: #8c8c8c;
		position: fixed;
		left: 0;
		width: 100%;
		box-sizing: border-box;
		background-color: #f5f5f5;
		z-index: 5;
		top: 0;
	}

	.shoppingCart .labelNav .item .iconfont {
		font-size: 25rpx;
		margin-right: 10rpx;
	}

	.shoppingCart .nav {
		width: 100%;
		height: 80rpx;
		background-color: #fff;
		padding: 0 30rpx;
		box-sizing: border-box;
		font-size: 28rpx;
		color: #282828;
		position: fixed;
		left: 0;
		z-index: 5;
		top: 76rpx;
	}

	.shoppingCart .nav .num {
		margin-left: 12rpx;
	}

	.shoppingCart .nav .administrate {
		font-size: 26rpx;
		color: #282828;
		width: 110rpx;
		height: 46rpx;
		border-radius: 6rpx;
		border: 1px solid #a4a4a4;
	}

	.shoppingCart .noCart {
		margin-top: 171rpx;
		background-color: #fff;
		padding-top: 0.1rpx;
	}

	.shoppingCart .noCart .pictrue {
		width: 414rpx;
		height: 336rpx;
		margin: 78rpx auto 56rpx auto;
	}

	.shoppingCart .noCart .pictrue image {
		width: 100%;
		height: 100%;
	}

	.shoppingCart .list {
		margin-top: 171rpx;
	}

	.shoppingCart .list .item {
		padding: 25rpx 30rpx;
		background-color: #fff;
		margin-bottom: 15rpx;
	}

	.shoppingCart .list .item .picTxt {
		width: 627rpx;
		position: relative;
	}

	.shoppingCart .list .item .picTxt .pictrue {
		width: 160rpx;
		height: 160rpx;
	}

	.shoppingCart .list .item .picTxt .pictrue image {
		width: 100%;
		height: 100%;
		border-radius: 6rpx;
	}

	.shoppingCart .list .item .picTxt .text {
		width: 444rpx;
		font-size: 28rpx;
		color: #282828;
	}

	.shoppingCart .list .item .picTxt .text .reColor {
		color: #999;
	}

	.shoppingCart .list .item .picTxt .text .reElection {
		margin-top: 20rpx;
	}

	.shoppingCart .list .item .picTxt .text .reElection .title {
		font-size: 24rpx;
	}

	.shoppingCart .list .item .picTxt .text .reElection .reBnt {
		// width: 120rpx;
		padding: 0 10rpx;
		// height: 46rpx;
		margin-top: 6rpx;
		border-radius: 23rpx;
		font-size: 26rpx;
	}

	.shoppingCart .list .item .picTxt .text .infor {
		font-size: 24rpx;
		color: #868686;
		margin-top: 16rpx;
	}

	.shoppingCart .list .item .picTxt .text .money {
		font-size: 32rpx;
		color: var(--view-theme);
		margin-top: 28rpx;
	}

	.shoppingCart .list .item .picTxt .carnum {
		height: 47rpx;
		position: absolute;
		bottom: 0rpx;
		right: 0;
	}

	.shoppingCart .list .item .picTxt .carnum view {
		border: 1rpx solid #a4a4a4;
		width: 66rpx;
		text-align: center;
		height: 100%;
		line-height: 40rpx;
		font-size: 28rpx;
		color: #a4a4a4;
	}

	.shoppingCart .list .item .picTxt .carnum .reduce {
		border-right: 0;
		border-radius: 3rpx 0 0 3rpx;
	}

	.shoppingCart .list .item .picTxt .carnum .reduce.on {
		border-color: #e3e3e3;
		color: #dedede;
	}

	.shoppingCart .list .item .picTxt .carnum .plus {
		border-left: 0;
		border-radius: 0 3rpx 3rpx 0;
	}

	.shoppingCart .list .item .picTxt .carnum .plus.on {
		border-color: #e3e3e3;
		color: #dedede;
	}

	.shoppingCart .list .item .picTxt .carnum .num {
		color: #282828;
	}

	.shoppingCart .invalidGoods {
		background-color: #fff;
	}

	.shoppingCart .invalidGoods .goodsNav {
		width: 100%;
		height: 66rpx;
		padding: 0 30rpx;
		box-sizing: border-box;
		font-size: 28rpx;
		color: #282828;
	}

	.shoppingCart .invalidGoods .goodsNav .iconfont {
		color: #424242;
		font-size: 28rpx;
		margin-right: 17rpx;
	}

	.shoppingCart .invalidGoods .goodsNav .del {
		font-size: 26rpx;
		color: #999;
	}

	.shoppingCart .invalidGoods .goodsNav .del .icon-shanchu1 {
		color: #999;
		font-size: 33rpx;
		vertical-align: -2rpx;
		margin-right: 8rpx;
	}

	.shoppingCart .invalidGoods .goodsList .item {
		padding: 20rpx 30rpx;
		border-top: 1rpx solid #f5f5f5;
	}

	.shoppingCart .invalidGoods .goodsList .item .invalid {
		font-size: 22rpx;
		color: #fff;
		width: 70rpx;
		height: 36rpx;
		background-color: #aaa;
		border-radius: 3rpx;
		text-align: center;
		line-height: 36rpx;
	}

	.shoppingCart .invalidGoods .goodsList .item .pictrue {
		width: 140rpx;
		height: 140rpx;
	}

	.shoppingCart .invalidGoods .goodsList .item .pictrue image {
		width: 100%;
		height: 100%;
		border-radius: 6rpx;
	}

	.shoppingCart .invalidGoods .goodsList .item .text {
		width: 433rpx;
		font-size: 28rpx;
		color: #999;
		height: 140rpx;
	}

	.shoppingCart .invalidGoods .goodsList .item .text .name {
		width: 100%;
	}

	.shoppingCart .invalidGoods .goodsList .item .text .infor {
		font-size: 24rpx;
	}

	.shoppingCart .invalidGoods .goodsList .item .text .end {
		font-size: 26rpx;
		color: #bbb;
	}

	.shoppingCart .footer {
		z-index: 999;
		width: 100%;
		height: 96rpx;
		background-color: rgba(255, 255, 255, 0.85);
		backdrop-filter: blur(10px);
		position: fixed;
		padding: 0 30rpx;
		box-sizing: border-box;
		border-top: 1rpx solid #eee;
		bottom: 98rpx;
		bottom: calc(98rpx + constant(safe-area-inset-bottom)); ///兼容 IOS<11.2/
		bottom: calc(98rpx + env(safe-area-inset-bottom)); ///兼容 IOS>11.2/
	}

	.shoppingCart .footer.on {
		// #ifndef H5
		bottom: 0rpx;
		// #endif
	}

	.shoppingCart .footer .checkAll {
		font-size: 28rpx;
		color: #282828;
		margin-left: 16rpx;
	}

	// .shoppingCart .footer checkbox .wx-checkbox-input{background-color:#fafafa;}
	.shoppingCart .footer .money {
		font-size: 30rpx;
	}

	.shoppingCart .footer .placeOrder {
		color: #fff;
		font-size: 30rpx;
		width: 226rpx;
		height: 70rpx;
		border-radius: 50rpx;
		text-align: center;
		line-height: 70rpx;
		margin-left: 22rpx;
	}

	.shoppingCart .footer .button .bnt {
		font-size: 28rpx;
		color: #999;
		border-radius: 50rpx;
		border: 1px solid #999;
		width: 160rpx;
		height: 60rpx;
		text-align: center;
		line-height: 60rpx;
	}

	.shoppingCart .footer .button form~form {
		margin-left: 17rpx;
	}

	.uni-p-b-96 {
		height: 96rpx;
	}

	.uni-p-b-98 {
		height: 100rpx;
		/* 兼容 IOS<11.2 */
		height: calc(100rpx + constant(safe-area-inset-bottom));
		/* 兼容 IOS>11.2 */
		height: calc(100rpx + env(safe-area-inset-bottom));
	}

	.emptyBox {
		text-align: center;
		padding: 80rpx 0;

		.tips {
			color: #aaa;
			font-size: 26rpx;
		}

		image {
			width: 414rpx;
			height: 304rpx;
		}
	}
</style>
