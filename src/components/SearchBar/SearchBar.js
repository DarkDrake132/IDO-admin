import Input from "../ui/Input/Input";

function SearchBar() {
  return (
    <ul className="navbar-nav mr-lg-2">
      <li className="nav-item nav-search d-none d-lg-block">
        <div className="input-group">
          <div
            className="input-group-prepend hover-cursor"
            id="navbar-search-icon"
          >
            <span className="input-group-text" id="search">
              <i className="icon-search"></i>
            </span>
          </div>
          <Input
            type="text"
            id="navbar-search-input"
            placeholder="Search now"
            aria-label="search"
            aria-describedby="search"
          />
        </div>
      </li>
    </ul>
  );
}

export default SearchBar;
