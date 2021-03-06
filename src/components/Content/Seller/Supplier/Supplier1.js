import React, { Component, Fragment } from "react";
import SupplierModal from "./SupplierModal";
import SupplierRow from "./SupplierRow";
import { connect } from "react-redux";
import { getSuppliers } from "../../../../actions/supplierActions";
import PropTypes from "prop-types";
import axios from "axios";
import Loader from "react-loader";

const mapStateToProps = (state) => ({
  suppliers: state.supplier.suppliers,
  isLoaded: state.supplier.isLoaded,
});

class Supplier extends Component {
  state = {
    sort: [{ value: "5" }, { value: "10" }, { value: "20" }],
    select: "5",
    currentPage: 1,
    pages: [],
    totalDocuments: 0,
    query: "",
  };

  resetState = () => {
    this.setState({ select: "5", currentPage: 1, query: "" });
  };

  componentDidMount() {
    const { select, currentPage, query } = this.state;
    this.getTotalDocuments();

    this.getPages();

    this.props.getSuppliers(select, currentPage, query);
  }

  getTotalDocuments = () => {
    const { query } = this.state;

    let newQuery = "";
    if (query === "") newQuery = "undefined";
    else newQuery = query;

    axios
      .get(
        `${process.env.REACT_APP_BACKEND_HOST}/api/supplier/count/${newQuery}`
      )
      .then((response) => {
        this.setState({ totalDocuments: response.data });
      })
      .catch((er) => {
        console.log(er.response);
      });
  };

  getPages = () => {
    const { select, query } = this.state;

    let newQuery = "";
    if (query === "") newQuery = "undefined";
    else newQuery = query;

    axios
      .get(
        `${process.env.REACT_APP_BACKEND_HOST}/api/supplier/count/${newQuery}`
      )
      .then((response) => {
        let pages = Math.floor(response.data / select);
        let remainder = response.data % select;
        let newArray = [];
        if (remainder !== 0) pages += 1;

        for (let i = 0; i < pages; i++) {
          newArray.push({ pageNumber: i + 1 });
        }

        this.setState({ pages: newArray });
      })
      .catch((er) => {
        console.log(er.response);
      });
  };

  renderSuppliers = () => {
    const { suppliers } = this.props;
    return suppliers.map((eachSup, index) => (
      <SupplierRow
        history={this.props.history}
        key={eachSup._id}
        supplier={eachSup}
        index={index}
        // deleteCategory={this.props.deleteCategory}
      />
    ));
  };

  handleOnChange = (e) => {
    let format = /[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
    if (format.test(this.state.query)) {
      return;
    }
    this.setState({ [e.target.name]: e.target.value }, () => {
      const { select, currentPage, query } = this.state;

      this.props.getSuppliers(select, currentPage, query);
      this.getPages();
      this.getTotalDocuments();
    });
  };

  // renderSuppliers = () => {
  //   const { suppliers } = this.state;
  //   suppliers.map(eachSupplier => {
  //     return (
  //       <SupplierRow
  //         history={this.props.history}
  //         key={eachSupplier._id}
  //         Supplier={eachSupplier}
  //       />
  //     );
  //   });
  // };
  handleChoosePage = (e) => {
    this.setState({ currentPage: e }, () => {
      const { select, currentPage, query } = this.state;
      this.props.getSuppliers(select, currentPage, query);
    });
  };

  renderPageButtons = () => {
    const { pages, currentPage } = this.state;

    return pages.map((eachButton) => (
      <li
        key={eachButton.pageNumber}
        className={
          currentPage === eachButton.pageNumber
            ? "paginae_button active"
            : "paginate_button "
        }
      >
        <div
          name="currentPage"
          onClick={() => this.handleChoosePage(eachButton.pageNumber)}
          aria-controls="example1"
          data-dt-idx={eachButton.pageNumber}
          tabIndex={0}
        >
          {eachButton.pageNumber}
        </div>
      </li>
    ));
  };

  render() {
    const { select, totalDocuments } = this.state;
    const { isLoaded } = this.props;

    return (
      <Fragment>
        {!isLoaded ? (
          <Loader></Loader>
        ) : (
          <Fragment>
            {/* Content Header (Page header) */}
            <section className="content-header">
              <h1>
                Nhà cung cấp
                {/* <small>Preview</small> */}
              </h1>
              <ol className="breadcrumb">
                <li>
                  <a href="fake_url">
                    <i className="fa fa-dashboard" /> Trang chủ
                  </a>
                </li>
                <li>
                  <a href="fake_url">Nhà cung cấp</a>
                </li>
              </ol>
            </section>
            {/* Main content */}
            <section className="content">
              <div className="row">
                {/* left column */}
                <div className="col-md-12">
                  <div className="box">
                    <div className="box-header" style={{ marginTop: "5px" }}>
                      <div style={{ paddingLeft: "5px" }} className="col-md-8">
                        <h3 className="box-title">
                          Data Table With Full Features
                        </h3>
                      </div>

                      <div className="col-md-4">
                        <SupplierModal />
                      </div>
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
                                  Show
                                  <select
                                    onChange={this.handleOnChange}
                                    name="select"
                                    aria-controls="example1"
                                    style={{ margin: "0px 5px" }}
                                    className="form-control input-sm"
                                    value={this.state.select}
                                  >
                                    {this.state.sort.map((option) => (
                                      <option
                                        key={option.value}
                                        value={option.value}
                                      >
                                        {option.value}
                                      </option>
                                    ))}
                                  </select>
                                  entries
                                </label>
                              </div>
                            </div>
                            <div className="col-sm-6">
                              <div
                                id="example1_filter"
                                className="dataTables_filter"
                              >
                                <label style={{ float: "right" }}>
                                  Tìm kiếm
                                  <input
                                    type="search"
                                    name="query"
                                    style={{ margin: "0px 5px" }}
                                    className="form-control input-sm"
                                    placeholder="Nhập từ khóa...  "
                                    aria-controls="example1"
                                    onChange={this.handleOnChange}
                                    value={this.state.query}
                                  />
                                </label>
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
                                  <th style={{ width: "20%" }}>Supplier</th>
                                  <th style={{ width: "10%" }}>Phone</th>
                                  <th style={{ width: "25%" }}>Address</th>
                                  <th style={{ width: "10%" }}>Created date</th>
                                  <th style={{ width: "15%" }}>Creator</th>
                                  <th style={{ width: "30%" }}>Action</th>
                                </tr>
                              </thead>
                              <tbody>{this.renderSuppliers()}</tbody>
                              <tfoot>
                                <tr>
                                  <th>#</th>
                                  <th>Supplier</th>
                                  <th>Phone</th>
                                  <th>Address</th>
                                  <th>Created date</th>
                                  <th>Creator</th>
                                  <th>Action</th>
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
                              Hiển thị 1 đến {select} trong {totalDocuments} mục
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
        )}
      </Fragment>
    );
  }
}

Supplier.propTypes = {
  getSuppliers: PropTypes.func.isRequired,
  supplier: PropTypes.object.isRequired,
  isLoaded: PropTypes.bool.isRequired,
};

export default connect(mapStateToProps, { getSuppliers })(Supplier);
