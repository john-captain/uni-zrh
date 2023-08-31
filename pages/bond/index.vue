<template>
	<view class="focus-box">
		<!-- 搜索栏 -->
		<view class="focus-seach">
			<image class="home-seach" src="/static/images/home-seach.png" />
			<input placeholder="债劵" v-model="searchVal" type="text" @input="GetValue" @focus="ShowValue" />
			<text class="search-title" @click="navToSearch">搜索</text>
		</view>
		<view class="InputList" show="isValue && SearchList.length">
			<view v-for="(item,index) in SearchList" :key="index" @click.stop="SetValue(item)" class="listSon">
				{{item}}
			</view>
		</view>
		<view class="mask" v-if="isValue" @click="blur">
		</view>
		<view class="nav acea-row row-around">
			<view v-for="(item, index) in resData" :key="item.type" class="item"
				:class="orderStatus == item.type ? 'onItem' : ''" @click="statusClick(item.type, index)">
				<view>{{item.title}}</view>
			</view>
		</view>
		<view class="uni-container">
			<uni-table :loading="false" ref="tableData" border stripe emptyText="暂无更多数据">
				<uni-tr class="trStyle">
					<uni-th width="100" align="center" v-for="childItem in resData[currentIndex].children"
						:key="childItem">{{childItem}}</uni-th>
				</uni-tr>
				<uni-tr v-for="(item, index) in tableData" :key="index" @row-click="rowclick(item)">
					<uni-td>{{ item.name }}</uni-td>
					<uni-td>{{ item.name2 }}</uni-td>
					<uni-td align="center">{{ item.name3 }}</uni-td>
					<uni-td align="center">{{ item.name4 }}
					</uni-td>
				</uni-tr>
			</uni-table>
			<!-- 	<view class="uni-pagination-box">
				<uni-pagination show-icon :page-size="pageSize" :current="pageCurrent" :total="total"
					@change="change" />
			</view> -->
		</view>
		<pageFooter></pageFooter>
	</view>
</template>

<script>
	import pageFooter from '@/components/pageFooter/index.vue'

	import {
		getHomeNavTitle,
		getHomeBondList,
		getSearchList
	} from '@/api/api.js';
	export default {
		components: {
			pageFooter,
		},
		data() {
			return {
				tableData: [],
				// 每页数据量
				pageSize: 50,
				// 当前页
				pageCurrent: 1,
				// 数据总量
				total: 0,
				loading: false,
				orderStatus: 'ofr', // 状态
				searchVal: '', // 搜索框里面的内容
				resData: [],
				currentIndex: 0, // 点击
				page: 1,
				isValue: false,
				SearchList: []

			}
		},
		onLoad(options) {
			uni.hideTabBar()
			let that = this;
			that.selectedIndexs = []
			that.getInitData()
			that.getBondDataList("ra")
		},
		mounted() {

		},
		created() {

		},
		onReachBottom: function() {

			this.page++;
			this.getBondDataList()
		},
		onShareAppMessage: function(res) {
			return {
				title: '中融汇',
				path: `/pages/bond/index`
			}
		},
		methods: {
			// 输入框失去焦点
			blur(e) {
				this.isValue = false
				this.SearchList = []
			},
			SetValue(e) {
				console.log(1)
				this.page = 1
				this.searchVal = e
				this.isValue = false
				this.SearchList = []
				this.tableData = []
				this.getBondDataList()
			},
			// 搜索提示
			ShowValue() {
				this.isValue = true
				let params = {
					type: this.orderStatus,
					keyword: this.searchVal
				}
				getSearchList(params).then(res => {
					this.SearchList = res.data
				})
			},

			GetValue() {
				let params = {
					type: this.orderStatus,
					keyword: this.searchVal
				}
				getSearchList(params).then(res => {
					this.SearchList = res.data
				})
			},
			// 详情
			rowclick(item) {
				uni.navigateTo({
					url: `/pages/bond/detail?id=${item.id}&type=${this.orderStatus
					}`
				})
			},
			// 点击搜索
			navToSearch() {
				this.getBondSearchData()
			},
			// 获取搜索数据
			getBondSearchData() {
				let params = {
					type: this.orderStatus,
					keyword: this.searchVal
				}
				this.tableData = []
				this.page = 1
				getHomeBondList(params).then(res => {
					this.tableData = res.data

				})
			},

			// tab栏点击事件
			statusClick(value, index) {
				this.orderStatus = value
				this.currentIndex = index
				this.searchVal = ''
				this.page = 1;
				this.tableData = []
				this.getBondDataList(value)
			},


			// 分页触发
			change(e) {
				this.$refs.table.clearSelection()
				this.selectedIndexs.length = 0
				this.getData(e.current)
			},

			// 初始化数据
			getInitData() {
				console.log('tmm1');
				getHomeNavTitle().then(res => {
					this.resData = res.data
				})
			},
			// 获取列表数据
			getBondDataList() {
				let params = {
					page: this.page,
					limit: '10',
					type: this.orderStatus,
					keyword: this.searchVal
				}

				getHomeBondList(params).then(res => {
					if (res.data.length == 0) {
						uni.showToast({
							title: '没有更多数据了',
							icon: 'none'
						})
					} else {
						this.tableData = this.tableData.concat(res.data)
					}

				})
			},

		}
	}
