import { reactive } from 'vue'

/** 定义列表数据 */
export function useList<Q = null, R = object>(otherQuery: Partial<Q>) {
  const list = reactive<List<Q, R>>({
    items: [],
    query: {
      pageNum: 1,
      pageSize: 20,
      ...(otherQuery as Q)
    },
    total: 0,
    pageCount: 0,
    loading: false,
    haveMore: true
  })

  return list
}

/** 初始化列表 */
export function useInitList<Q, R>(list: List<Q, R>, isPart = false) {
  if (!isPart) list.items = []
  list.total = 0
  if (list.query) list.query.pageNum = 1
  list.pageCount = 0
  list.loading = false
  list.haveMore = true

  return list
}

/** 请求前处理 */
export function useBeforeList<Q, R>(list: List<Q, R>) {
  if (list.loading || !list.haveMore) {
    if (!list.haveMore) {
      useShowToast({ title: '没有更多数据了' })
    }
    return Promise.reject()
  }
  list.loading = true

  return Promise.resolve()
}

/** 请求后处理 */
export function useAfterList<Q, R>(list: List<Q, R>, res: any, target = 'items') {
  if (res.data === null) res.data = []
  list.total = typeof res.total === 'number' ? res.total : res[target].length || 0
  const newArr = res[target] || res || []
  list.items = list.query.pageNum === 1 ? newArr : list.items.concat(newArr)
  list.pageCount = list.query && list.query.pageSize ? (list.total === 0 ? 0 : Math.ceil(list.total / list.query.pageSize)) : 0
  list.loading = false
  if (list.total === 0) {
    list.haveMore = false
  } else {
    if (list.query && list.query.pageNum) {
      if (list.query.pageNum >= list.pageCount) list.haveMore = false
      else list.query.pageNum++
    } else list.haveMore = false
  }

  return list
}
