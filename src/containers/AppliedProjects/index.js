import { useState, useEffect, Fragment } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import Table from "../../components/Table/Table";
import Pagination from "../../components/Pagination/Pagination";

import appliedProjectAPI from "../../apis/appliedProject";

import { GET_APPLIED_PROJECT_PAGINATE } from "../../utils/apiPaths";
import { PROJECT_TABLE_HEADER, formatProjects } from '../../utils/tableListUtil'

function AppliedProjects() {
  const navigate = useNavigate();

  const [paginateInfo, setPaginateInfo] = useState({  page: 0, limit: 6, totalPages: 0, });
  const [tableBody, setTableBody] = useState([]);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    axios
      .get(
        GET_APPLIED_PROJECT_PAGINATE(
          paginateInfo.page,
          paginateInfo.limit
        ),
        {
          headers:{
            "Authorization": JSON.parse(localStorage.getItem('user'))?.user.token,
            "User": JSON.parse(localStorage.getItem('user'))?.user.user.Username
          }
        }
      )
      .then((res) => {
        //console.log('res: ', res)
        setPaginateInfo((prevState) => {
          //set total pages
          return {
            ...prevState,
            totalPages: res.data.PageAmount,
          };
        });
        setTableBody(formatProjects(res.data.Projects));
        setLoading(false);
      })
      .catch((err) => {
        console.log('error: ', err)
        setLoading(false);
      });
  }, [paginateInfo.page, paginateInfo.limit]);




  const handleNavigateToProjectDetail = (event, projectId) => {
    event.preventDefault();
    navigate(`/appliedProjects/${projectId}`)
  }

  const handlePageClick = (selectedPage) => {
    //set the page
    setPaginateInfo((prevState) => {
      return {
        ...prevState,
        page: selectedPage,
      };
    });
  };

  const handleExportExcel = async (e) => {
    e.preventDefault();
    await appliedProjectAPI.ExportAllAppliedProjects();
  };

  const exportExcelButton = (
    <button
      type="button"
      className="btn btn-outline-info btn-icon-text"
      onClick={handleExportExcel}
    >
      Export Excel<i className="ti-printer btn-icon-append"></i>
    </button>
  )

  return (
    <Fragment>
      <div className="col-lg-12 grid-margin stretch-card">
        <Table
          title="Applied Projects"
          description=""
          header={PROJECT_TABLE_HEADER}
          body={tableBody}
          loading={loading}
          topRightElement={exportExcelButton}
          rowNavigate={handleNavigateToProjectDetail}
        />
      </div>
      <Pagination
        pageCount={paginateInfo.totalPages}
        handlePageClick={(selected) => handlePageClick(selected)}
      />
    </Fragment>
  );
}

export default AppliedProjects;
