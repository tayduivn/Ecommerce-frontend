import React, { Component, Fragment } from "react";
import LogSellerRow from "./LogSellerRow";
import { connect } from "react-redux";
import { getLogSellers } from "../../../../state/actions/logSellerActions";
import PropTypes from "prop-types";
import Loader from "react-loader";

const mapStateToProps = (state) => ({
  sellerLogs: state.logSeller.sellerLogs,
  isLoaded: state.logSeller.isLoaded,
  totalDocuments: state.logSeller.totalDocuments,
  idShop: state.auth.role.idShop,
});

class LogSeller extends Component {
  state = {
    sort: [{ value: 5 }, { value: 10 }, { value: 20 }],
    limit: 5,
    page: 1,
    pages: [],
    query: "",
    start: 1,
    end: 5,
    isNextBtnShow: true,
  };

  componentDidMount() {
    const { limit, page, query } = this.state;
    const { idShop } = this.props;
    this.props.getLogSellers({
      limit,
      page,
      query,
      idShop,
    });
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const { isLoaded } = this.props;
    if (isLoaded == true && this.state.pages == prevState.pages) {
      this.getPages();
    }
  }

  getPages = () => {
    const { limit, query } = this.state;
    const { totalDocuments } = this.props;
    if (totalDocuments == 0) return;

    let newQuery = "";
    if (query === "") newQuery = "undefined";
    else newQuery = query;

    let pages = Math.floor(totalDocuments / limit);
    let remainder = totalDocuments % limit;
    let newArray = [];
    if (remainder !== 0) pages += 1;

    for (let i = 0; i < pages; i++) {
      newArray.push({ pageNumber: i + 1 });
    }

    //Nếu totalDocuments > 6 thì pageButtons được chia ra làm 3 nút số đầu - dấu 3 chấm - nút số cuối
    if (newArray && newArray.length > 6) {
      newArray = [
        { pageNumber: 1 },
        { pageNumber: 2 },
        { pageNumber: 3 },
        { pageNumber: "..." },
        { pageNumber: newArray.length },
      ];
    }
    this.setState({ pages: newArray });
  };

  handleOnChange = (e) => {
    e.persist();
    this.setState({ [e.target.name]: e.target.value }, () => {
      if (e.target.name === "query") {
        this.setState({ page: 1 }, () => {
          this.rerenderPage();
        });
      } else {
        this.rerenderPage();
      }
    });
  };

  getStartEndDocuments() {
    const { limit, page } = this.state;
    const { totalDocuments } = this.props;

    let pages = Math.floor(totalDocuments / limit),
      remainder = totalDocuments % limit;
    if (remainder !== 0) pages += 1;

    this.setState({ start: (page - 1) * limit + 1 }, () => {
      let end;
      if (Math.floor(totalDocuments / limit) + 1 == page)
        end = (page - 1) * limit + (totalDocuments % limit);
      else end = page * limit;
      this.setState({ end: end });
    });
  }

  rerenderPage = () => {
    const { limit, page, query } = this.state;
    const { idShop } = this.props;
    this.props.getLogSellers({
      limit,
      page,
      query,
      idShop,
    });
    this.getPages();
    this.getStartEndDocuments();
  };

  renderLogSellers = () => {
    const { start } = this.state;
    const { sellerLogs, isLoaded } = this.props;

    return !isLoaded ? (
      <tr>
        <td>
          <Loader></Loader>
        </td>
      </tr>
    ) : (
      sellerLogs.map((logSeller, index) => (
        <LogSellerRow
          history={this.props.history}
          key={index}
          logSeller={logSeller}
          index={index + start - 1}
        />
      ))
    );
  };

  handleChoosePage = (e, pageNumber) => {
    e.preventDefault();
    if (pageNumber === "...") return;
    const { totalDocuments } = this.props;
    const { limit, page } = this.state;

    let pages = Math.floor(totalDocuments / limit),
      remainder = totalDocuments % limit;
    if (remainder !== 0) pages += 1;

    if (pageNumber === -1) {
      pageNumber = page + 1;
      if (pageNumber === pages) this.setState({ isNextBtnShow: false });
    } else {
      if (pageNumber === pages) this.setState({ isNextBtnShow: false });
      else this.setState({ isNextBtnShow: true });
    }

    this.setState({ page: pageNumber }, () => {
      const { limit, page, query } = this.state;
      const { idShop } = this.props;
      this.props.getLogSellers({
        limit,
        page,
        query,
        idShop,
      });
      this.getStartEndDocuments();
    });
  };

  renderSelect = () => {
    const { sort, limit } = this.state;
    return (
      <select
        onChange={this.handleOnChange}
        name="limit"
        aria-controls="example1"
        style={{ margin: "0px 5px" }}
        className="form-control input-sm"
        value={limit}
      >
        {sort.map((option) => (
          <option key={option.value} value={option.value}>
            {option.value}
          </option>
        ))}
      </select>
    );
  };

