import ReactPaginate from "react-paginate";

const Pagination = ({
  pageCount,
  marginPagesDisplayed = 2,
  pageRangeDisplayed = 3,
  handlePageClick,
}) => {
  return (
    <div>
      <ReactPaginate
        previousLabel={"previous"} // label for previous page button
        nextLabel={"next"} // label for next page button
        breakLabel={"..."} // label for break button ( ... )
        pageCount={pageCount} // total number of pages
        marginPagesDisplayed={marginPagesDisplayed} // total number of pages displayed on each side of current page (after and before ... button)
        pageRangeDisplayed={pageRangeDisplayed} // total number of pages displayed on each side of current page
        onPageChange={({ selected }) => handlePageClick(selected)} // handle page change
        containerClassName="pagination justify-content-center" // class name for pagination container
        pageClassName="page-item" // class name for page number button ( <li> tag )
        pageLinkClassName="page-link" // class name for <a> tag in <li> tag
        previousClassName="page-item" // class name for previous button ( <li> tag )
        previousLinkClassName="page-link" // class name for <a> tag in <li> tag (for the previous button)
        nextClassName="page-item" // class name for next button ( <li> tag )
        nextLinkClassName="page-link" // class name for <a> tag in <li> tag (for the next button)
        breakClassName="page-item" // class name for break button ( <li> tag )
        breakLinkClassName="page-link" // class name for <a> tag in <li> tag (for the break button)
        activeClassName="active" // class name for current page
      />
    </div>
  );
};

export default Pagination;
