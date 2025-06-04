export const createApi = () => {
  const http = createHttp()
  http.use(initRequest)
  return http
}

export default createApi()
