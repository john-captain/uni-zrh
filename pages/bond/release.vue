@@ -0,0 +1,91 @@
<template>
	<view class="release-wrapper" :style="{height:pageHeight}">
		<view class="content-div">
			<view class="btn" @click="jumpRra">发布正回购</view>
			<view class="btn" @click="jumpBtn">发布逆回购</view>
			<view class="btn" @click="jumpBid">发布bid</view>
			<view class="btn" @click="jumpOfr">发布ofr</view>
		</view>
		<!-- <view class="my-card" v-if="isLogin">
			<view class="title">
				我的名片
			</view>
			<view class="" @click="uploadpic" style="width: 100%;height: 200rpx;background-color: #fac;">
				<image :src="visiting_card" mode="widthFix"></image>
			</view>
		</view> -->
		<tabBar v-if="!is_diy" :pagePath="'/pages/bond/release'"></tabBar>
		<pageFooter v-else></pageFooter>
	</view>
</template>

<script>
	let sysHeight = uni.getSystemInfoSync().statusBarHeight + 'px';
	import tabBar from "@/pages/index/visualization/components/tabBar.vue";
	import pageFooter from '@/components/pageFooter/index.vue'
	import {
		toLogin
	} from "@/libs/login.js";
	import {
		getCardInfo,
	} from '@/api/bond.js';
	import {
		mapGetters
	} from 'vuex';
	// #ifdef H5
	import Auth from '@/libs/wechat';
	// #endif
	const app = getApp();
	export default {
		components: {
			tabBar,
			pageFooter
		},
		computed: {
			...mapGetters({
				isLogin: 'isLogin'
			})
		},
		data() {
			return {
				sysHeight: sysHeight,
				// #ifdef H5 || MP
				pageHeight: '100%',
				routineContact: 0,
				// #endif
				// #ifdef APP-PLUS
				pageHeight: app.globalData.windowHeight,
				// #endif
				// #ifdef H5
				isWeixin: Auth.isWeixin(),
				//#endif
				is_diy: uni.getStorageSync('is_diy'),
				visiting_card: '',
			}
		},
		onLoad(option) {
			uni.hideTabBar()
			let that = this
			// #ifdef APP-PLUS
			that.$set(that, 'pageHeight', app.globalData.windowHeight);
			// #endif
			that.getInfo()
		},
		methods: {
			// 上传图片
			uploadpic: function() {
				let that = this;
				that.$util.uploadImageOne('upload/image', (res) => {
					this.visiting_card = res.data.url
					this.upCard()
				});

			},
			upCard() {
				let params = {
					visiting_card: this.visiting_card
				}
				upCardInfo(params).then(res => {
					console.log(res)
				})
			},
			getInfo() {
				// 如果不登陆就不请求也不跳转登录
				if (!this.isLogin) {
					return
				} else {
					getCardInfo().then(res => {
						console.log(res, '个人信息')
						this.visiting_card = res.data.visiting_card
					})
				}

			},
			jumpBtn() {
				if (!this.isLogin) {
					toLogin();
				} else {
					uni.navigateTo({
						url: '/pages/release/ra'
					})
				}

			},
			jumpRra() {
				if (!this.isLogin) {
					toLogin();
				} else {
					uni.navigateTo({
						url: '/pages/release/rra'
					})
				}
			},
			jumpBid() {
				if (!this.isLogin) {
					toLogin();
				} else {
					uni.navigateTo({
						url: '/pages/release/bid'
					})
				}
			},
			jumpOfr() {
				if (!this.isLogin) {
					toLogin();
				} else {
					uni.navigateTo({
						url: '/pages/release/ofr'
					})
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	page,
	body {
		height: 100%;
	}

	.content-div {
		padding: 60rpx 40rpx;
		display: flex;
		display: -webkit-flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;

		.btn {
			width: 45%;
			height: 80rpx;
			line-height: 80rpx;
			text-align: center;
			background: #7388b0;
			color: #fff;
			font-size: 32rpx;
			margin-bottom: 30rpx;
			border-radius: 10rpx;
		}
	}

	.my-card {
		padding: 0 32rpx;

		.title {
			font-size: 32rpx;
			margin-bottom: 32rpx;
		}

		image {
			width: 100%;
		}
	}
</style>
