import { AxiosDownload, AxiosBasic} from "../services/apiService";
import * as urls from './urls'

const ExportAllAppliedProjects = async () => {
  console.log('hello');
  const response = await AxiosDownload({
    url: urls.EXPORT_EXCEL,
    method: 'GET',
    responseType: 'blob',
  });
  
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', 'appliedProjects.xlsx'); //or any other extension
  document.body.appendChild(link);
  link.click();
}

const getTotalAppliedProjectInfo = ({days}) => {
  return AxiosBasic({
      url: urls.GET_TOTAL_APPLIED_PROJECT_INFO,
      method: "POST",
      data: { days }
  })
}

const deleteAppliedProject = (projectId) => {
  return AxiosBasic({
    url: urls.DELETE_APPLIED_PROJECT(projectId),
    method: "DELETE",
  })
}

const appliedProjectAPI = {
  ExportAllAppliedProjects,
  getTotalAppliedProjectInfo,
  deleteAppliedProject
}

export default appliedProjectAPI
