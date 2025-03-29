import Http from './http'
import initRequest from './middleware/initRequest'

class Api extends Http {
  constructor() {
    super()
    super.use(initRequest)
  }
}

const api = new Api()

export default api
