import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { deleteProduct } from "../../../../state/actions/productActions";
import { updateProductVarStatus } from "../../../../state/actions/productVarActions";
import { showModal } from "../../../../state/actions/modalActions";
import { pushHistory } from "../../../../state/actions/historyActions";

const mapStateToProps = (state) => ({
  history: state.history.history,
  permissions: state.auth.permissions,
});

class ProductRow extends Component {
  convertDate = (date) => {
    const newDate = new Date(date);
    let year = newDate.getFullYear();
    let month = newDate.getMonth() + 1;
    let dt = newDate.getDate();

    dt = dt < 10 ? `0${dt}` : dt;
    month = month < 10 ? `0${month}` : month;
    return year + "-" + month + "-" + dt;
  };

  approve = () => {
    const { productVar } = this.props;
    productVar.status = "active";
    this.props.updateProductVarStatus(productVar);
  };

  render() {
    const {
      name,
      SKU,
      price,
      id,
      status,
      stockAmount,
      Images,
    } = this.props.productVar;
    const { index, getActive, permissions } = this.props;

    return (
      <Fragment>
        {(getActive == false && status !== "active") ||
        (getActive == true && status == "active") ? (
          <tr>
            <td>{index + 1}</td>
            <td>
              <img
                src={Images[0].url}
                alt=""
                border="3"
                height="200"
                width="200"
              />{" "}
              {SKU}
            </td>
            <td>{name}</td>
            <td>{SKU}</td>
            <td>{price} VND</td>
            <td>{stockAmount}</td>

            {status == "active" && (
              <td>
                <div className="btn-group">
                  {permissions.includes("editProductVar") && (
                    <button
                      onClick={() => {
                        this.props.history.push({
                          pathname: "/seller/productvar/edit",
                          search: `?id=${id}`,
                        });
                      }}
                      type="button"
                      className="btn btn-success"
                    >
                      Sửa
                    </button>
                  )}
                  {permissions.includes("getStockAmount") && (
                    <button
                      onClick={() => {
                        this.props.showModal({
                          show: true,
                          modalName: "modalStockHis",
                          details: { idProductVar: id, name },
                        });
                      }}
                      type="button"
                      className="btn btn-primary"
                    >
                      Nhập kho
                    </button>
                  )}
                </div>
              </td>
            )}

            {status == "pending" && (
              <>
                <td style={{ color: "grey" }}>
                  <i
                    style={{ color: "#52c41a" }}
                    className="fa fa-spinner"
                    aria-hidden="true"
                  ></i>{" "}
                  Chờ duyệt
                </td>
              </>
            )}
          </tr>
        ) : null}
      </Fragment>
    );
  }
}

export default connect(mapStateToProps, {
  deleteProduct,
  pushHistory,
  updateProductVarStatus,
  showModal,
})(ProductRow);
