<template>
	<view class="release-wrapper" :style="">

		<view class="form-wrapper">
			<uni-forms ref="form" :modelValue="rules_data" label-width='100' :rules="rules">
				<!-- 债券简称 -->
				<uni-forms-item required :label="formData.bond_abbreviation.name" name="bond_abbreviation">
					<uni-easyinput type="text" :inputBorder='false' v-model="rules_data.bond_abbreviation" />
				</uni-forms-item>
				<!-- 债券代码 -->
				<uni-forms-item required :label="formData.bond_code.name" name="bond_code">
					<uni-easyinput type="text" :inputBorder='false' v-model="rules_data.bond_code" />
				</uni-forms-item>
				<!-- 交易方向 -->
				<uni-forms-item required :label="formData.trading_direction.name" name="trading_direction">
					<uni-easyinput disabled :inputBorder='false' type="text" v-model="rules_data.trading_direction" />
				</uni-forms-item>
				<!-- 交易模式 -->
				<!--单选： zs/zj/zs+zj -->
				<uni-forms-item required :label="formData.trading_mode.name" name="trading_mode">
					<uni-data-checkbox v-model="rules_data.trading_mode" :localdata="trading_modes" />
				</uni-forms-item>
				<!-- 交易价格 -->
				<uni-forms-item required :label="formData.trading_price.name" name="trading_price">
					<uni-easyinput type="text" :inputBorder='false' v-model="rules_data.trading_price" />
				</uni-forms-item>
				<!-- 交易时间 -->
				<uni-forms-item required :label="formData.trading_time.name" name="trading_time">
					<uni-easyinput type="text" :inputBorder='false' v-model="rules_data.trading_time" />
				</uni-forms-item>
				<!-- 交易张数 -->
				<uni-forms-item required :label="formData.number_of_trades.name" name="number_of_trades">
					<uni-easyinput type="number" placeholder="单位：张" :inputBorder='false'
						v-model="rules_data.number_of_trades" />
				</uni-forms-item>
				<!-- 交易净价 -->
				<uni-forms-item required :label="formData.net_trading_price.name" name="net_trading_price">
					<uni-easyinput type="number" :inputBorder='false' v-model="rules_data.net_trading_price"
						placeholder="单位：元" />

				</uni-forms-item>
				<!-- 费用结算 -->
				<uni-forms-item v-if="rules_data.trading_mode != 'zj'" required :label="formData.fee_settlement.name"
					name="fee_settlement">
					<uni-data-checkbox v-model="rules_data.fee_settlement" :localdata="fee_settlements" />
				</uni-forms-item>
				<!-- 是否一口价 -->
				<uni-forms-item required :label="formData.is_fixed_price.name" name="is_fixed_price">
					<uni-data-checkbox v-model="rules_data.is_fixed_price" :localdata="is_fixed_price" />

				</uni-forms-item>
				<!-- 是否返费 -->
				<uni-forms-item required :label="formData.has_rebate.name" name="has_rebate">
					<uni-easyinput type="text" :inputBorder='false' v-model="rules_data.has_rebate" />
				</uni-forms-item>
				<!-- 返费要求 -->
				<uni-forms-item v-if="rules_data.trading_mode != 'zj'" required :label="formData.rebate_requirement.name"
					name="rebate_requirement">
					<uni-easyinput type="text" :inputBorder='false' v-model="rules_data.rebate_requirement" />
				</uni-forms-item>
				<!-- 开票要求 -->
				<uni-forms-item v-if="rules_data.trading_mode != 'zj'" required :label="formData.invoicing_status.name"
					name="invoicing_status">
					<uni-easyinput type="text" :inputBorder='false' v-model="rules_data.invoicing_status" />
				</uni-forms-item>

				<button type="primary" style="padding: 16rpx;" @click="onSubmit">提交</button>
			</uni-forms>
		</view>
	</view>
</template>

<script>
import {
	getOfr,
	postOfr,
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
			trading_modes: [{
				text: 'zs',
				value: 'zs'
			}, {
				text: 'zj',
				value: 'zj'
			}, {
				text: 'zs+zj',
				value: 'zs+zj'
			}],
			fee_settlements: [{
				text: '前置',
				value: '前置'
			}, {
				text: '后置',
				value: '后置'
			}],
			is_fixed_price: [{
				text: '是',
				value: '是'
			}, {
				text: '否',
				value: '否'
			}],

			formData: {},
			rules_data: {},
			dyformdata: {

				bond_abbreviation: {
					rules: [{
						required: true,
						errorMessage: '请输入',
					}

					]
				},
				bond_code: {
					rules: [{
						required: true,
						errorMessage: '请输入',
					}

					]
				},
				trading_direction: {
					rules: [{
						required: true,
						errorMessage: '请输入',
					}

					]
				},

				trading_mode: {
					rules: [{
						required: true,
						errorMessage: '请选择',
					}

					]
				},
				trading_price: {
					rules: [{
						required: true,
						errorMessage: '请输入',
					}

					]
				},
				trading_time: {
					rules: [{
						required: true,
						errorMessage: '请输入',
					}

					]
				},
				number_of_trades: {
					rules: [{
						required: true,
						errorMessage: '请输入',
					}

					]
				},
				net_trading_price: {
					rules: [{
						required: true,
						errorMessage: '请输入',
					}

					]
				},

				fee_settlement: {
					rules: [{
						required: true,
						errorMessage: '请选择',
					}

					]
				},
				is_fixed_price: {
					rules: [{
						required: true,
						errorMessage: '请输入',
					}

					]
				},
				has_rebate: {
					rules: [{
						required: true,
						errorMessage: '请输入',
					}

					]
				},
				rebate_requirement: {
					rules: [{
						required: true,
						errorMessage: '请输入',
					}

					]
				},
				// invoicing_status
				invoicing_status: {
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
		getDetail() {
			let params = {
				id: this.id
			}
			getOfr(params).then(res => {
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
			console.log(e, '999999999999999999999')

			if (!this.isLogin) {
				toLogin();
			} else {
				this.$refs.form.validate().then(res => {
					if (this.rules_data.trading_mode == 'zj') {
						this.rules_data.fee_settlement = ''
						this.rules_data.rebate_requirement = ''
						this.rules_data.invoicing_status = ''
					}
					postOfr(this.rules_data).then(res => {
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
