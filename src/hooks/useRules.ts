import validing from 'validing'
import { reactive } from 'vue'


interface RulesOptions {
  key: string
  type?: 'text' | 'upload' | 'checked'
  label?: string
  message?: string
  required?: boolean
  trigger?: string[]
}

function getMessage(type: RulesOptions['type']) {
  switch (type) {
    case 'text':
    default:
      return '必填'
    case 'upload':
      return '必传'
    case 'checked':
      return '必选'
  }
}

/**
 * 创建rules，非响应式
 * @param options 要插入的规则，key是字段名，type是类型，message是错误提示，required是是否必填，trigger是触发器
 * @param haveRules 后置的规则，前面有key时会追加，否则补充值，可以是对象，也可以是数组，key值是要插入的key
 * @returns element-plus的rules
 */
export function useRules(options: RulesOptions[], haveRules?: { [key: string]: any }) {
  const rules: AnyObject = {}
  options.forEach(item => {
    rules[item.key] = [
      {
        required: item.required ?? true,
        message: item.message ?? `${item.label || ''}${getMessage(item.type)}`,
        trigger: item.trigger ?? ['blur', 'change']
      }
    ]
  })
  if (haveRules) {
    for (const key in haveRules) {
      if (Reflect.has(rules, key)) {
        if (Array.isArray(haveRules[key])) rules[key] = [...rules[key], ...haveRules[key]]
        else rules[key] = [...rules[key], haveRules[key]]
      } else rules[key] = haveRules[key]
    }
  }

  return reactive(rules)
}

/** 校验数量，正整数 */
export const useValidateCount = (tip = '数量格式不正确，只能输入大于0的正整数', includeZero = false) => {
  return {
    validator: validing.rules.validateNumber({ required: false, range: includeZero ? '[0,-)' : '(0,-)', decimal: 0, tip }),
    trigger: ['blur']
  }
}
