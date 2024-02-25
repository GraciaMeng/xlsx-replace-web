<template>
	<Upload v-model:file-list="composeFileList" v-bind="uploadProps">
		<Button>
			<upload-outlined></upload-outlined>
			Click to Upload
		</Button>
	</Upload>
</template>

<script setup lang="ts">
import { Upload, Button, UploadProps, message } from 'ant-design-vue';
import { UploadOutlined } from '@ant-design/icons-vue';
import { useVModel } from '@/hooks/useVModel';
import {  } from 'module';
import { UploadFileList } from '@/types';
interface Props {
	fileList: UploadFileList,
}
const props = defineProps<Props>()
const emits = defineEmits<{
	(e: 'update:fileList', fileList: UploadFileList): void
}>()
const composeFileList = useVModel(props, 'fileList', emits)
const uploadProps: UploadProps = {
	name: 'file',
	maxCount: 1,
	showUploadList: false,
	beforeUpload(file) {
		composeFileList.value = [file]
		message.success('上传成功')
		return false
	},
	onRemove(file) {
		const index = composeFileList.value.indexOf(file);
		const newFileList = composeFileList.value.slice();
		newFileList.splice(index, 1);
		composeFileList.value = newFileList;
	}
};
</script>

<style scoped></style>
