import { hasOwn } from './util'

// TODO
// componentOptions 来区分 vnode 与 其他
export function isVNode (node) {
  return (
    node !== null &&
    typeof node === 'object' &&
    hasOwn(node, 'componentOptions')
  )
}
