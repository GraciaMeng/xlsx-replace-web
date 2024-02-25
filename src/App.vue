<template>
  <ConfigProvider :locale="zhCN">
    <StyleProvider hash-priority="high">
      <div class="flex items-center mb-2">
        <Upload v-model:file-list="fileList" />
        <Button class="ml-2" type="primary" @click="resolveXlsx">解析xlsx</Button>
        <Button class="ml-2" type="primary" @click="replaceText">替换文本</Button>
        <Button class="ml-2" type="primary" @click="copyResult">复制结果</Button>
        <Button class="ml-2" danger @click="revertData">恢复</Button>
      </div>
      <div class="mb-2">
        <VariableSelectForm v-model:state="state" :columns="columns" />
      </div>
      <Table :data="excelData" :columns="tableColumns" />
    </StyleProvider>
  </ConfigProvider>
</template>

<script setup lang="ts">
import zhCN from 'ant-design-vue/es/locale/zh_CN';
import { ConfigProvider, Button, TableColumnsType, message, StyleProvider } from 'ant-design-vue';
import Upload from './components/Upload.vue';
import VariableSelectForm from './components/VariableSelectForm.vue';
import Table from './components/Table.vue'
import { ref } from 'vue';
import { UploadFileList } from './types';
import { createFileReader, readExcel } from '@/utils/reader';
import { VariableState } from './types/index';
const fileList = ref<UploadFileList>([])

const state = ref<VariableState>({
  variable: '',
  replaceColumn: undefined,
  symbol: ''
})
const columns = ref<string[]>([])
const tableColumns = ref<TableColumnsType>([])
const excelData = ref<Record<string, string>[]>([])
let sourceData = [] as Record<string, string>[]

const resolveXlsx = async () => {
  if (!fileList.value.length) {
    return message.error('未上传excel文件')
  }
  const res = await createFileReader(fileList.value[0].originFileObj!)
  const result = readExcel(res.target!.result, { index: 0 })
  columns.value = result.title
  excelData.value = result.data
  tableColumns.value = result.title.map((item, index) => ({
    key: item,
    title: `${item}($${index + 1})`,
    dataIndex: item,
    resizable: true,
    width: 200
  }))
  sourceData = result.data
  message.success('解析成功')
}

const validateState = () => {
  if (!state.value.variable) {
    message.error('请填写变量')
    return false
  }
  if (!state.value.replaceColumn) {
    message.error('请填写替换列')
    return false
  }
  return true
}
const replaceText = () => {
  if (!validateState()) return
  const { variable, replaceColumn, symbol } = state.value
  const variableList = variable.split(',')
  excelData.value = excelData.value.map(item => ({
    ...item,
    [replaceColumn!]: variableList.reduce((prev, curr) => {
      const columnKey = columns.value[Number(curr.replace('$', '')) - 1]
      return prev.replace(curr, `${symbol}${item[columnKey]}${symbol}`)
    }, item[replaceColumn!])
  }))
}

const revertData = () => {
  excelData.value = sourceData
}

const copyResult = () => {
  if (!validateState()) return
  const text = excelData.value.map(item => item[state.value.replaceColumn!]).join('\n')
  navigator.clipboard.writeText(text).then(() => {
    message.success('复制成功')
  })
}
</script>

<style scoped></style>
