import { AxiosBasic, AxiosDownload}  from "../services/apiService";
import * as urls from './urls'

const ExportWhitelistTemplate = async () => {
  const response = await AxiosDownload({
    url: urls.EXPORT_WHITELIST_EXCEL,
    method: 'GET',
    responseType: 'blob',
  });
  
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', 'whitelistTemplate.xlsx'); //or any other extension
  document.body.appendChild(link);
  link.click();
}

const ImportWhitelist = async (poolAddress, file) => {
  return AxiosBasic({
    url: urls.IMPORT_WHITELIST_EXCEL(poolAddress),
    method: 'POST',
    data: file,
    headers: {
      'Content-Type': 'multipart/form-data',
    }
  })
}

const whitelistAPI = {
  ExportWhitelistTemplate,
  ImportWhitelist
}

export default whitelistAPI
