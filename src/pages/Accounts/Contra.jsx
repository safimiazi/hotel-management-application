import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import ReceiptIcon from "@mui/icons-material/Receipt";
import { authHeaders, dateFormat } from "../../../utils";
import { API_URL } from "../../../config.json";
import Swal from "sweetalert2";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Button from "@mui/joy/Button";
import Stack from "@mui/material/Stack";
import EditNoteIcon from "@mui/icons-material/EditNote";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";

import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { mkConfig, generateCsv, download } from "export-to-csv";
import { Autocomplete, Typography } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { Textarea } from "@mui/joy";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DemoContainer, DemoItem } from "@mui/x-date-pickers/internals/demo";
import dayjs from "dayjs";

const csvConfig = mkConfig({
  fieldSeparator: ",",
  decimalSeparator: ".",
  useKeysAsHeaders: true,
});

const Contra = () => {
  const [contra, contraSet] = useState([]);

  const [totalRecordCount, totalRecordCountSet] = useState(0);
  const [selectedDate, selectedDateSet] = useState(dayjs());

  const [pagination, paginationSet] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const [tablesearchTerm, tableSearchTermSet] = useState("");

  const [selectedFromAccount, selectedFromAccountSet] = useState(null);
  const [selectedToAccount, selectedToAccountSet] = useState(null);
  const [amount, amountSet] = useState(0);
  const [note, noteSet] = useState("");

  const transRef = useRef(null);
  const fromAccountRef = useRef(null);
  const toAccountRef = useRef(null);
  const amountRef = useRef(null);
  const noteRef = useRef(null);
  const navigate = useNavigate();

  const [id, idSet] = useState(null);
  const [isSaving, isSavingSet] = useState(false);
  const [action, actionSet] = useState("post");
  const [transactionCode, transactionCodeSet] = useState("");

  const [accounts, accountsSet] = useState([]);

  const columns = [
    {
      header: "ACTIONS",
      size: 100,
      Cell: ({ row }) => (
        <div className="flex gap-3 items-center justify-around">
          <Link
            to={{
              pathname: `/accounts/contra-invoice/${row.original.id}`,
            }}
          >
            <ReceiptIcon
              style={{
                color: "blue",
                cursor: "pointer",
              }}
            />
          </Link>
          <div>
            <EditNoteIcon
              style={{
                color: "green",
                cursor: "pointer",
                display: isSaving ? "none" : "block",
              }}
              onClick={() => handleUpdate(row.original)}
            />
          </div>
          <div>
            <DeleteForeverIcon
              style={{
                color: "red",
                cursor: "pointer",
                display: isSaving ? "none" : "block",
              }}
              onClick={() => handleDelete(row.original)}
            />
          </div>
        </div>
      ),
    },
    {
      accessor: "sl",
      header: "SL",
      size: 10,
      Cell: ({ row }) => <>{row.index + parseFloat(1)}</>,
    },
    {
      accessor: "createdDate",
      header: "ENTRY DATE",
      size: 10,
      Cell: ({ row }) => (
        <>{dayjs(row.original.createdDate).format(dateFormat)}</>
      ),
    },
    {
      accessorKey: "transactionCode",
      header: "TRANSACTION CODE",
      size: 50,
    },
    {
      header: "FROM ACCOUNT",
      size: 100,
      Cell: ({ row }) => <div>{row.original.fromAccount.name}</div>,
    },
    {
      header: "TO ACCOUNT",
      size: 100,
      Cell: ({ row }) => <div>{row.original.toAccount.name}</div>,
    },
    {
      accessorKey: "amount",
      header: "AMOUNT",
      size: 50,
    },
    {
      accessorKey: "note",
      header: "NOTE",
      size: 50,
    },
    {
      accessorKey: "creator.userName",
      header: "CREATE BY",
      size: 20,
    },
    {
      accessorKey: "updater.userName",
      header: "UPDATE BY",
      size: 20,
    },
  ];

  const handleExportData = () => {
    let data = contra;
    if (data.length == 0) return false;
    const csv = generateCsv(csvConfig)(
      data.map((row) => {
        return {
          transactionCode: row.transactionCode,
          fromAccount: row.fromAccount.name,
          toAccount: row.toAccount.name,
          amount: row.amount,
          note: row.note,
          creator: row.creator?.userName,
          updater: row.updater?.userName,
        };
      })
    );
    download(csvConfig)(csv);
  };

  const resetForm = () => {
    actionSet("post");
    selectedFromAccountSet(null);
    selectedToAccountSet(null);
    amountSet(0);
    noteSet("");
    selectedDateSet(dayjs());

    transactionCodeSet("");
    getInvoiceCode();
  };

  const handleUpdate = (row) => {
    idSet(row.id);
    actionSet("put");
    selectedFromAccountSet(row.fromAccount);
    const parsedDate = dayjs(row.createdDate);
    selectedDateSet(parsedDate.isValid() ? parsedDate : null);
    selectedToAccountSet(row.toAccount);
    amountSet(row.amount);
    noteSet(row.note);
    transactionCodeSet(row.transactionCode);
  };

  // table end

  useEffect(() => {
    getAccounts();
    getInvoiceCode();
  }, []);

  const getInvoiceCode = async () => {
    try {
      const response = await axios.get(
        `${API_URL}api/v1/Contra/get-contra-transaction-code`,
        {
          headers: authHeaders,
        }
      );
      transactionCodeSet(response.data);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Failed Load Data! Please try again later.",
        confirmButtonText: "OK",
      });
    }
  };

  useEffect(() => {
    getContra();
  }, [pagination.pageIndex, pagination.pageSize, tablesearchTerm]);
  const [loading, loadingSet] = useState(false);

  const getContra = async () => {
    try {
      loadingSet(true);
      const response = await axios.get(`${API_URL}api/v1/Contra`, {
        headers: authHeaders,
        params: {
          SearchTerm:
            tablesearchTerm !== undefined && tablesearchTerm.trim() !== ""
              ? tablesearchTerm
              : null,
          PageSize: pagination.pageSize,
          PageNumber: pagination.pageIndex,
        },
      });
      contraSet(response.data.records);
      totalRecordCountSet(response.data.totalRecordCount);
      loadingSet(false);
    } catch (error) {}
  };

  const table = useMaterialReactTable({
    columns,
    data: contra,

    enableColumnOrdering: true, //enable a feature for all columns
    enableGlobalFilter: false, //turn off a feature
    manualPagination: true,
    onGlobalFilterChange: tableSearchTermSet,
    rowCount: Math.ceil(totalRecordCount / pagination.pageSize),
    pageCount: Math.ceil(totalRecordCount / pagination.pageSize),
    state: { pagination, isLoading: loading },
    showColumnFilters: true, //show filters by default

    onPaginationChange: paginationSet,
    muiPaginationProps: {
      showRowsPerPage: true,
      shape: "rounded",
    },
    paginationDisplayMode: "pages",
    muiTableRowCellProps: {
      sx: {
        fontWeight: "normal",
        fontSize: "5px",
      },
    },
    renderTopToolbarCustomActions: ({ table }) => (
      <Button
        //export all data that is currently in the table (ignore pagination, sorting, filtering, etc.)
        onClick={handleExportData}
        startIcon={<FileDownloadIcon />}
        size="sm"
        variant="outlined"
      >
        Export Data To CSV
      </Button>
    ),
  });

  // account CRUD Operations
  const getAccounts = async () => {
    try {
      const response = await axios.get(`${API_URL}api/v1/Account`, {
        headers: authHeaders,
      });
      accountsSet(response.data);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Failed Load Data! Please try again later.",
        confirmButtonText: "OK",
      });
    }
  };

  const postContra = async () => {
    const postData = {
      transactionCode: transactionCode,
      createdDate: selectedDate.format(dateFormat),

      fromAccountId: selectedFromAccount.id,
      toAccountId: selectedToAccount.id,
      amount: parseFloat(amount),
      note: note,
    };

    if (selectedFromAccount === null) {
      Swal.fire({
        title: "From Account is Required.",
        icon: "warning",
      });
    } else if (selectedToAccount === null) {
      Swal.fire({
        title: "To Account is Required.",
        icon: "warning",
      });
    } else if (selectedFromAccount.id === selectedToAccount.id) {
      Swal.fire({
        title: "From Account And To Account is Must Be Unique!",
        icon: "warning",
      });
    } else {
      isSavingSet(true);
      try {
        let response;

        if (action == "post") {
          response = await axios.post(`${API_URL}api/v1/Contra`, postData, {
            headers: authHeaders,
          });
        }

        if (action == "put") {
          response = await axios.put(
            `${API_URL}api/v1/Contra/${id}`,
            postData,
            {
              headers: authHeaders,
            }
          );
        }

        // After Api Response
        if (action === "post") {
          Swal.fire({
            title: `${response.data.transactionCode} is ${
              action == "post" ? "Create" : "update"
            } Successfully. Do you want to view the invoice?`,

            icon: "success",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonText: "No",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes",
          }).then((result) => {
            if (result.isConfirmed) {
              navigate(`/accounts/contra-invoice/${response.data.id}`);
            } else {
              resetForm();
              getAccounts();
              getContra();
            }
          });
        } else {
          Swal.fire({
            title: `${response.data.transactionCode} is update Successfully. Do you want to view the invoice?`,

            icon: "success",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonText: "No",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes",
          }).then((result) => {
            if (result.isConfirmed) {
              navigate(`/accounts/contra-invoice/${response.data.id}`);
            } else {
              resetForm();
              getAccounts();
              getContra();
            }
          });
        }
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error!",
          text: "Failed! Please try again later.",
          confirmButtonText: "OK",
        });
      }

      isSavingSet(false);
    }
  };

  const handleDelete = async (row) => {
    Swal.fire({
      title: `Are you sure delete this?`,
      icon: "warning",
      buttons: true,
    }).then(async (res) => {
      isSavingSet(true);
      try {
        if (res.isConfirmed) {
          let response = await axios.delete(
            `${API_URL}api/v1/Contra/${row.id}`,
            { headers: authHeaders },
            { id: row.id }
          );
          Swal.fire({
            icon: "success",
            title: `${response.data.transactionCode} is deleted Successfully`,
          });
          resetForm();
          getAccounts();
          getContra();
        }
      } catch (err) {
        Swal.fire({
          icon: "error",
          title: "Error!",
          text: "Failed ! Please try again later.",
          confirmButtonText: "OK",
        });
      }
      isSavingSet(false);
    });
  };

  // End CRUD Operations
  const dateRef = useRef(null);
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      if (e.target === transRef.current) {
        fromAccountRef.current.focus();
      } else if (e.target === fromAccountRef.current) {
        toAccountRef.current.focus();
      } else if (e.target === toAccountRef.current) {
        amountRef.current.focus();
      } else if (e.target === amountRef.current) {
        noteRef.current.focus();
      } else if (e.target === noteRef.current) {
        postContra();
      }
    }
  };
  return (
    <>
      <Paper className="m-3 p-3">
        <Typography
          variant="h6"
          className="MuiTypography-h6 mb-3"
          style={{ marginBottom: "8px" }}
        >
          CONTRA ENTRY
        </Typography>
        <Grid
          container
          spacing={3}
          rowSpacing={1}
          columnSpacing={{ xs: 1, sm: 2, md: 3 }}
        >
          <Grid item xs={12} md={2} sm={2} style={{ marginTop: "-8px" }}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer
                components={[
                  "DatePicker",
                  "DesktopDatePicker",
                  "MobileDatePicker",
                ]}
              >
                <DemoItem>
                  <DatePicker
                    inputRef={dateRef}
                    label="Created Date"
                    value={selectedDate}
                    onChange={(date) => selectedDateSet(date)}
                    format={dateFormat}
                    slotProps={{ field: { size: "small" } }}
                    renderInput={(params) => (
                      <TextField onKeyDown={handleKeyPress} {...params} />
                    )}
                  />
                </DemoItem>
              </DemoContainer>
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12} md={2} sm={2}>
            <TextField
              label="TRANSACTION CODE"
              name="transactionCode"
              autoComplete="off"
              size="small"
              inputRef={transRef}
              fullWidth
              onKeyDown={handleKeyPress}
              value={transactionCode}
              onChange={(e) => {
                transactionCodeSet(e.target.value);
              }}
            />
          </Grid>

          <Grid item xs={12} md={3} sm={2}>
            <Autocomplete
              autoHighlight={true}
              openOnFocus={true}
              size="small"
              id="combo-box-account"
              options={accounts}
              onKeyDown={handleKeyPress}
              value={selectedFromAccount}
              onChange={(e, value) => {
                selectedFromAccountSet(value);
              }}
              getOptionLabel={(option) => option.name}
              fullWidth
              renderInput={(params) => (
                <TextField
                  inputRef={fromAccountRef}
                  {...params}
                  label="SELECT FROM ACCOUNT "
                />
              )}
            />
          </Grid>
          <Grid item xs={12} md={3} sm={2}>
            <Autocomplete
              autoHighlight={true}
              openOnFocus={true}
              size="small"
              id="combo-box-account"
              options={accounts}
              onKeyDown={handleKeyPress}
              value={selectedToAccount}
              onChange={(e, value) => {
                selectedToAccountSet(value);
              }}
              getOptionLabel={(option) => option.name}
              fullWidth
              renderInput={(params) => (
                <TextField
                  inputRef={toAccountRef}
                  {...params}
                  label="SELECT TO ACCOUNT "
                />
              )}
            />
          </Grid>
          <Grid item xs={12} md={2} sm={2}>
            <TextField
              label="AMOUNT"
              name="amount"
              autoComplete="off"
              size="small"
              type="number"
              inputRef={amountRef}
              onFocus={() => amountRef.current.select()}
              fullWidth
              onKeyDown={handleKeyPress}
              value={amount}
              onChange={(e) => {
                if (0 > parseInt(e.target.value)) false;
                amountSet(e.target.value);
              }}
            />
          </Grid>
          {/* 
          <Grid item xs={12} md={3} sm={2}>
            <TextField
              label="NOTE"
              name="note"
              autoComplete="off"
              size="small"
              fullWidth
              inputRef={noteRef}
              onKeyDown={handleKeyPress}
              value={note}
              onChange={(e) => {
                noteSet(e.target.value);
              }}
            />
          </Grid> */}
          <Grid item xs={12} md={3} sm={2}>
            <Textarea
              style={{ width: "100%" }}
              // color="primary"
              minRows={2}
              placeholder="Note…"
              variant="outlined"
              inputRef={noteRef}
              onKeyDown={handleKeyPress}
              value={note}
              onChange={(e) => {
                noteSet(e.target.value);
              }}
            />
          </Grid>
        </Grid>
        <Stack direction="row" spacing={2}>
          <Button
            variant="outlined"
            style={{ margin: "15px", color: "green" }}
            loading={isSaving}
            onClick={() => postContra()}
          >
            {action == "post" ? "CREATE" : "UPDATE"}
          </Button>

          <Button
            variant="outlined"
            style={{ margin: "15px", color: "red", border: "1px solid red" }}
            size="sm"
            onClick={() => resetForm()}
          >
            RESET
          </Button>
        </Stack>
      </Paper>

      <Paper className="m-3">
        <Typography
          variant="h6"
          className="MuiTypography-h6 m-3"
          style={{ padding: "10px" }}
        >
          CONTRA LIST
        </Typography>
        <MaterialReactTable table={table} />
      </Paper>
    </>
  );
};

export default Contra;