</script>

<style lang="scss">
	.mask {
		position: fixed;
		top: 0;
		bottom: 0;
		right: 0;
		left: 0;
		z-index: 100;
	}

	.InputList {
		position: absolute;
		width: 690rpx;
		height: auto;
		top: 108rpx;
		border-radius: 5rpx;
		padding: 10rpx;
		z-index: 999;
		background-color: #fff;

		.listSon {
			height: 50rpx;
			line-height: 50rpx;
			font-size: 32rpx;
			text-indent: 1em;
		}

		.listSon:nth-of-type(even) {
			background: #f7f7f7;
		}
	}


	.uni-group {
		display: flex;
		align-items: center;
	}

	.uni-container {
		padding-bottom: 100rpx;
	}

	.focus-box {
		padding: 20rpx 0 0 0;
		background: #f7f8f9;
		height: calc(100vh - 70rpx);
		box-sizing: border-box;
	}

	.nav {
		background-color: #fff;
		width: 690rpx;
		height: 180rpx;
		border-radius: 6rpx;
		margin: -73rpx auto 0 auto;
	}

	.nav .item {
		margin-top: 98rpx;
		text-align: center;
		font-size: 26rpx;
		color: #282828;
		width: 3rem;
		padding: 27rpx 0;
		border-bottom: 5rpx solid transparent;
	}

	.nav .item.on {
		/* #ifdef H5 || MP */
		font-weight: bold;
		/* #endif */
		/* #ifdef APP-PLUS */
		color: green;
		/* #endif */
		border-color: var(--view-theme);
	}

	.focus-box {
		background-color: #fff;

		.onItem {
			color: #4571c5;
		}

		/deep/.uni-table-th {
			background-color: #7388b0;
			color: #fff;
		}

		.focus-seach {
			position: relative;
			// margin: 20rpx 24rpx 0;
			left: 24rpx;
			width: 702rpx;
			height: 88rpx;
			background: #f7f8f9;
			border-radius: 25rpx;
			border: 2rpx solid #f7f8f9;
			overflow-y: scroll;

			.home-seach {
				position: absolute;
				top: 30rpx;
				left: 32rpx;
				width: 40rpx;
				height: 40rpx;
			}

			input {
				position: absolute;
				top: 26rpx;
				left: 92rpx;
				width: 490rpx;
			}

			.search-title {
				position: absolute;
				top: 0;
				right: 0;
				font-size: 35rpx;
				font-family: PingFangSC-Semibold, PingFang SC;
				font-weight: 600;
				color: #fff;
				width: 160rpx;
				height: 70rpx;
				background: #7388b0;
				border-radius: 25rpx;
				text-align: center;
				line-height: 70rpx;
			}
		}
	}
</style>
