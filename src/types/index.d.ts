declare interface ResponseData<T> {
  code: number
  data: T
  msg: string
  serverTime: number
  success: boolean
  version: string
}
type ResponsePromise<T> = Promise<ResponseData<T>>

interface AxiosError {
  /** 错误码 */
  code: number
  /** 错误原因 */
  msg: string
}

declare type IUniPage = Page.PageInstance<AnyObject, object>

declare type Key = string | number

/** 列表请求参数基础数据 */
declare interface ListBaseQuery {
  /** 当前页码 */
  pageNum?: number
  /** 分页大小 */
  pageSize?: number
}

/** 列表基础数据 */
interface ResponseList<T> {
  /** 数据列表 */
  records: T[]
  /** 数据总量 */
  total: number
}

interface List<Q = null, R = object> {
  /** 数据列表 */
  items: R[]
  /** 请求参数 */
  query: Q & ListBaseQuery
  /** 数据总量 */
  total: number
  /** 是否加载中 */
  loading: boolean
  /** 总页数 */
  pageCount: number
  /** 是否还有数据未加载 */
  haveMore: boolean
  /** 是否有数据 */
  haveAny: boolean
  /** comp-list组件使用 - 是否显示提示语 */
  showText: boolean
  /** comp-list组件使用 - 是否显示重新加载数据提示 */
  reGet: boolean
}

interface Tabs {
  /** 页面名称 */
  name: string
  /** 页面路径 */
  pagePath: string
}

type Words =
  | 'a'
  | 'b'
  | 'c'
  | 'd'
  | 'e'
  | 'f'
  | 'g'
  | 'h'
  | 'i'
  | 'j'
  | 'k'
  | 'l'
  | 'm'
  | 'n'
  | 'o'
  | 'p'
  | 'q'
  | 'r'
  | 's'
  | 't'
  | 'u'
  | 'v'
  | 'w'
  | 'x'
  | 'y'
  | 'z'

/** 限定首字母大写 */
type Cap = `${Capitalize<Words>}${string}`

declare type AsyncPromiseFunction<T> = (...args: unknown[]) => Promise<T>
declare type AsyncVoidFunction = (...args: unknown[]) => void
