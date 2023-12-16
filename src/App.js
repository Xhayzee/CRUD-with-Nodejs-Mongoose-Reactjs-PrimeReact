import { Field, Form, Formik } from 'formik';
import 'primeflex/primeflex.css'; // css utility
import 'primeicons/primeicons.css';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import 'primereact/resources/primereact.css';
import 'primereact/resources/themes/lara-light-indigo/theme.css'; // theme
import { Toolbar } from 'primereact/toolbar';
import React, { useEffect, useState } from 'react';
import "./assets/style.scss";
import { createInfo, deleteInfo, getAllInfos, updateInfo } from './services/info';
import { Toast } from 'primereact/toast';
import { Paginator } from 'primereact/paginator';
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import moment from 'moment';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { InputText } from 'primereact/inputtext';

const initial = {
  manufacturer: "",
  model: "",
  startDateTime: "",
  endDateTime: "",
  carrier: "",
  grade: "",
  startAmount: null,
  memory: "",
  color: "",
  units: null,
  unitPrice: null,
  minIncrement: null,
  reportFile: null
}

function App() {
  const [dialog, setDialog] = useState(false)
  const [data, setData] = useState([]);
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(5);
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState("");
  const [initialValues, setInitialValues] = useState(initial);
  const [file, setFile] = useState(null)
  const [totalRecords, setTotalRecords] = useState(0);
  const [isNew, setIsNew] = useState(false)

  const fetchData = (page, rows, search) => {
    getAllInfos(page, rows, search).then((response) => {
      if (response.status === 200) {
        setTotalRecords(response.data.pagination.totalItems)
        setData(response.data.results)
      }
    }).catch((error) => {
      console.error(error);
    })
  }

  useEffect(() => {
    fetchData(page, rows, search)
  }, [])

  const actionBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <Button icon="pi pi-pencil" rounded outlined className="mr-2" onClick={(e) => {
          e.preventDefault();
          setInitialValues({
            carrier: rowData.carrier,
            color: rowData.color,
            endDateTime: moment(rowData.endDateTime, "yyyy-MM-DD hh:mm:ss a").toDate(),
            grade: rowData.grade,
            id: rowData.id,
            manufacturer: rowData.manufacturer,
            memory: rowData.memory,
            minIncrement: rowData.minIncrement,
            model: rowData.model,
            reportFile: rowData.reportFile,
            startAmount: rowData.startAmount,
            startDateTime: moment(rowData.startDateTime, "yyyy-MM-DD hh:mm:ss a").toDate(),
            unitPrice: rowData.startAmount / rowData.units,
            units: rowData.units,
          });
          setDialog(true)
        }} />
        <Button icon="pi pi-trash" rounded outlined severity="danger" onClick={(e) => {
          e.preventDefault();
          confirm(rowData);
        }} />
      </React.Fragment>
    );
  };


  const onPageChange = (event) => {
    setFirst(event.first);
    setRows(event.rows);
    setPage(event.page);

    fetchData(event.page + 1, event.rows, search)
  };

  const leftToolbarTemplate = () => {
    return (
      <div className="flex flex-wrap gap-2">
        <h4>Demo</h4>
      </div>
    );
  };

  const rightToolbarTemplate = () => {
    return <React.Fragment>
      <InputText
        value={search}
        onChange={(e) => {
          const value = e.target.value
          setSearch(value);
          console.log(value);
          if (value.length >= 3) {
            console.log("111111111111");
            fetchData(1, rows, value)
          }
          if (value === "") {
            fetchData(1, rows, value)
          }
        }}
        placeholder="Enter at least 3 characters"
      />
      <Button label="New" icon="pi pi-plus" severity="success" onClick={(e) => {
        e.preventDefault();
        setIsNew(true)
        setDialog(true);
      }} />
    </React.Fragment>;
  };

  const toast = React.createRef();

  const showToast = (severity, summary, detail) => {
    toast.current.show({ severity, summary, detail, life: 3000 });
  };

  const handleSubmit = (values) => {
    if (!file) {
      showToast("error", "Form", "File not Selected")
      return
    }

    if (isNew) {
      createInfo({ ...values, file: file }).then((response) => {
        if (response.status === 200) {
          showToast("success", "Form", "Data submitted successfully")
          fetchData(1, rows, search)
          setInitialValues(initial)
          setIsNew(false)
          setFile(null)
          setDialog(false)
        }
      }).catch((error) => {
        console.error(error);
      })
    } else {
      updateInfo(values.id, values).then((response) => {
        if (response.status === 200) {
          showToast("success", "Form", "Data updated successfully")
          fetchData(1, rows, search)
          setInitialValues(initial)
          setIsNew(false)
          setFile(null)
          setDialog(false)
        }
      })
    }
  }

  const accept = (rowData) => {
    deleteInfo(rowData.id).then((response) => {
      if (response.status === 200) {
        fetchData(page, rows, search)
        showToast("success", "Deletion", "Info Deleted Successfully")
      }
    }).catch((error) => {
      console.error(error);
    })
  };

  const reject = () => {
    showToast("warn", "Cancelled", "Request Cancelled")
  };

  const confirm = (rowData) => {
    confirmDialog({
      message: 'Do you want to delete this record?',
      header: 'Delete Confirmation',
      icon: 'pi pi-info-circle',
      acceptClassName: 'p-button-danger',
      accept: () => accept(rowData),
      reject
    });
  };

  return (
    <React.Fragment>
      <div className='main'>
        <Toolbar className="mb-4" start={leftToolbarTemplate} end={rightToolbarTemplate}></Toolbar>
        <DataTable value={data}>
          <Column field="manufacturer" header="Manufacturer"></Column>
          <Column field="model" header="Model"></Column>
          <Column field="startDateTime" header="Start Date/Time" body={(rowData) => {
            return moment(rowData.startDateTime).format("yyyy-DD-MM HH:mm:ss a")
          }}></Column>
          <Column field="endDateTime" header="End Date/Time" body={(rowData) => {
            return moment(rowData.endDateTime).format("yyyy-DD-MM HH:mm:ss a")
          }}></Column>
          <Column field="carrier" header="Carrier" />
          <Column field="grade" header="Grade" />
          <Column field="startAmount" header="Start Amount" />
          <Column field="memory" header="Memory" />
          <Column field="color" header="Color" />
          <Column field="units" header="Units" />
          <Column field='unitPrice' header="Unit Price" body={(rowData) => { return rowData.startAmount / rowData.units }} />
          <Column field="minIncrement" header="Min. Increment" />
          <Column field="reportFile" header="Report File" />
          <Column body={actionBodyTemplate} exportable={false} />
        </DataTable>
        <Paginator first={first} rows={rows} totalRecords={totalRecords} rowsPerPageOptions={[5, 10, 25, 50]} onPageChange={onPageChange} />
        <Dialog style={{ width: '50vw' }} header={isNew ? "Create Info" : "Update Info"} visible={dialog} onHide={() => {
          setInitialValues(initial)
          setIsNew(false);
          setDialog(false);
        }}>
          <div className="form-container">
            <Formik initialValues={initialValues} enableReinitialize onSubmit={handleSubmit}>
              {({ values, setFieldValue }) => (
                <Form className="my-form">
                  <div className='form-row'>
                    <div className="form-group">
                      <label htmlFor="manufacturer">Manufacturer:</label>
                      <Field type="text" id="manufacturer" name="manufacturer" required />
                    </div>

                    <div className="form-group">
                      <label htmlFor="model">Model:</label>
                      <Field type="text" id="model" name="model" required />
                    </div>
                  </div>

                  <div className='form-row'>
                    <div className="form-group">
                      <label htmlFor="startDateTime">Start Date:</label>
                      <Field type="Date" id="startDateTime" name="startDateTime" required>
                        {({ field, form }) => (
                          <DatePicker
                            {...field}
                            selected={field.value}
                            showTimeSelect
                            dateFormat="Pp"
                            timeFormat="HH:mm"
                            onChange={(date) => form.setFieldValue('startDateTime', date)}
                          />
                        )}
                      </Field>
                    </div>

                    <div className="form-group">
                      <label htmlFor="endDateTime">End Date:</label>
                      <Field type="Date" id="endDateTime" name="endDateTime" required>
                        {({ field, form }) => (
                          <DatePicker
                            {...field}
                            selected={field.value}
                            showTimeSelect
                            dateFormat="Pp"
                            timeFormat="HH:mm"
                            onChange={(date) => form.setFieldValue('endDateTime', date)}
                          />
                        )}
                      </Field>
                    </div>
                  </div>

                  <div className='form-row'>
                    <div className="form-group">
                      <label htmlFor="carrier">Carrier:</label>
                      <Field type="text" id="carrier" name="carrier" required />
                    </div>

                    <div className="form-group">
                      <label htmlFor="grade">Grade:</label>
                      <Field type="text" id="grade" name="grade" required />
                    </div>
                  </div>

                  <div className='form-row'>
                    <div className="form-group">
                      <label htmlFor="startAmount">Starting Amount:</label>
                      <Field type="number" step="any" min={0} id="startAmount" name="startAmount" onChange={(e) => {
                        const value = parseFloat(e.target.value)
                        setFieldValue("startAmount", value);
                        if (values.units && !isNaN(values.units) && values.units !== 0 && value && !isNaN(value) && value !== 0) {
                          setFieldValue("unitPrice", value / values.units)
                        } else {
                          setFieldValue("unitPrice", 0)
                        }
                      }} required />
                    </div>

                    <div className="form-group">
                      <label htmlFor="memory">Memory:</label>
                      <Field type="text" id="memory" name="memory" required />
                    </div>
                  </div>

                  <div className='form-row'>
                    <div className="form-group">
                      <label htmlFor="color">Color:</label>
                      <Field type="text" id="color" name="color" required />
                    </div>

                    <div className="form-group">
                      <label htmlFor="units">No. of Units:</label>
                      <Field type="number" min={0} id="units" name="units" onChange={(e) => {
                        const value = parseInt(e.target.value);
                        setFieldValue("units", value);
                        if (values.startAmount && !isNaN(values.startAmount) && values.startAmount !== 0 && value && !isNaN(value) && value !== 0) {
                          setFieldValue("unitPrice", values.startAmount / value)
                        } else {
                          setFieldValue("unitPrice", 0)
                        }

                      }} required />
                    </div>
                  </div>

                  <div className='form-row'>
                    <div className="form-group">
                      <label htmlFor="unitPrice">Unit Price:</label>
                      <Field type="text" min={0} step="any" id="unitPrice" name="unitPrice" disabled required />
                    </div>

                    <div className="form-group">
                      <label htmlFor="minIncrement">Min. minIncrement:</label>
                      <Field type="number" min={0} id="minIncrement" name="minIncrement" required />
                    </div>
                  </div>

                  <div className='form-row'>
                    <div className="form-group">
                      <label htmlFor="optional">Report File:</label>
                      <Field type="file" id="optional" name="optional" onChange={(e) => {
                        setFile(e.target.files[0])
                      }} />
                    </div>

                    <div className="form-group">
                      <button type="submit">Submit</button>
                    </div>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </Dialog>

        <ConfirmDialog />

        <Toast ref={toast} />
      </div>
    </React.Fragment>
  );
}

export default App;
