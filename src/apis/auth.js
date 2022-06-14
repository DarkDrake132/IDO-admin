import {AxiosBasic} from "../services/apiService";
import * as urls from './urls'

const Login = async ({username, password}) => {
  return AxiosBasic({
    url: urls.LOGIN,
    method: 'POST',
    data:{
        username,
        password,
    }
  })
}

const authAPI = {
  Login,
}

export default authAPI