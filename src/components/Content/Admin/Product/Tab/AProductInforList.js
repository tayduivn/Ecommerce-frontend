import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Loader from 'react-loader';

import { getProducts } from '../../../../../state/actions/productActions';
import { pushHistory } from '../../../../../state/actions/historyActions';
import ProductInforRow from '../ProductInforRow';

const mapStateToProps = (state) => ({
    products: state.product.products,
    isLoaded: state.product.isLoaded,
    totalDocuments: state.product.totalDocuments
});

class AProductInforList extends React.Component {
    state = {
        sort: [{ value: 5 }, { value: 10 }, { value: 20 }],
        limit: 5,
        page: 1,
        query: '',
        pages: [],
        start: 1,
        end: 5,
        isNextBtnShow: true,
    }

    componentDidMount() {
        const { limit, page, query } = this.state;
        this.props.getProducts({ limit, page, query, arrayStatus: ['accepted', 'declined'] });
    }

    componentDidUpdate = (prevProps, prevState, snapshot) => {
        const { isLoaded } = this.props
        if (isLoaded == true && this.state.pages == prevState.pages) {
            this.getPages();
        }
    }

    renderProducts = () => {
        const { products, isLoaded } = this.props;
        const { start, limit, page, query } = this.state;
        return !isLoaded ? (
            <tr>
                <td>
                    <Loader></Loader>
                </td>
            </tr>
        ) : (
                products.map((p, index) => (
                    <ProductInforRow
                        history={this.props.history}
                        key={index}
                        product={p}
                        index={index + start - 1}
                        pages={{ limit, page, query }}
                    />
                ))
            );
    };

    getPages = () => {
        const { limit, query } = this.state;
        let { totalDocuments } = this.props;

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

        //Nếu totalDocuments > 6 thì pageButtons được chia ra làm 3 nút số đầu - dấu 3 chấm - nút số cuối
        if (newArray && newArray.length > 6) {
            newArray = [
                { pageNumber: 1 },
                { pageNumber: 2 },
                { pageNumber: 3 },
                { pageNumber: '...' },
                { pageNumber: newArray.length },
            ];
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
        let { totalDocuments } = this.props;

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
        this.props.getProducts({ limit, page, query, arrayStatus: ['accepted', 'declined'] });
        this.getPages();
        this.getStartEndDocuments();
    };

    handleChoosePage = (e) => {
        if (e === '...') return
        const { limit, page } = this.state;
        let { totalDocuments, idShop } = this.props;

        let pages = Math.floor(totalDocuments / limit),
            remainder = totalDocuments % limit;
        if (remainder !== 0) pages += 1;
        if (e === -1) {
            e = page + 1;
            if (e === pages) this.setState({ isNextBtnShow: false });
        } else {
            if (e === pages) this.setState({ isNextBtnShow: false });
            else this.setState({ isNextBtnShow: true });
        }

        this.setState({ page: e }, () => {
            const { limit, page, query } = this.state;
            this.props.getProducts({ limit, page, query, arrayStatus: ['accepted', 'declined'] });
            this.getStartEndDocuments();
        });
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
                                    ? 'paginae_button active'
                                    : 'paginate_button '
                            }>
                            <a className="paga-link"
                                name="currentPage"
                                href="javascript:void(0);"
                                onClick={() => this.handleChoosePage(eachButton.pageNumber)}>
                                {eachButton.pageNumber}
                            </a>
                        </li>
                    ))}
                    <li className="paginate_button">
                        <a className={isNextBtnShow === true ? 'paga-link' : 'paga-link_hidden'}
                            name="currentPage"
                            href="javascript:void(0);"
                            onClick={() => this.handleChoosePage(-1)}>
                            {'>>'}
                        </a>
                    </li>
                </>
            );
        }
    };

    render() {
        const { query, start, end } = this.state
        const { products, totalDocuments } = this.props
        return (
            <div className="row">
                <div className="col-md-12">
                    <div className="box-body">
                        <div
                            id="example1_wrapper"
                            className="dataTables_wrapper form-inline dt-bootstrap">
                            <div className="row">
                                <div>
                                    <div className="col-sm-6">
                                        <div
                                            className="dataTables_length"
                                            id="example1_length">
                                            <label>
                                                Hiển thị
                                                <select
                                                    onChange={this.handleOnChange}
                                                    name="limit"
                                                    aria-controls="example1"
                                                    style={{ margin: '0px 5px' }}
                                                    className="form-control input-sm"
                                                    value={this.state.limit}>
                                                    {this.state.sort.map((option) => (
                                                        <option
                                                            key={option.value}
                                                            value={option.value}
                                                        >
                                                            {option.value}
                                                        </option>
                                                    ))}
                                                </select>
                                            kết quả
                                            </label>
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <div id="example1_filter"
                                            className="dataTables_filter">
                                            <label style={{ float: 'right' }}>
                                                Tìm kiếm
                                                <input
                                                    type="search"
                                                    name="query"
                                                    style={{ margin: '0px 5px' }}
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
                                    <table id="example1" className="table table-bordered table-striped">
                                        <thead>
                                            <tr>
                                                <th style={{ width: '5%' }}>#</th>
                                                <th style={{ width: '15%' }}>Tên sản phẩm</th>
                                                <th style={{ width: '10%' }}>Thương hiệu</th>
                                                <th style={{ width: '15%' }}>Tên phim</th>
                                                <th style={{ width: '10%' }}>Nhà bán</th>
                                                <th style={{ width: '10%' }}>Tình trạng</th>
                                                <th style={{ width: '15%' }}>Thao tác</th>
                                            </tr>
                                        </thead>
                                        <tbody>{this.renderProducts()}</tbody>
                                        <tfoot>
                                            <tr>
                                                <th>#</th>
                                                <th>Tên sản phẩm</th>
                                                <th>Thương hiệu</th>
                                                <th>Tên phim</th>
                                                <th>Nhà bán</th>
                                                <th>Tình trạng</th>
                                                <th>Thao tác</th>
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
                                        aria-live="polite">
                                        Hiển thị{' '}
                                        {query == ''
                                            ? start + ' đến ' + (totalDocuments < end ? totalDocuments : end) + ' trong '
                                            : ''}{' '}
                                        {totalDocuments} kết quả
                                    </div>
                                </div>
                                <div className="col-sm-7">
                                    <div
                                        className="dataTables_paginate paging_simple_numbers"
                                        id="example1_paginate">
                                        <ul className="pagination" style={{ float: 'right' }}>
                                            {this.renderPageButtons()}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

AProductInforList.propTypes = {
    getProducts: PropTypes.func.isRequired,
    products: PropTypes.array.isRequired,
    isLoaded: PropTypes.bool.isRequired,
};

export default connect(mapStateToProps, { getProducts, pushHistory })(AProductInforList);