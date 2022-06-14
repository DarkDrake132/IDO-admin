import { useState, Fragment, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import Table from "../../components/Table/Table";
import Pagination from "../../components/Pagination/Pagination";

import { POOL_TABLE_HEADER, formatPools } from "../../utils/tableListUtil";
import { GET_POOLS_PAGINATE } from "../../utils/apiPaths";

function Pools() {
  const navigate = useNavigate();
  
  const [paginateInfo, setPaginateInfo] = useState({ page: 0, limit: 10, totalPages: 0 });
  const [tableBody, setTableBody] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    axios
      .get(
        GET_POOLS_PAGINATE(
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
        //console.log('pools res: ', res.data);
        setPaginateInfo((prevState) => {
          //set total pages
          return {
            ...prevState,
            totalPages: res.data.PageAmount,
          };
        });
        setTableBody(formatPools(res.data.Pools));
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, [paginateInfo.page, paginateInfo.limit]);

  const handleNavigateToPoolDetail = (event, poolId) => {
    event.preventDefault();
    navigate(`/pools/${poolId}`)
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


  return (
    <Fragment>
      <div className="col-lg-12 grid-margin stretch-card">
        <Table
          title="Pool List"
          description=""
          header={POOL_TABLE_HEADER}
          body={tableBody}
          loading={loading}
          rowNavigate={handleNavigateToPoolDetail}
        />
      </div>
      <Pagination
        pageCount={paginateInfo.totalPages}
        handlePageClick={(selected) => handlePageClick(selected)}
      />
    </Fragment>
  );
}

export default Pools;
