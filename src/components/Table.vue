<template>
  <Table :columns="columns" :data-source="data" bordered size="middle" sticky :scroll="{ x: 1000, y: 1000 }"
    @resizeColumn="handleResizeColumn">
  </Table>
</template>
<script lang="ts" setup>
import type { TableColumnType, TableColumnsType } from 'ant-design-vue';
import { Table } from 'ant-design-vue'

defineProps<{
  columns: TableColumnsType
  data: any[]
}>()

const handleResizeColumn = (width: number, col: TableColumnType) => {
  col.width = width;
}
</script>

