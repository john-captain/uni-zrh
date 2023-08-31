<template>
	<view
	:class="[
		'wjy-table',
		systemInfo.uniPlatform === 'web' ? 'web' : 'noweb'
	]"
	ref="wjyTable"
	:style="[
		{ border: attrs.border || attrs.border.trim() === '' ? '1px solid #e8e8e8' : '' },
		{ height: attrs.height ? attrs.height.trim() : '100px' },
	]"
	>
		<view
		class="wjy-table-scroll">
			<!-- 表头 -->
			<view 
			:style="[
				{ width: hearderWidth ? (hearderWidth + 'px') : '100%' },
			]"
			class="wjy-table-row-header">
				<view 
				:style="[
					{ textAlign: val.align },
					{ background: attrs['hearder-background'] ? attrs['hearder-background'] : '#c7dff3' },
					{ width: val.width ? val.width : '100%' },
					{ flexBasis: val.width ? val.width : '' },
					{ flexShrink: val.width && val.width !== '100%' ? 0 : '' },
					{ position: val.fixed === 'left' || val.fixed === 'right' ? 'sticky' : 'unset' },
					{ left: val.fixed === 'left' ? val.left + 'px' : '' },
					{ right: val.fixed === 'right' ? val.right + 'px' : '' },
					{ zIndex: val.fixed === 'left' || val.fixed === 'right' ? 999 : 99 },
					{ display: 'flex' },
					{ alignItems: 'center' },
				]"
				class="wjy-table-row-header-th" 
				v-for="(val, idx) in computedColumns" 
				:key="idx">
					<view 
					:style="[
						{ width: '100%' },
						{ position: 'relative' },
						{ display: 'flex' },
						{ justifyContent: val.align },
						{ alignItems: 'center' },
					]"
					class="wjy-table-row-header-th-data-wrap" 
					>
						<view class="" style="margin-right: 3px;">
							<!-- 头部选择框 -->
							<checkbox v-if="val['wjy-selection']" @click="headerSelectionHandler" :checked="headerStatus" class="wjy-checkbox-header" style="transform:scale(0.7);box-sizing: border-box;padding: 5px;"/>
							<text class="wjy-table-row-header-th-data" style="position: relative;">
								{{ val.label }}
							</text>
						</view>
						<!-- 排序按钮 -->
						<view class="sort-wrap" v-if="val.sort">
							<view class="up" :style="{ color: sortIndex.type === 'up' && sortIndex.dataIndex === val.dataIndex ? '#409eff' : '#6d6b6b' }" @click="sort('up', val)">▲</view>
							<view class="down" :style="{ color: sortIndex.type === 'down' && sortIndex.dataIndex === val.dataIndex ? '#409eff' : '#6d6b6b' }" @click="sort('down', val)">▼</view>
						</view>
					</view>
				</view>
			</view>
			
			<!-- 数据部分 -->
			<view
			:class="[
				'wjy-table-row',
				'row-' + index,
			]" 
			:style="[
				{ width: hearderWidth ? (hearderWidth + 'px') : '100%' }
			]"
			v-for="(item, index) in cp.data" 
			:key="index">
			
				<view 
				:style="[
					{ width: value.width ? value.width : '100%' },
					{ flexBasis: value.width ? value.width : '' },
					{ flexShrink: value.width && value.width !== '100%' ? 0 : '' },
					{ position: value.fixed === 'left' || value.fixed === 'right' ? 'sticky' : 'unset' },
					{ left: value.fixed === 'left' ? value.left + 'px' : '' },
					{ right: value.fixed === 'right' ? value.right + 'px' : '' },
					{ zIndex: value.fixed === 'left' || value.fixed === 'right' ? 999 : 99 },
					{ display: 'flex' },
					{ alignItems: 'center' },
				]"
				:class="
					'wjy-table-th',
					'th-' + key
				" 
				v-for="(value, key) in computedColumns" 
				:key="key">
					<view 
					:style="[
						{ textAlign: value.align },
					]"
					class="wjy-table-data"> 
					<checkbox v-if="key === 0" @click="dataSelectHandler(item, index)" value="cb" :checked="item['wjy-checked']" class="wjy-checkbox-header" style="transform:scale(0.7);box-sizing: border-box;padding: 5px;"/>
					<view class="data">{{ item[value.dataIndex] }}</view> 
					 <!-- 插槽 返回数据 -->
					<slot v-if="value.scopedSlots" :index="index" :scoped="computedScoped(item)" :name="value.scopedSlots.customRender"></slot>
					</view>
				</view>
			</view>
		</view>
		<!-- 没数据 -->
		<text class="wjy-nodata" v-if="!cp.data || cp.data.length === 0">{{ attrs.emptyText ? attrs.emptyText : '暂无数据' }}</text>
	</view>
</template> 

<script setup>
import { ref, reactive, useAttrs, computed, onMounted, watch } from 'vue'
let attrs = useAttrs()
setTimeout(() => {
	console.log(attrs, 888);
}, 4000)

// 多选配置项工厂  回显  key等
const optionHandler = () => {
	if(attrs['selection-option']) {
		attrs.data.forEach(item => {
			if(attrs['selection-option'].back.includes(item[attrs['selection-option'].key] ? item[attrs['selection-option'].key] : item.value)) {
				item['wjy-checked'] = true
			} else {
				item['wjy-checked'] = false
			}
		})
	}
}

