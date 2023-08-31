<template>
	<view class="release-wrapper" :style="">
		<view class="form-wrapper">
			<uni-forms ref="form" :modelValue="rules_data" label-width='100' :rules="rules">
				<uni-forms-item required :label="formData.collateralized_repo_direction.name"
					name="collateralized_repo_direction">
					<uni-easyinput type="text" disabled v-model="rules_data.collateralized_repo_direction" />
				</uni-forms-item>
				<uni-forms-item required :label="formData.collateralized_repo_tenure.name"
					name="collateralized_repo_tenure">
					<uni-easyinput type="text" v-model="rules_data.collateralized_repo_tenure" />
				</uni-forms-item>
				<uni-forms-item required :label="formData.bonds_requirements.name" name="bonds_requirements">
					<uni-easyinput type="text" v-model="rules_data.bonds_requirements" />
				</uni-forms-item>

				<!-- 出借头寸:lending_position -->
				<uni-forms-item required :label="formData.lending_position.name" name="lending_position">
					<uni-easyinput type="text" v-model="rules_data.lending_position" />
				</uni-forms-item>

				<uni-forms-item required :label="formData.pledge_rate.name" name="pledge_rate">
					<uni-easyinput type="text" v-model="rules_data.pledge_rate" placeholder="请输入 0%-100%" />
				</uni-forms-item>
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
	getRa,
	postRa,
} from '@/api/bond.js';
import {
	toLogin
} from "@/libs/login.js";
import {
	mapGetters
} from 'vuex';

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
				bonds_requirements: {
					rules: [{
						required: true,
						errorMessage: '请输入',
					}

					]
				},
				lending_position: {
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
				bonds_requirements: {
					rules: [{
						required: true,
						errorMessage: '请输入',
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
	computed: {
		...mapGetters({
			isLogin: 'isLogin'
		})
	},
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
		console.log('3444', option)
		console.log(this.id, 'idiid')
	},
	methods: {
		getDetail() {
			let params = {
				id: this.id
			}
			getRa(params).then(res => {
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

			//验证成功后执行
			if (!this.isLogin) {
				toLogin();
			} else {
				this.$refs.form.validate().then(res => {
					postRa(this.rules_data).then(res => {
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


.release-wrapper {
	width: 100%;
	height: 100%;
	background-color: #f5f5f5;
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