  renderPageButtons = () => {
    const { pages, page, isNextBtnShow } = this.state;
    if (pages.length > 1) {
      return (
        <>
          {pages.map((eachButton) => (
            <li
              key={eachButton.pageNumber}
              className={
                page === eachButton.pageNumber
                  ? "paginae_button active"
                  : "paginate_button "
              }
            >
              <a
                className="paga-link"
                name="page"
                href="#"
                onClick={(e) => this.handleChoosePage(e, eachButton.pageNumber)}
              >
                {eachButton.pageNumber}
              </a>
            </li>
          ))}
          <li className="paginate_button">
            <a
              className={
                isNextBtnShow === true ? "paga-link" : "paga-link_hidden"
              }
              name="currentPage"
              href="#"
              onClick={() => this.handleChoosePage(-1)}
            >
              {">>"}
            </a>
          </li>
        </>
      );
    }
  };

  render() {
    const { limit, page, start, end, query } = this.state;
    const { totalDocuments } = this.props;
    const { id } = this.props.match.params;
    return (
      <Fragment>
        {/* {!isLoaded ? (
          <Loader></Loader>
        ) : ( */}
        <Fragment>
          <section className="content-header">
            <h1>Lịch sử hoạt động</h1>
            <ol className="breadcrumb">
              <li>
                <a href="./admin">
                  <i className="fa fa-dashboard" /> Trang chủ
                </a>
              </li>
              <li>
                <a href="/admin/logadmin">Lịch sử hoạt động</a>
              </li>
            </ol>
          </section>
          {/* Main content */}
          <section className="content">
            <div className="row">
              <div className="col-md-12">
                <div className="box">
                  <div className="box-header" style={{ marginTop: "5px" }}>
                    <div className="col-md-4"></div>
                  </div>
                  {/* /.box-header */}
                  <div className="box-body">
                    <div
                      id="example1_wrapper"
                      className="dataTables_wrapper form-inline dt-bootstrap"
                    >
                      <div className="row">
                        <div>
                          <div className="col-sm-6">
                            <div
                              className="dataTables_length"
                              id="example1_length"
                            >
                              <label>
                                Hiển thị
                                {this.renderSelect()}
                                kết quả
                              </label>
                            </div>
                          </div>
                          <div className="col-sm-6">
                            <div
                              id="example1_filter"
                              className="dataTables_filter"
                              style={{ float: "right" }}
                            >
                              <div>
                                Tìm kiếm:{" "}
                                <input
                                  type="search"
                                  name="query"
                                  className="form-control input-sm"
                                  placeholder="Nhập từ khóa... "
                                  aria-controls="example1"
                                  onChange={this.handleOnChange}
                                  value={query}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="row">
                        <div className="col-sm-12">
                          <table
                            id="example1"
                            className="table table-bordered table-striped"
                          >
                            <thead>
                              <tr>
                                <th style={{ width: "5%" }}>#</th>
                                <th style={{ width: "10%" }}>Tên hoạt động</th>
                                <th style={{ width: "15%" }}>Chi tiết</th>
                                <th style={{ width: "10%" }}>Được tạo bởi</th>
                                <th style={{ width: "15%" }}>Ngày tạo</th>
                              </tr>
                            </thead>

                            <tbody>{this.renderLogSellers()}</tbody>

                            <tfoot>
                              <tr>
                                <th>#</th>
                                <th>Tên hoạt động</th>
                                <th>Chi tiết</th>
                                <th>Được tạo bởi</th>
                                <th>Ngày tạo</th>
                              </tr>
                            </tfoot>
                          </table>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-sm-5">
                          <div
                            className="dataTables_info"
                            id="example1_info"
                            role="status"
                            aria-live="polite"
                          >
                            Hiển thị{" "}
                            {query == ""
                              ? start +
                                " đến " +
                                (totalDocuments < end ? totalDocuments : end) +
                                " trong "
                              : ""}{" "}
                            {totalDocuments} kết quả
                          </div>
                        </div>
                        <div className="col-sm-7">
                          <div
                            className="dataTables_paginate paging_simple_numbers"
                            id="example1_paginate"
                          >
                            <ul
                              className="pagination"
                              style={{ float: "right" }}
                            >
                              {this.renderPageButtons()}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/*/.col (left) */}
                  </div>
                  {/* /.row */}
                </div>
              </div>
            </div>
          </section>
          {/* /.content */}
        </Fragment>
        {/* )} */}
      </Fragment>
    );
  }
}

LogSeller.propTypes = {
  getLogSellers: PropTypes.func.isRequired,
  sellerLogs: PropTypes.array.isRequired,
  isLoaded: PropTypes.bool.isRequired,
  totalDocuments: PropTypes.number.isRequired,
};

export default connect(mapStateToProps, { getLogSellers })(LogSeller);
