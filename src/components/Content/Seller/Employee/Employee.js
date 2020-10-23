import React, { Component, Fragment } from 'react';
import EmployeeModal from './EmployeeModal';
import EmployeeRow from './EmployeeRow';
import { connect } from 'react-redux';
import { getEmployees } from '../../../../state/actions/employeeActions';
import PropTypes from 'prop-types';
import Loader from 'react-loader';

const mapStateToProps = (state) => ({
  employees: state.employee.employees,
  isLoaded: state.employee.isLoaded,
  totalDocuments: state.employee.totalDocuments,
});

class Employee extends Component {
  state = {
    sort: [{ value: 5 }, { value: 10 }, { value: 20 }],
    // select: "5",
    limit: 5,
    page: 1,
    pages: [],
    totalDocuments: 0,
    query: '',
    start: 1,
    end: 5,
  };

  componentDidMount() {
    const { limit, page, query } = this.state;
    let idShop = 1;
    this.props.getEmployees({ limit, page, query, idShop });
  }
  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.isLoaded == true && this.state.pages == prevState.pages) {
      this.getPages();
    }
  }

  getPages = () => {
    const { limit, query } = this.state;
    const { totalDocuments } = this.props;
    if (totalDocuments == 0) return;

    let newQuery = '';
    if (query === '') newQuery = 'undefined';
    else newQuery = query;

    let pages = Math.floor(totalDocuments / limit);
    let remainder = totalDocuments % limit;
    let newArray = [];
    if (remainder !== 0) pages += 1;

    for (let i = 0; i < pages; i++) {
      newArray.push({ pageNumber: i + 1 });
    }

    this.setState({ pages: newArray });
  };

  handleOnChange = (e) => {
    e.persist();
    this.setState({ [e.target.name]: e.target.value }, () => {
      if (e.target.name === 'query') {
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
    this.setState({ start: (page - 1) * limit + 1 }, () => {
      let end;
      console.log(Math.floor(totalDocuments / limit));
      if (Math.floor(totalDocuments / limit) + 1 == page)
        end = (page - 1) * limit + (totalDocuments % limit);
      else end = page * limit;
      this.setState({ end: end });
    });
  }

  rerenderPage = () => {
    const { limit, page, query } = this.state;
    let idShop = 1;
    this.props.getEmployees({ limit, page, query, idShop });
    this.getPages();
    this.getStartEndDocuments();
  };

  renderEmployees = () => {
    const { start, limit, page } = this.state;
    const { employees } = this.props;
    return employees.map((eachEmployee, index) => (
      <EmployeeRow
        history={this.props.history}
        key={eachEmployee.id}
        employee={eachEmployee}
        index={index + start - 1}
      />
    ));
  };

  handleChoosePage = (e) => {
    this.setState({ page: e }, () => {
      const { limit, page, query } = this.state;
      let idShop = 1;
      this.props.getEmployees({ limit, page, query, idShop });
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
        style={{ margin: '0px 5px' }}
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
    const { pages, page } = this.state;
    if (pages.length > 1) {
      return pages.map((eachButton) => (
        <li
          key={eachButton.pageNumber}
          className={
            page === eachButton.pageNumber
              ? 'paginae_button active'
              : 'paginate_button '
          }
        >
          <a
            className="paga-link"
            name="currentPage"
            href="#"
            onClick={() => this.handleChoosePage(eachButton.pageNumber)}
          >
            {eachButton.pageNumber}
          </a>
        </li>
      ));
    }
  };

  render() {
    const { limit, page, start, end, query } = this.state;
    const { isLoaded, totalDocuments } = this.props;
    return (
      <Fragment>
        {!isLoaded ? (
          <Loader></Loader>
        ) : (
          <Fragment>
            {/* Content Header (Page header) */}
            <section className="content-header">
              <h1>
                Nhân viên
                {/* <small>Preview</small> */}
              </h1>
              <ol className="breadcrumb">
                <li>
                  <a href="fake_url">
                    <i className="fa fa-dashboard" /> Trang chủ
                  </a>
                </li>
                <li>
                  <a href="fake_url">Nhân viên</a>
                </li>
              </ol>
            </section>
            {/* Main content */}
            <section className="content">
              <div className="row">
                {/* left column */}
                <div className="col-md-12">
                  <div className="box">
                    <div className="box-header" style={{ marginTop: '5px' }}>
                      <div style={{ paddingLeft: '5px' }} className="col-md-8">
                        <h3 className="box-title">Quản lý nhân viên</h3>
                      </div>

                      <div className="col-md-4">
                        <EmployeeModal limit={limit} page={page} />
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
                              >
                                <label style={{ float: 'right' }}>
                                  Tìm kiếm:
                                  <input
                                    type="search"
                                    name="query"
                                    style={{ margin: '0px 5px' }}
                                    className="form-control input-sm"
                                    placeholder="Nhập từ khóa... "
                                    aria-controls="example1"
                                    onChange={this.handleOnChange}
                                    value={query}
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
                                  <th style={{ width: '5%' }}>#</th>
                                  <th style={{ width: '15%' }}>
                                    Tên tài khoản
                                  </th>
                                  <th style={{ width: '10%' }}>Vai trò</th>
                                  <th style={{ width: '20%' }}>Họ tên</th>
                                  <th style={{ width: '15%' }}>
                                    Số điện thoại
                                  </th>
                                  <th style={{ width: '20%' }}>Hành động</th>
                                </tr>
                              </thead>
                              <tbody>{this.renderEmployees()}</tbody>
                              <tfoot>
                                <tr>
                                  <th>#</th>
                                  <th>Tên tài khoản</th>
                                  <th>Vai trò</th>
                                  <th>Họ tên</th>
                                  <th>Số điện thoại</th>
                                  <th>Hành động</th>
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
                              Hiển thị{' '}
                              {query == ''
                                ? start + ' đến ' + end + ' trong '
                                : ''}{' '}
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
                                style={{ float: 'right' }}
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

Employee.propTypes = {
  getEmployees: PropTypes.func.isRequired,
  employees: PropTypes.array.isRequired,
  isLoaded: PropTypes.bool.isRequired,
  totalDocuments: PropTypes.number.isRequired,
};

export default connect(mapStateToProps, { getEmployees })(Employee);
