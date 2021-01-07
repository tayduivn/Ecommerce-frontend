import React, { useEffect } from "react";
import { connect } from "react-redux";
import { addMovie } from "../../../../state/actions/movieActions";
import * as Yup from "yup";
import Select from "react-select";
import { Formik } from "formik";
import styles from "../../../../assets/css/helper.module.css";
import { getMovies } from "../../../../state/actions/movieActions";

const mapStateToProps = (state) => ({
  movieCates: state.movieCate.movieCates,
  isLoaded: state.movieCate.isLoaded,
});

const AMovieModal = (props) => {
  useEffect(() => {
    props.getMovies({ limit: 1000, page: 1 });
  }, []);

  const handleChangeSelect = (selectedItem, setFieldValue) => {
    setFieldValue("idMovieType", selectedItem.id);
  };

  return (
    <Formik
      initialValues={{
        name: "",
        couponCode: "",
        timeStart: "",
        timeEnd: "",
        minAmount: 0,
        maxDiscount: 0,
        percentage: 0,
      }}
      onSubmit={(values, actions) => {
        values = { ...values, pages: props.pages };
        props.addMovie(values);
        document.getElementById("triggerButton").click();
      }}
      validationSchema={Yup.object().shape({
        //idMovieType: Yup.string().required("Bắt buộc nhập"),
        name: Yup.string()
          .min(3, "Mô tả phải dài hơn 3 kí tự")
          .max(100, "Chỉ được phép nhập ít hơn 100 kí tự")
          .required("Bắt buộc nhập"),
        couponCode: Yup.string().required("Bắt buộc nhập"),
        timeStart: Yup.string().required("Bắt buộc nhập"),
        timeEnd: Yup.string().required("Bắt buộc nhập"),
        minAmount: Yup.number().required("Bắt buộc nhập"),
        maxDiscount: Yup.number().required("Bắt buộc nhập"),
        percentage: Yup.number().required("Bắt buộc nhập"),
      })}
    >
      {({
        values,
        touched,
        errors,
        handleBlur,
        handleChange,
        handleSubmit,
        setFieldValue,
      }) => (
        <React.Fragment>
          <button
            type="button"
            id="triggerButton"
            style={{ float: "right" }}
            className="btn btn-primary"
            data-toggle="modal"
            data-target="#exampleModalCenter"
          >
            Thêm mã giảm giá mới
          </button>
          <div
            className="modal fade"
            id="exampleModalCenter"
            tabIndex={-1}
            role="dialog"
            aria-labelledby="exampleModalCenterTitle"
            aria-hidden="true"
          >
            <div className="modal-dialog modal-dialog-centered" role="document">
              <form onSubmit={handleSubmit}>
                <div className="modal-content">
                  <div className="modal-header">
                    <span>
                      <h3 className="modal-title" id="exampleModalLongTitle">
                        Thêm mã giảm giá mới
                      </h3>
                    </span>
                    <span>
                      <button
                        type="button"
                        className="close"
                        data-dismiss="modal"
                        aria-label="Close"
                      >
                        <span aria-hidden="true">×</span>
                      </button>
                    </span>
                  </div>
                  <div className="modal-body">
                    <div className="form-group">
                      <label htmlFor="idMovieType" className="col-form-label">
                        Loại mã giảm giá:
                      </label>
                      {props.isLoaded && (
                        <Select
                          name="idMovieType"
                          onChange={(event) =>
                            handleChangeSelect(event, setFieldValue)
                          }
                          name="idMovieType"
                          isSearchable={true}
                          options={props.movieCates}
                          getOptionLabel={(option) => option.name}
                          getOptionValue={(option) => option.id}
                          placeholder="Chọn loại mã giảm giá"
                          onBlur={handleBlur}
                          value={props.movieCates.filter(
                            (option) => option.id === values.idMovieType
                          )}
                          className={
                            errors.idMovieType && touched.idMovieType
                              ? `${styles.formikinput} ${styles.error}`
                              : ""
                          }
                        />
                      )}

                      {touched.idMovieType && errors.idMovieType ? (
                        <div className={styles.inputfeedback}>
                          {errors.idMovieType}
                        </div>
                      ) : null}
                    </div>
                    <div className="form-group">
                      <label htmlFor="name" className="col-form-label">
                        Mô tả:
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Nhập mô tả..."
                        name="name"
                        value={values.name}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={
                          errors.name && touched.name
                            ? `${styles.formikinput} ${styles.error}`
                            : styles.formikinput
                        }
                      />
                      {touched.name && errors.name ? (
                        <div className={styles.inputfeedback}>
                          {errors.name}
                        </div>
                      ) : null}
                    </div>
                    <div className="form-group">
                      <label htmlFor="couponCode" className="col-form-label">
                        Mã giảm giá:
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Nhập mã giảm giá..."
                        name="couponCode"
                        value={values.couponCode}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={
                          errors.couponCode && touched.couponCode
                            ? `${styles.formikinput} ${styles.error}`
                            : styles.formikinput
                        }
                      />
                      {touched.couponCode && errors.couponCode ? (
                        <div className={styles.inputfeedback}>
                          {errors.couponCode}
                        </div>
                      ) : null}
                    </div>
                    <div className="form-group">
                      <label htmlFor="timeStart" className="col-form-label">
                        Thời gian bắt đầu:
                      </label>
                      <input
                        type="datetime-local"
                        className="form-control"
                        name="timeStart"
                        placeholder="Chọn thời gian bắt đầu"
                        value={values.timeStart}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={
                          errors.timeStart && touched.timeStart
                            ? `${styles.formikinput} ${styles.error}`
                            : styles.formikinput
                        }
                      />
                      {touched.timeStart && errors.timeStart ? (
                        <div className={styles.inputfeedback}>
                          {errors.timeStart}
                        </div>
                      ) : null}
                    </div>
                    <div className="form-group">
                      <label htmlFor="timeEnd" className="col-form-label">
                        Thời gian kết thúc
                      </label>
                      <input
                        type="datetime-local"
                        className="form-control"
                        name="timeEnd"
                        placeholder="Chọn thời gian kết thúc..."
                        value={values.timeEnd}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={
                          errors.timeEnd && touched.timeEnd
                            ? `${styles.formikinput} ${styles.error}`
                            : styles.formikinput
                        }
                      />
                      {touched.timeEnd && errors.timeEnd ? (
                        <div className={styles.inputfeedback}>
                          {errors.timeEnd}
                        </div>
                      ) : null}
                    </div>
                    <div className="form-group">
                      <label htmlFor="minAmount" className="col-form-label">
                        Giá trị hóa đơn tối thiểu:
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        placeholder="Nhập giá trị hóa đơn tối thiểu..."
                        name="minAmount"
                        value={values.minAmount}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={
                          errors.minAmount && touched.minAmount
                            ? `${styles.formikinput} ${styles.error}`
                            : styles.formikinput
                        }
                      />
                      {touched.minAmount && errors.minAmount ? (
                        <div className={styles.inputfeedback}>
                          {errors.minAmount}
                        </div>
                      ) : null}
                    </div>
                    <div className="form-group">
                      <label htmlFor="maxDiscount" className="col-form-label">
                        Mức giảm giá tối đa:
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        id="maxDiscount"
                        placeholder="Nhập mức giảm giá tối đa..."
                        name="maxDiscount"
                        value={values.maxDiscount}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={
                          errors.maxDiscount && touched.maxDiscount
                            ? `${styles.formikinput} ${styles.error}`
                            : styles.formikinput
                        }
                      />
                      {touched.maxDiscount && errors.maxDiscount ? (
                        <div className={styles.inputfeedback}>
                          {errors.maxDiscount}
                        </div>
                      ) : null}
                    </div>
                    <div className="form-group">
                      <label htmlFor="percentage" className="col-form-label">
                        Phần trăm giảm giá:
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        placeholder="Nhập phần trăm giảm giá..."
                        name="percentage"
                        value={values.percentage}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={
                          errors.percentage && touched.percentage
                            ? `${styles.formikinput} ${styles.error}`
                            : styles.formikinput
                        }
                      />
                      {touched.percentage && errors.percentage ? (
                        <div className={styles.inputfeedback}>
                          {errors.percentage}
                        </div>
                      ) : null}
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      data-dismiss="modal"
                    >
                      Close
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={
                        !errors.idMovieType &&
                        !errors.name &&
                        !errors.couponCode &&
                        !errors.timeStart &&
                        !errors.timeEnd &&
                        !errors.minAmount &&
                        !errors.maxDiscount &&
                        !errors.percentage
                          ? false
                          : true
                      }
                    >
                      Thêm mã giảm giá
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </React.Fragment>
      )}
    </Formik>
  );
};

export default connect(mapStateToProps, { addMovie, getMovies })(AMovieModal);
