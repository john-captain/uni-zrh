<template>
	
	<view class="wrap">
		<wjy-table
		:columns="columns"
		:data="tableData"
		hearder-background
		emptyText="没有数据啦..."
		@rowChange="rowChange"
		@headerChange="headerChange"
		selection="left"
		:selection-option="option"
		border
		height="400px"
		>
		
		<template #opera="{ index, scoped }"><!-- index就是当前行数的索引， scoped则是当前行的数据 -->
		    <view class="opera" style="width: 100%;display: flex;justify-content: space-around;">
		        <button type="primary" style="width: 40px !important;height: 24px;line-height: 24px;font-size: 10px;padding: 0;" size="mini" @click="handleAdd(index)">新增</button>
		        <button type="warn" style="width: 40px !important;height: 24px;line-height: 24px;font-size: 10px;padding: 0;" size="mini" @click="handleAdd(scoped)">删除</button>
		    </view>
		</template>
		
		</wjy-table>
	</view>
	
</template>


<script setup>
import { ref, reactive } from 'vue'
import WjyTable from './components/wjy-table/wjy-table.vue'
import data from './mock'

const option = {
	back: ['1', '4'], // 回显
	key: 'date', // 针对哪个字段
}

const columns = [
	{
		label: '帅气的名字',
		dataIndex: 'name',
		width: '90px',
	},
	{
		label: '日期',
		dataIndex: 'date',
		align: 'center',
		width: '110px',
		sort: true,
	},
	{
		label: '地址',
		dataIndex: 'address',
		width: '100px'
	},
	{
		label: '食物',
		dataIndex: 'food',
		width: '100px',
	},
	{
		label: '爱好',
		dataIndex: 'hobby',
		width: '100px',
	},
	{
		label: '睡觉',
		dataIndex: 'hobby',
		width: '100px',
	},
	{
		label: '哈哈哈',
		dataIndex: 'hobby',
		width: '100px',
	},
	{
		label: '干饭吧',
		dataIndex: 'hobby',
		width: '100px',
	},
	{
		label: '没意思',
		dataIndex: 'hobby',
		width: '100px',
	},
	{
		label: '操作',
		width: '180px',
		scopedSlots: { customRender: 'opera' },
		fixed: 'right',
	},
]

const tableData = data.slice(0, 20)

const handleAdd = (data) => {
	console.log(data);
}

const rowChange = (row, list) => {
	console.log(row, list, '行选择');
}

const headerChange = (rows) => {
	console.log(rows);
}
</script>

<style>
.wrap {
	box-sizing: border-box;
	padding: 10px;
}

</style>