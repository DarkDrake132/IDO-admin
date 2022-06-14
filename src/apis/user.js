import { AxiosBasic } from "../services/apiService"
import * as urls from "./urls"

const filterKYC = ({ data, email, address }) => {
    return AxiosBasic({
        url: urls.FILTER_KYC,
        method: "POST",
        data: { data, email, address },
    })
}

const userAPI = {
    filterKYC,
}

export default userAPI
