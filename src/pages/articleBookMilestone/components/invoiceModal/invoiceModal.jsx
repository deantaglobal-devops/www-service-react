import React, { useState } from "react";
import ModalForm from "../../../../components/ModalForm/modalForm";

import "./styles/invoiceModal.styles.css";

export default function InvoiceModal({
  openInvoiceModal,
  handleOnCloseInvoiceModal,
  data,
  setIsLoading,
}) {
  const [invoiceData, setInvoiceData] = useState(data);

  const handleOnChangeInvoiceDetails = (e, _invoice_id) => {
    if (e) {
      const updatedDetailsValue = invoiceData?.invoiceDetails?.map(
        (invoice) => {
          if (_invoice_id === invoice.invoice_id) {
            return {
              ...invoice,
              [e.target.name]: e.target.value,
            };
          }
          return invoice;
        },
      );

      setInvoiceData({ ...invoiceData, invoiceDetails: updatedDetailsValue });
    }
  };

  const handleOnChangeInvoice = (e) => {
    setInvoiceData({ ...invoiceData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData();

    invoiceData?.invoiceDetails?.map((invoiceDetail) => {
      formData.append("invoiceDataId[]", invoiceDetail.invoice_id);

      if (invoiceData?.invoiceFlag == 1) {
        formData.append("invoiceData[]", invoiceDetail.qty);
        formData.append("invoiceData[]", invoiceDetail.code);
        formData.append(
          `invoicetransaction[${invoiceDetail.invoice_id}]`,
          invoiceDetail.qty,
        );
        formData.append(
          `invoicetransactionprice_code[${invoiceDetail.invoice_id}]`,
          invoiceDetail.code,
        );
      } else {
        formData.append("invoiceData[]", invoiceDetail.invoicevalue);
        formData.append("invoiceData[]", invoiceDetail.codevalue);
        formData.append(
          `invoicetransaction[${invoiceDetail.invoice_id}]`,
          invoiceDetail.invoicevalue,
        );
        formData.append(
          `invoicetransactionprice_code[${invoiceDetail.invoice_id}]`,
          invoiceDetail.codevalue,
        );
      }

      formData.append("invoiceData[]", invoiceDetail.description);
      formData.append(
        `invoicetransactionline_desc[${invoiceDetail.invoice_id}]`,
        invoiceDetail.description,
      );
    });

    formData.append("taskId", invoiceData.taskId);
    formData.append("chapterId", 0);
    formData.append("projectId", invoiceData.project_id);
    formData.append("invoice_no", invoiceData.poNumber);
    formData.append("invoiceSubtitle", invoiceData.subtitle);
    if (invoiceData.otherDescription !== null) {
      formData.append(
        "invoiveOtherDesc",
        invoiceData.otherDescription.replace(/(\r\n|\n|\r)/gm, " "),
      );
    } else {
      formData.append("invoiveOtherDesc", invoiceData.otherDescription);
    }

    const token = localStorage.getItem("lanstad-token");

    if (invoiceData?.invoiceDetails?.length > 0) {
      await fetch(
        `${import.meta.env.VITE_URL_API_SERVICE}/call/calendar/invoice/submit`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Lanstad-Token": token,
          },
          mode: "no-cors",
          body: formData,
        },
      )
        .then((res) => res.json())
        .then(
          (result) => {
            window.location.reload();
          },
          (error) => {
            // Todo: How are we going to show the errors
            console.log(error);
          },
        );
    }
    handleOnCloseInvoiceModal();
    setIsLoading(false);
  };

  // const handleExtraItemOnChange = (e) => {
  //   setExtraItem({ ...extraItem, [e.target.name]: e.target.value });
  // };

  return (
    <ModalForm show={openInvoiceModal}>
      <div className="general-forms">
        <div className="modal-header">
          <h5 className="modal-title">Invoice</h5>
          <button
            type="button"
            className="close"
            onClick={() => handleOnCloseInvoiceModal()}
          >
            <i className="material-icons">close</i>
          </button>
        </div>
        <div className="modal-body">
          <div
            id="invoice-process"
            tabIndex="-1"
            role="dialog"
            aria-labelledby="in_modal"
            aria-hidden="true"
          >
            <form id="invoice-form">
              <div className="full-info-grid">
                <div className="f-col">
                  <div className="wrap-field-label">
                    <label className="cstm-label">Type:</label>
                    <span className="cstm-bold-txt type_name">
                      {invoiceData.type_name ? invoiceData.type_name : ""}
                    </span>
                    <input
                      type="hidden"
                      name="type_name"
                      id="type_name"
                      value={invoiceData.type_name ? invoiceData.type_name : ""}
                      readOnly
                    />
                  </div>
                  <div className="wrap-field-label">
                    <label className="cstm-label">CE Complexity</label>
                    <span className="cstm-bold-txt CE_Complexity">
                      {invoiceData.CE_Complexity
                        ? invoiceData.CE_Complexity
                        : ""}
                    </span>
                    <input
                      type="hidden"
                      name="CE_Complexity"
                      id="CE_Complexity"
                      value={
                        invoiceData.CE_Complexity
                          ? invoiceData.CE_Complexity
                          : ""
                      }
                      readOnly
                    />
                  </div>
                </div>
                <div className="m-col">
                  <div className="wrap-field-label">
                    <label className="cstm-label">Type:</label>
                    <span className="cstm-bold-txt category_name">
                      {invoiceData.category_name
                        ? invoiceData.category_name
                        : ""}
                    </span>
                    <input
                      type="hidden"
                      name="category_name"
                      id="category_name"
                      value={
                        invoiceData.category_name
                          ? invoiceData.category_name
                          : ""
                      }
                      readOnly
                    />
                  </div>
                  <div className="wrap-field-label">
                    <label className="cstm-label">TS Complexity</label>
                    <span className="cstm-bold-txt TS_Complexity">
                      {invoiceData.TS_Complexity}
                    </span>
                    <input
                      type="hidden"
                      name="TS_Complexity"
                      id="TS_Complexity"
                      value={
                        invoiceData.TS_Complexity
                          ? invoiceData.TS_Complexity
                          : ""
                      }
                      readOnly
                    />
                  </div>
                </div>
                <div className="l-col">
                  <div className="wrap-field-label">
                    <label className="cstm-label">PM Complexity</label>
                    <span className="cstm-bold-txt PM_Complexity">
                      {invoiceData.PM_Complexity
                        ? invoiceData.PM_Complexity
                        : ""}
                    </span>
                    <input
                      type="hidden"
                      name="PM_Complexity"
                      id="PM_Complexity"
                      value={
                        invoiceData.PM_Complexity
                          ? invoiceData.PM_Complexity
                          : ""
                      }
                      readOnly
                    />
                  </div>
                </div>
              </div>
              <br />
              {/* <div className="full-info-grid mb-4"> */}
              <div className="info-flex">
                {invoiceData.invoiceFlag == 1
                  ? invoiceData?.invoiceDetails?.map((detail) => {
                      return (
                        <React.Fragment key={detail.invoice_id}>
                          <div className="wrap-field-label col-md-4 box_invoice">
                            <label
                              className="label-form"
                              invoice={detail.invoice_id}
                              invoicecode={detail.code}
                              description={detail.description}
                            >
                              {detail.description}
                            </label>
                            <input
                              className="default-input-text"
                              type="text"
                              invoice_id={detail.invoice_id}
                              name="qty"
                              value={detail.qty ? detail.qty : ""}
                              onChange={(e) =>
                                handleOnChangeInvoiceDetails(
                                  e,
                                  detail.invoice_id,
                                )
                              }
                            />
                          </div>
                        </React.Fragment>
                      );
                    })
                  : invoiceData?.invoiceDetails?.map((detail) => {
                      return (
                        <React.Fragment key={detail.invoice_id}>
                          <div className="wrap-field-label col-md-4 box_invoice">
                            <label
                              className="label-form"
                              complexity={detail.complexity}
                              invoice={detail.invoice_id}
                              invoicecode={detail.codevalue}
                              description={detail.description}
                            >
                              {detail.description}
                            </label>
                            <input
                              className="default-input-text"
                              type="text"
                              invoice_id={detail.invoice_id}
                              placeholder={detail.units}
                              name="invoicevalue"
                              value={
                                detail.invoicevalue ? detail.invoicevalue : ""
                              }
                              onChange={(e) =>
                                handleOnChangeInvoiceDetails(
                                  e,
                                  detail.invoice_id,
                                )
                              }
                            />
                          </div>
                        </React.Fragment>
                      );
                    })}

                <div className="wrap-field-label col-md-4">
                  <label className="label-form">PO Number:</label>
                  <input
                    className="default-input-text"
                    type="text"
                    id="invoice_no"
                    name="poNumber"
                    value={invoiceData.poNumber}
                    onChange={(e) => handleOnChangeInvoice(e)}
                  />
                </div>

                <div className="wrap-field-label col-md-4">
                  <label className="label-form">Other Cost:</label>
                  <input
                    className="default-input-text invoive_other_cost"
                    type="text"
                    name="otherCost"
                    readOnly
                    value={invoiceData.otherCost ? invoiceData.otherCost : ""}
                    onChange={(e) => handleOnChangeInvoice(e)}
                  />
                </div>
              </div>
              <div className="row mt-4">
                <div className="col-md-12">
                  <div className="wrap-field-label">
                    <label className="label-form">Sub Title</label>
                    <input
                      className="default-input-text"
                      type="text"
                      id="invoice-subtitle"
                      name="subtitle"
                      placeholder="This is the value of the text field"
                      value={invoiceData.subtitle}
                      onChange={(e) => handleOnChangeInvoice(e)}
                    />
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-md-6 pr-2">
                  <div className="wrap-field-label">
                    <label className="label-form">Description</label>
                    <textarea
                      className="default-textarea"
                      name="project-description"
                      id="invoice-description"
                      placeholder="This is a value that’s a little longer than normal."
                    />
                  </div>
                </div>
                <div className="col-md-6 pl-2">
                  <div className="wrap-field-label">
                    <label className="label-form">Other Cost Description</label>
                    <textarea
                      className="default-textarea invoive_other_desc"
                      readOnly
                      name="project-description"
                      placeholder="This is a value that’s a little longer than normal."
                      value={invoiceData.otherDescription}
                      onChange={(e) => handleOnChangeInvoice(e)}
                    />
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
        <div className="modal-footer cta-right">
          <button
            type="button"
            className="btn btn-outline-primary"
            data-dismiss="modal"
            onClick={() => handleOnCloseInvoiceModal()}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-outline-primary"
            id="invoice-submit"
            onClick={(e) => handleSubmit(e)}
          >
            Submit
          </button>
        </div>
      </div>
    </ModalForm>
  );
}
