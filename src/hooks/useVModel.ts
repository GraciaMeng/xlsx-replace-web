import type { WritableComputedRef } from 'vue'
import { computed } from 'vue'

/**
 * 子组件v-model的封装
 * @param props 组件的props
 * @param key 组件props的参数
 * @param emits 组件的emits方法
 * @returns 返回一个computed
 * 例子：const modalShow = useVModel(props, 'show', emits)
 */
export function useVModel<P extends object, K extends keyof P, Name extends string>(
  props: P,
  key: K,
  emits: (name: Name, ...args: any[]) => void,
  options: {
    transform?: (value: P[K]) => P[K]
  } = {},
): WritableComputedRef<P[K]> {
  const { transform } = options
  return computed({
    get() {
      if (transform) {
        return transform(props[key])
      }
      return props[key]
    },
    set(value) {
      emits(`update:${key!.toString()}` as Name, value)
    },
  })
}
