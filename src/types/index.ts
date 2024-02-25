import { UploadProps } from "ant-design-vue";

export type UploadFileList = NonNullable<UploadProps['fileList']>

export interface VariableState {
  variable: string,
  replaceColumn?: string
  symbol: string
}