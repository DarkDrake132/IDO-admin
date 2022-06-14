import { useState, Fragment, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import Table from "../../components/Table/Table";
import Pagination from "../../components/Pagination/Pagination";

import { ADMIN_TABLE_HEADER, formatAdmins, formatUsers } from "../../utils/tableListUtil";
import { GET_ADMINS_PAGINATE } from "../../utils/apiPaths";

function Admins() {
  const navigate = useNavigate();
  
  const [paginateInfo, setPaginateInfo] = useState({ page: 0, limit: 10, totalPages: 0 });
  const [tableBody, setTableBody] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    axios
      .get(
        GET_ADMINS_PAGINATE(paginateInfo.page, paginateInfo.limit),
        {
          headers:{
            "Authorization": JSON.parse(localStorage.getItem('user'))?.user.token,
            "User": JSON.parse(localStorage.getItem('user'))?.user.user.Username
          }
        }
      )
      .then((res) => {
        setPaginateInfo((prevState) => {
          console.log(res.data);
          //set total pages
          return {
            ...prevState,
            totalPages: res.data.PageAmount,
          };
        });
        setTableBody(formatAdmins(res.data.Admins, paginateInfo.page * paginateInfo.limit));
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
      console.log(tableBody);
  }, [paginateInfo.page, paginateInfo.limit]);


  const handlePageClick = (selectedPage) => {
    //set the page
    setPaginateInfo((prevState) => {
      return {
        ...prevState,
        page: selectedPage,
      };
    });
  };

  const handleNewAdminButtonClick = () => {
    navigate('/new-admin');
  }

  const newUserButton = (
    <button
      type="button"
      className="btn btn-outline-info btn-icon-text"
      onClick={handleNewAdminButtonClick}
    >
      Create Admin<i className="ti-plus btn-icon-append"></i>
    </button>
  )
  const handleNavigateToAdminDetail = (event, username) => {
    event.preventDefault();
    navigate(`/admins/${username}`)
  }

  return (
    <Fragment>
      <div className="col-lg-12 grid-margin stretch-card">
        <Table
          title="Admin List"
          description=""
          header={ADMIN_TABLE_HEADER}
          topRightElement={newUserButton}
          body={tableBody}
          loading={loading}
          rowNavigate={handleNavigateToAdminDetail}
        />
      </div>
      <Pagination
        pageCount={paginateInfo.totalPages}
        handlePageClick={(selected) => handlePageClick(selected)}
      />
    </Fragment>
  );
}

export default Admins;
