<template>
	<view>
		<view class="content">
			<view class="list" v-for="(item,index) in  detail_list" :key='item.key'>
				<view class="list_item" v-for="(ite,ind) in item" :key="index">
					{{ite.name}}:{{ite.value}}
				</view>
			</view>
		</view>

		<view class="service">
			<button open-type="contact">联系客服</button>
		</view>

	</view>
</template>

<script>
	import {
		getDetail
	} from '@/api/api.js';
	export default {
		data() {
			return {
				type: '',
				id: '',
				detail_list: []
			}
		},
		onLoad(option) {
			this.type = option.type;
			this.id = option.id;
			this.getdetail()
		},
		onShareAppMessage: function(res) {
			return {
				title: this.type,
				path: `/pages/bond/detail?id=${this.id}&type=${this.type}`
			}
		},
		methods: {
			getdetail() {
				let params = {
					type: this.type,
					id: this.id
				}
				getDetail(
					params
				).then(res => {
					console.log('detail', res);
					this.detail_list = res.data
					const result1 = this.detail_list.reduce((acc, curr, index) => {
						if (index % 3 === 0) acc.push([])
						acc[Math.floor(index / 3)].push(curr)
						return acc
					}, [])
					this.detail_list = result1
				})
			}
		},

	}
</script>

<style lang="scss">
	page {
		background-color: #f5f5f5;
	}

	.content {
		padding-bottom: 160rpx;
	}

	.list {
		background-color: #fff;
		padding: 50rpx;
		margin-top: 32rpx;
	}

	.list_item {
		height: 60rpx;
		line-height: 60rpx;
	}

	.service {
		margin-top: 32rpx;
		width: 100%;
		position: fixed;
		bottom: 30rpx;

		button {
			background-color: #4571c5;
			width: 350rpx;
			color: #fff;
			padding: 16rpx;
			margin: auto;
		}
	}
</style>