// 设置多选的工厂
!function() {
  if(attrs.selection.trim() === '' || attrs.selection === true || attrs.selection.trim() === 'left') {
  	let obj = {
  		align: 'center',	
  		fixed: '',
  		'wjy-selection': true // 是否展示多选
  	}
  	if(attrs.selection.trim() === 'left') {
  		obj.fixed = 'left'
  	} else {
  		delete obj.fixed
  	}
  	!attrs.columns.find(item => item['wjy-selection']) && attrs.columns.unshift(obj)
	optionHandler()
  }
}();

let cp = reactive(JSON.parse(JSON.stringify(attrs)))

let fixedLeftWidth = 0 // fixed为left的left距离
let fixedrightWidth = 0 // fixed为right的right距离
let hearderWidth = ref(0) // 表格的宽度
let columns = reactive([])
const computedColumns = computed(() => {
	// 将左侧定位  没有定位  右侧定位的数据分离，按顺序重新组成一个数组
	let find_left = cp.columns.filter(item => item.fixed === 'left')
	let find_nohas_left_and_right = cp.columns.filter(item => item.fixed !== 'left' && item.fixed !== 'right')
	let find_right = cp.columns.filter(item => item.fixed === 'right').reverse()
	// 组装
	cp.columns = find_left.concat(find_nohas_left_and_right).concat(find_right)
	// 最终返回的数据 也需要组装
	let has_left = []
	let nohas_left_and_right = []
	let has_right = []
	
	cp.columns.forEach((item, index) => {
		item.width = (item.width != undefined && parseInt(item.width)) <= 60 ? '60px' : item.width
		if(item.fixed === 'left' && item.fixed !== 'right') {
			item.left = fixedLeftWidth
			fixedLeftWidth += parseInt(item.width)
			has_left.push(item)
		} else if (item.fixed === 'right' && item.fixed !== 'left') {
			item.right = fixedrightWidth
			fixedrightWidth += parseInt(item.width)
			has_right.unshift(item)
		} else {
			nohas_left_and_right.push(item)
		}
	})
	
	columns = has_left.concat(nohas_left_and_right).concat(has_right)
	return columns
})

const computedScoped = (scoped) => {
	let cpScoped = JSON.parse(JSON.stringify(scoped))
	delete cpScoped['wjy-checked']
	return cpScoped
}

let sortIndex = reactive({
	type: '',
	dataIndex: ''
})

// 排序的方法
const sort = (type, data) => {
	if(sortIndex.type === type) {
		sortIndex.type = ''
		sortIndex.dataIndex = ''
	} else {
		sortIndex.type = type
		sortIndex.dataIndex = data.dataIndex
	}
	
	if(sortIndex.type === 'up') {
		cp.data = cp.data.sort((a, b) => {
			return a[data.dataIndex] - b[data.dataIndex]
		})
	} else if(sortIndex.type === 'down') {
		cp.data = cp.data.sort((a, b) => {
			return b[data.dataIndex] - a[data.dataIndex]
		})
	} else {
		cp.data = JSON.parse(JSON.stringify(attrs.data))
	}
}

// 设置宽度
const setHeaderWidth = () => {
	uni.createSelectorQuery()
	.selectAll('.wjy-table-row-header-th')
	.boundingClientRect((rect) => {
		rect.forEach(item => {
			hearderWidth.value += item.width
		})
	})
	.exec();
}

const systemInfo = uni.getSystemInfoSync();
onMounted(() => {
	setHeaderWidth()
	uni.onWindowResize(() => {
		if(systemInfo.uniPlatform === 'web') {
			location.reload()
		}
	});
})

const emit = defineEmits(['rowChange', 'headerChange']) // 表头多选 和 行多选事件

// 头部是否选择的状态
let headerStatus = ref(Object.keys(cp).includes('selection-option') ? !cp.data.some(item => {
	return item['wjy-checked'] == false
}) : false)

// 头部多选框点击事件
const headerSelectionHandler = () => {
	headerStatus.value = !headerStatus.value
	let allRows = []
	if(headerStatus.value) {
		allRows = []
		cp.data.forEach(item => {
			item['wjy-checked'] = true
			let cpItem = JSON.parse(JSON.stringify(item))
			delete cpItem['wjy-checked']
			allRows.push(cpItem)
		})
	} else {
		allRows = []
		cp.data.forEach(item => {
			item['wjy-checked'] = false
		})
	}
	emit('headerChange', allRows)
}

const dataSelectHandler = (row, index) => {
	cp.data[index]['wjy-checked'] = !cp.data[index]['wjy-checked']
	headerStatus.value = !cp.data.some(item => {
		return item['wjy-checked'] == false
	})
	
	// 返回每行的数据 第一个参数
	let toRows = []
	if(cp.data[index]['wjy-checked']) {
		let cpRow = JSON.parse(JSON.stringify(row))
		delete cpRow['wjy-checked']
		toRows.push(cpRow)
	} else {
		toRows = []
	}
	
	// 返回所有的数据 第二个参数
	let allRows = []
	cp.data.forEach(item => {
		if(item['wjy-checked']) {
			let cpItem = JSON.parse(JSON.stringify(item))
			delete cpItem['wjy-checked']
			allRows.push(cpItem)
		}
	})
	
	emit('rowChange', toRows, allRows)
}

// 监测数据变化
watch(() => attrs.data, newV_data => {
	cp.data = newV_data
}, { deep: true })

</script>


<style scoped lang="scss">
@import './style.scss';
</style>