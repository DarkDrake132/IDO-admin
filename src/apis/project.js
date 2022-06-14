import { AxiosBasic } from "../services/apiService"
import * as urls from "./urls"

const getTotalPoolInfo = ({days}) => {
    return AxiosBasic({
        url: urls.GET_TOTAL_POOL_INFO,
        method: "POST",
        data: { days }
    })
}

const poolAPI = {
  getTotalPoolInfo,
}

export default poolAPI
