<template>
	<view class="">
		<view class="form-wrapper">
			<uni-forms ref="form" :modelValue="rules_data" label-width='100' :rules="rules">
				<uni-forms-item required :label="formData.collateralized_repo_direction.name"
					name="collateralized_repo_direction">
					<uni-easyinput type="text" disabled v-model="rules_data.collateralized_repo_direction" />
				</uni-forms-item>
				<!-- 协回天数 -->
				<uni-forms-item required :label="formData.collateralized_repo_tenure.name"
					name="collateralized_repo_tenure">
					<uni-easyinput type="text" v-model="rules_data.collateralized_repo_tenure" />
				</uni-forms-item>
				<!-- 质押债券 -->

				<uni-forms-item required :label="formData.bond_abbreviation.name" name="bond_abbreviation">
					<uni-easyinput type="text" v-model="rules_data.bond_abbreviation" />
				</uni-forms-item>
				<!-- 质押率 -->
				<uni-forms-item required :label="formData.pledge_rate.name" name="pledge_rate">
					<uni-easyinput type="text" v-model="rules_data.pledge_rate" placeholder="请输入 0%-100%" />
				</uni-forms-item>
				<!-- 利率 -->
				<uni-forms-item required :label="formData.interest_rate.name" name="interest_rate">
					<uni-easyinput type="text" v-model="rules_data.interest_rate" placeholder="请输入 0%-100%" />
				</uni-forms-item>
				<!-- 可否外贴 -->
				<uni-forms-item required :label="formData.allow_external_posting.name" name="allow_external_posting">
					<uni-easyinput type="text" v-model="rules_data.allow_external_posting" />
				</uni-forms-item>
				<!-- 是否返费 -->
				<uni-forms-item required :label="formData.is_rebate_applicable.name" name="is_rebate_applicable">
					<uni-easyinput type="text" v-model="rules_data.is_rebate_applicable" />
				</uni-forms-item>
				<uni-forms-item required :label="formData.remarks.name" name="remarks">
					<uni-easyinput type="text" v-model="rules_data.remarks" />
				</uni-forms-item>
				<button type="primary" style="padding: 16rpx;" @click="onSubmit">提交</button>
			</uni-forms>
		</view>
	</view>
</template>

<script>
import {
	getRra,
	postRra,
} from '@/api/bond.js';
import {
	toLogin
} from "@/libs/login.js";
import {
	mapGetters
} from 'vuex';
// 请求数据：https://console-docs.apipost.cn/preview/511c24d781dd45f0/5cf878889cd22e2e?target_id=6495260f-acd1-4851-81e9-3bbcfebc55e8

// 提交数据：https://console-docs.apipost.cn/preview/c13f0f646b0a9990/b9f9125d0ca1160f?target_id=650edb11-371f-4f5f-b5c5-4e5f6918f63c

let sysHeight = uni.getSystemInfoSync().statusBarHeight + 'px';
export default {
	components: {},
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
			id: 0,
			formData: {},
			rules_data: {},
			dyformdata: {

				collateralized_repo_direction: {
					rules: [{
						required: true,
						errorMessage: '请输入',
					}

					]
				},
				collateralized_repo_tenure: {
					rules: [{
						required: true,
						errorMessage: '请输入',
					}

					]
				},
				bond_abbreviation: {
					rules: [{
						required: true,
						errorMessage: '请输入',
					}

					]
				},
				bonds_requirements: {
					rules: [{
						required: true,
						errorMessage: '请输入',
					}

					]
				},
				pledge_rate: {
					rules: [{
						required: true,
						errorMessage: '请输入',
					},
					{
						validateFunction: function (rule, value, data, callback) {
							let precentReg = (
								/^\d+\.?\d{0,2}%$/
							); //手机号码
							if (!precentReg.test(value)) {
								callback('应输入1%-100%')
							}
						}
					}

					]
				},
				interest_rate: {
					rules: [{
						required: true,
						errorMessage: '请输入',
					},
					{
						validateFunction: function (rule, value, data, callback) {
							let precentReg = (
								/^\d+\.?\d{0,2}%$/
							);
							if (!precentReg.test(value)) {
								callback('应输入1%-100%')
							}
						}
					}

					]
				},

				allow_external_posting: {
					rules: [{
						required: true,
						errorMessage: '请输入',
					}

					]
				},
				is_rebate_applicable: {
					rules: [{
						required: true,
						errorMessage: '请输入',
					}

					]
				},
				remarks: {
					rules: [{
						required: true,
						errorMessage: '请输入',
					}

					]
				},
			}
		}
	},
	computed: mapGetters(["isLogin"]),
	watch: {
		isLogin: {
			handler: function (newV, oldV) {
				if (newV == true) {

				}
			},
			deep: true,
		},
		storeInfo: {
			handler: function () {
				this.$nextTick(() => { });
			},
			immediate: true,
		},
	},
	onReady() {
		this.$refs.form.setRules(this.dyformdata)
	},
	onLoad(option) {
		if (option.id) {
			this.id = option.id
		}
		this.getDetail()
	},
	methods: {
		// 获取正回购
		getDetail() {
			let params = {
				id: this.id
			}
			getRra(params).then(res => {
				this.formData = res.data
				let arr = []
				for (var key in res.data) {
					console.log(res.data[key], res.data[key].value)
					let obj = {}
					obj.key = key
					obj.value = res.data[key].value
					arr.push(obj)
				}
				let obj = {}
				for (var item in arr) {
					obj[arr[item].key] = arr[item].value;
				};
				this.rules_data = obj
			})
		},
		//提交正回购
		onSubmit(e) {
			// console.log("login",this.isLogin)

			//验证成功后执行
			if (!this.isLogin) {
				toLogin();
			} else {
				this.$refs.form.validate().then(res => {
					// console.log("12313",e.detail.value)
					// postRra(e.detail.value);
					postRra(this.rules_data).then(res => {
						this.$util.Tips({
							title: res.msg
						})
						setTimeout(() => {
							uni.navigateTo({
								url: '/pages/user/index'
							})
						}, 1000)

					})
				}).catch(err => {
					//验证失败后执行
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

.form-wrapper {
	padding: 32rpx 32rpx 100rpx 32rpx;
}

.form-item {
	width: 100%;
	height: 50px;
	background-color: #ffffff;
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: space-between;
	padding: 0 10px;
	box-sizing: border-box;
	margin-bottom: 2px;
}

.form-item__label {
	font-size: 16px;
	color: #333333;
	// 加粗
	font-weight: bold;

}

.form-item__value {
	font-size: 16px;
	color: #333333;
	width: 70%;
	text-align: right;
}

.btn {
	width: 100%;
}
</style>
