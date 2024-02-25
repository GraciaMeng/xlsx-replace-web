<template>
  <Form layout="inline" :model="state" v-bind="$attrs">
    <FormItem label="选择变量替换">
      <Input class="input" :value="composeState.variable" placeholder="输入所需替换的变量（英文逗号分隔）"
        @update:value="(val) => updateState('variable', val)" />
    </FormItem>
    <FormItem label="被替换的列">
      <Select :value="state.replaceColumn" placeholder="选择被替换列" class="select" @update:value="(val) => updateState('replaceColumn', val)">
        <SelectOption v-for="(item, index) in columns" :key="index" :value="item">{{ item }}</SelectOption>
      </Select>
    </FormItem>
    <FormItem label="额外需要包括变量的符号">
      <Input class="input" :value="composeState.symbol" placeholder="输入额外需要包括变量的符号"
        @update:value="(val) => updateState('symbol', val)" />
    </FormItem>
  </Form>
</template>


<script setup lang="ts">
import { useVModel } from '@/hooks/useVModel';
import { VariableState } from '@/types/index';
import { Form, FormItem, Input, SelectOption, Select } from 'ant-design-vue';

const props = defineProps<{
  state: VariableState,
  columns: string[]
}>()
const emits = defineEmits<{
  (e: 'update:state', state: VariableState): void
}>()
const composeState = useVModel(props, 'state', emits)

const updateState = (key: keyof VariableState, value: any) => {
  const newState = { ...composeState.value, [key]: value }
  composeState.value = newState
}
</script>

<style scoped>
.input {
  width: 300px;
}
.select {
  width: 300px !important;
}
</style>
