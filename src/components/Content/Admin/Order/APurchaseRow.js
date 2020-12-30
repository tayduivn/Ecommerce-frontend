import React, { Component } from "react";
import { connect } from "react-redux";
import { showModal } from "../../../../state/actions/modalActions";

const mapStateToProps = (state) => ({
  history: state.history.history,
});

class AOrderRow extends Component {
  state = {
    statuses: [
      { value: "received", label: "Đã tiếp nhận" },
      { value: "in transit", label: "Đang giao hàng" },
      { value: "delivered", label: "Đã nhận hàng" },
      { value: "canceled", label: "Hủy đơn" },
    ],
    disabledState: "",
  };

  convertDate = (date) => {
    const newDate = new Date(date);
    let year = newDate.getFullYear();
    let month = newDate.getMonth() + 1;
    let dt = newDate.getDate();

    dt = dt < 10 ? `0${dt}` : dt;

    month = month < 10 ? `0${month}` : month;

    return dt + "-" + month + "-" + year;
  };

  handleEdit = (id) => {
    this.props.history.push(`/seller/order/edit/${id}`);
  };

  handleDelete = (id) => {
    this.props.deleteEmployee(id);
  };

  render() {
    const {
      numberAndStreet,
      idWard,
      recipient,
      phone,
      status,
      createdAt,
      id,
    } = this.props.purchase;
    const { statuses } = this.state;

    return (
      <tr>
        <td
          onClick={() =>
            this.props.history.push({
              pathname: `/admin/order/purchase/${id}`,
              orderList: this.props.purchase.Orders,
            })
          }
          style={{ color: "blue", cursor: "pointer" }}
        >
          #{id}
        </td>
        <td>{recipient}</td>
        <td>{phone}</td>
        <td>
          {
            numberAndStreet
            //+
            // ", " +
            // Ward.ward +
            // ", " +
            // District.district +
            // ", " +
            // City.city
          }
        </td>
        <td>{this.convertDate(createdAt)}</td>
        <td>
          {status == "warning"
            ? "Cần xử lý"
            : status == "canceled"
            ? "Đã hủy"
            : "Đã nhận hàng"}
        </td>
      </tr>
    );
  }
}

export default connect(mapStateToProps, { showModal })(AOrderRow);
