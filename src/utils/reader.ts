import type { WorkSheet } from 'xlsx'
import { read, utils } from 'xlsx'
/**
 * 创建文件读取器，并以promise的方式返回
 * @param file
 * @returns Promise
 */
export function createFileReader(file: File): Promise<ProgressEvent<FileReader>> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsBinaryString(file)
    reader.onload = function (event) {
      resolve(event)
    }
    reader.onerror = function (error) {
      reject(error)
    }
  })
}

/**
 * 以文本的方式读取（csv文件）
 * @param file
 * @param encoding 可选，加密方式
 * @returns Promise
 */
export function createFileTextReader(
  file: File,
  encoding = 'GBK',
): Promise<ProgressEvent<FileReader>> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsText(file, encoding)
    reader.onload = function (event) {
      resolve(event)
    }
    reader.onerror = function (error) {
      reject(error)
    }
  })
}

// 利用 sheet_to_json 方法将 excel 转成 json 数据
export function getSheetData<T = any>(sheet: WorkSheet) {
  const title = Object.keys(sheet).reduce((prev, curr) => {
    if (!curr.includes('1')) return prev
    prev.push(sheet[curr].v)
    return prev
  }, [] as string[])
  return {
    title,
    data: utils.sheet_to_json<T>(sheet)
  }
}

export function readExcel<T = any>(
  buffer: string | ArrayBuffer | null,
  opt?: Partial<{ index: number | 'all'; name: string }>,
) {
  const { index = 0, name } = opt || {}
  const workbook = read(buffer, { type: 'binary' })
  const sheetKeys = Object.keys(workbook.Sheets)
  if (name) {
    const targetSheetName = sheetKeys.find((sheetName) => sheetName === name)
    return targetSheetName ? getSheetData<T>(workbook.Sheets[targetSheetName]) : {
      title: [] as string[],
      data: [] as T[]
    }
  }
  if (index !== 'all') return getSheetData<T>(workbook.Sheets[sheetKeys[index]])
  let title: string[] = []
  let data: T[] = [] // 存储获取到的数据
  // 遍历每张工作表进行读取（这里默认只读取第一张表
  for (let sheetIndex = 0; sheetIndex < sheetKeys.length; sheetIndex++) {
    const sheetName = sheetKeys[sheetIndex]
    const result = getSheetData<T>(workbook.Sheets[sheetName])
    title = title.concat(result.title)
    data = data.concat(result.data)
  }
  return {
    title,
    data
  }
}

/**
 * 通过url读取为一个文件
 * @returns File 文件
 */
export function readUrlAsFile(url: string) {
  return new Promise<File>((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open('GET', url, true)
    xhr.responseType = 'blob'
    xhr.onload = function () {
      if (xhr.status === 200) {
        const splitList = url.split('/')
        const file = new File([xhr.response], splitList[splitList.length - 1])
        resolve(file)
      } else {
        reject(xhr.response)
      }
    }
    xhr.onerror = function (error) {
      reject(error)
    }
    xhr.send()
  })
}
