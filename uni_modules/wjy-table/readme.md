####如有不懂，请参考当前目录下的 <span style="color:red;">uni_modules/wjy-table/index.vue</span> 示例文件。
wjy-table 配置
=======================

属性 | 说明 | 类型 | 默认值 | 可选值
--- | --- | --- | --- | ---
columns | 表格列的配置(配置在下方) | array | [] | *
data | 表格数据 | array | [] | *
emptyText | 没有数据的提示信息 | string | 暂无数据 | *
border | 表格的边框 | Boolean | * | *
height | 表格的高度(带单位) | string | 100px | *
hearder-background | 表格头部背景颜色 | string | #c7dff3 | *
selection | 表格第一列选择框 | string | '' | '' 或 left(如果指定为left则会固定到最左面)
selection-option | 表格列的配置(配置在下方) | object | * | *

columns 配置
-----------------------

属性 | 说明 | 类型 | 默认值
--- | --- | --- | ---
label | 表头的文字 | * | *
dataIndex | 列数据在数据项中对应的 key | * | *
width | 列宽度(带单位) | string | 60px
sort | 排序 | boolean | false
fixed | 列是否固定(left, right) | string | ''
scopedSlots | 可以通过该属性配置支持 slot-scope 的属性，使用 columns 时，{ customRender: '键名' }模板 #键名={ ... } | object | 

selection-option 配置
-----------------------

属性 | 说明 | 类型 | 默认值
--- | --- | --- | ---
back | 默认勾选的key数组 | array | []
key | 指定需要勾选的 key | string | value

Event 配置
-----------------------

属性 | 说明 | 类型 | 默认值 | 参数
--- | --- | --- | ---
@rowChange | 每行中的选择框事件 | EventHandle | * | ([row]: 每行的数据, rowList: '所有选中的数组集合')
@headerChange | 表头选择框事件 | EventHandle | * | rowList: '所有选中的数组集合'
