import { useState, Fragment, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import Table from "../../components/Table/Table";
import Pagination from "../../components/Pagination/Pagination";

import { USER_TABLE_HEADER, formatUsers } from "../../utils/tableListUtil";
import { GET_USERS_PAGINATE } from "../../utils/apiPaths";

function Users() {
  const navigate = useNavigate();
  
  const [paginateInfo, setPaginateInfo] = useState({ page: 0, limit: 10, totalPages: 0 });
  const [tableBody, setTableBody] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    axios
      .get(
        GET_USERS_PAGINATE(paginateInfo.page, paginateInfo.limit),
        {
          headers:{
            "Authorization": JSON.parse(localStorage.getItem('user'))?.user.token,
            "User": JSON.parse(localStorage.getItem('user'))?.user.user.Username
          }
        }
      )
      .then((res) => {
        // console.log('pools res: ', res.data);
        setPaginateInfo((prevState) => {
          //set total pages
          return {
            ...prevState,
            totalPages: res.data.PageAmount,
          };
        });
        setTableBody(formatUsers(res.data.Users, paginateInfo.page * paginateInfo.limit));
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
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

  const handleNewUserButtonClick = () => {
    navigate('/newUser');
  }

  const newUserButton = (
    <button
      type="button"
      className="btn btn-outline-info btn-icon-text"
      onClick={handleNewUserButtonClick}
    >
      Create User<i className="ti-plus btn-icon-append"></i>
    </button>
  )


  return (
    <Fragment>
      <div className="col-lg-12 grid-margin stretch-card">
        <Table
          title="User List"
          description=""
          header={USER_TABLE_HEADER}
          topRightElement={newUserButton}
          body={tableBody}
          loading={loading}
        />
      </div>
      <Pagination
        pageCount={paginateInfo.totalPages}
        handlePageClick={(selected) => handlePageClick(selected)}
      />
    </Fragment>
  );
}

export default Users;
