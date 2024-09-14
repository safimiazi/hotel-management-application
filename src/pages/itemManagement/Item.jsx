import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { authHeaders } from "../../../utils";
import { API_URL } from "../../../config.json";
import Swal from "sweetalert2";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Button from "@mui/joy/Button";
import Stack from "@mui/material/Stack";
import EditNoteIcon from "@mui/icons-material/EditNote";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import AddIcon from "@mui/icons-material/Add";

import { Modal } from "react-responsive-modal";
import "react-responsive-modal/styles.css";

import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";

import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { mkConfig, generateCsv, download } from "export-to-csv";
import {
  Autocomplete,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

const csvConfig = mkConfig({
  fieldSeparator: ",",
  decimalSeparator: ".",
  useKeysAsHeaders: true,
});

const Item = () => {
  const itemRef = useRef(null);
  const qtyRef = useRef(null);
  const [selectedUnit, selectedUnitSet] = useState(null);
  const [selectedCategory, selectedCategorySet] = useState(null);
  const [units, unitsSet] = useState([]);
  const [categories, categoriesSet] = useState([]);
  const [totalQty, totalQtySet] = useState(0);

  //partial
  const [cartData, cartDataSet] = useState([]);

  const [selectedQty, selectedQtySet] = useState(0);
  const [selectedItem, selectedItemSet] = useState(null);
  //inx for edit
  const [cartIndex, cartIndexSet] = useState(null);

  const [id, idSet] = useState(null);
  const [isSaving, isSavingSet] = useState(false);
  const [action, actionSet] = useState("post");
  const [assignMaterialModal, assignMaterialModalSet] = useState(false);

  const [itemFormData, itemFormDataSet] = useState({
    code: "",
    name: "",
    saleRate: 0,
    purchaseRate: 0,
    openingQty: 0,
    openingRate: 0,
    description: "",
  });
  const [items, itemsSet] = useState([]);

  const columns = [
    {
      header: "ACTIONS",
      size: 100,
      Cell: ({ row }) => (
        <div className="flex gap-8 items-center">
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
      accessorKey: "name",
      header: "NAME",
      size: 50,
    },
    {
      accessorKey: "openingQty",
      header: "OPENING QTY",
      size: 50,
    },
    {
      accessorKey: "openingRate",
      header: "OPENING RATE",
      size: 50,
    },
    // {
    //   accessorKey: "purchaseRate",
    //   header: "PURCHASE RATE",
    //   size: 50,
    // },
    // {
    //   accessorKey: "saleRate",
    //   header: "SALE RATE",
    //   size: 50,
    // },
    {
      header: "CATEGORY NAME",
      size: 100,
      Cell: ({ row }) => <>{row.original.category.name}</>,
    },
    {
      header: "UNIT NAME",
      size: 100,
      Cell: ({ row }) => <>{row.original.unit.name}</>,
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

  const handleChange = (event) => {
    const { name, value } = event.target;
    itemFormDataSet({ ...itemFormData, [name]: value });
  };

  const handleExportData = () => {
    let data = items;
    if (data.length == 0) return false;
    const csv = generateCsv(csvConfig)(
      data.map((row) => {
        return {
          name: row.name,
          openingQty: row.openingQty,
          openingRate: row.openingRate,
          // purchaseRate: row.purchaseRate,
          // saleRate: row.saleRate,
          categoryname: row.category.name,
          unitname: row.unit.name,
          creator: row.creator?.userName,
          updater: row.updater?.userName,
        };
      })
    );
    download(csvConfig)(csv);
  };

  const resetForm = () => {
    itemFormDataSet({
      code: "",
      name: "",
      saleRate: 0,
      purchaseRate: 0,
      openingQty: 0,
      openingRate: 0,
      description: "",
    });
    selectedUnitSet(null);
    selectedCategorySet(null);
    actionSet("post");
    idSet(null);
  };

  const handleUpdate = (row) => {
    idSet(row.id);
    actionSet("put");
    itemFormDataSet({
      ...itemFormData,
      code: row.code,
      name: row.name,
      saleRate: row.saleRate,
      purchaseRate: row.purchaseRate,
      openingQty: row.openingQty,
      openingRate: row.openingRate,
      description: row.description,
    });
    selectedUnitSet(row.unit);
    selectedCategorySet(row.category);
  };

  const table = useMaterialReactTable({
    columns,
    data: items,
    columnFilterDisplayMode: "popover",
    paginationDisplayMode: "pages",
    positionToolbarAlertBanner: "bottom",
    muiTableRowCellProps: {
      sx: {
        fontWeight: "normal",
        fontSize: "5px",
      },
    },
    title: "Hello",
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
    initialState: { density: "compact" },
  });

  // table end

  const postitem = async () => {
    if (itemFormData.name.trim() === "") {
      Swal.fire({
        title: "Name is Required.",
        icon: "warning",
      });
    } else if (selectedUnit === null) {
      Swal.fire({
        title: "Unit is Required.",
        icon: "warning",
      });
    } else if (selectedCategory === null) {
      Swal.fire({
        title: "Category is Required.",
        icon: "warning",
      });
    } else {
      const itemData = {
        itemSaveReqDto: {
          ...itemFormData,
          unitId: selectedUnit.id,
          categoryId: selectedCategory.id,
        },
        assignItemSaveReqDto: cartData.map((cartItem) => ({
          itemId: cartItem.itemId,
          qty: cartItem.qty,
        })),
      };

      isSavingSet(true);
      try {
        let response;

        if (action == "post") {
          response = await axios.post(`${API_URL}api/v1/Item`, itemData, {
            headers: authHeaders,
          });
        }

        if (action == "put") {
          response = await axios.put(`${API_URL}api/v1/Item/${id}`, itemData, {
            headers: authHeaders,
          });
        }

        // After Api Response

        Swal.fire({
          icon: "success",
          title: `${response.data.name} is ${
            action == "post" ? "Create" : "update"
          } Successfully`,
          text: "Item added successfully",
        });
        resetForm();
        getItems();
      } catch (error) {
        if (
          error.response.status === 409 &&
          error.response.statusText === "Conflict"
        ) {
          Swal.fire({
            icon: "error",
            title: "Conflict!",
            text: `${error.response.data}`,
            confirmButtonText: "OK",
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Error!",
            text: "Failed! Please try again later.",
            confirmButtonText: "OK",
          });
        }
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
            `${API_URL}api/v1/Item/${row.id}`,
            { headers: authHeaders },
            { id: row.id }
          );
          Swal.fire({
            icon: "success",
            title: `${response.data.name} is deleted Successfully`,
          });
          resetForm();
          getItems();
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
  const nameRef = useRef(null);
  const codeRef = useRef(null);
  const saleRateRef = useRef(null);
  const purchaseRateRef = useRef(null);
  const openingQtyRef = useRef(null);
  const openingRateRef = useRef(null);
  const descriptionRef = useRef(null);
  const unitRef = useRef(null);
  const categoryRef = useRef(null);
  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      if (event.target === codeRef.current) {
        nameRef.current.focus();
      } else if (event.target === nameRef.current) {
        saleRateRef.current.focus();
      } else if (event.target === saleRateRef.current) {
        purchaseRateRef.current.focus();
      } else if (event.target === purchaseRateRef.current) {
        openingQtyRef.current.focus();
      } else if (event.target === openingQtyRef.current) {
        openingRateRef.current.focus();
      } else if (event.target === openingRateRef.current) {
        descriptionRef.current.focus();
      } else if (event.target === descriptionRef.current) {
        unitRef.current.focus();
      } else if (event.target === unitRef.current) {
        categoryRef.current.focus();
      } else if (event.target === categoryRef.current) {
        postitem();
      } else if (event.target === itemRef.current) {
        qtyRef.current.focus();
      } else if (event.target === qtyRef.current) {
        handleCart();
      }
    }
  };

  const handleCart = () => {
    if (selectedItem === null) {
      Swal.fire({
        title: "Item is Required.",
        icon: "warning",
      });
    } else if (selectedQty === 0) {
      Swal.fire({
        title: "Qty is Required.",
        icon: "warning",
      });
    } else {
      const cartItem = {
        itemName: selectedItem.name,
        itemId: selectedItem.id,
        qty: selectedQty,
      };

      const isExist = cartData.findIndex((item) => {
        if (item.itemId === selectedItem.id) {
          return true;
        } else {
          return false;
        }
      });

      if (isExist > -1 && cartIndex != null) {
        const updatedCartData = [...cartData];
        updatedCartData[cartIndex] = cartItem;
        cartDataSet(updatedCartData);
        cartIndexSet(null);
      } else {
        cartDataSet([...cartData, cartItem]);
      }

      selectedItemSet(null);
      selectedQtySet(0);
    }
  };
  useEffect(() => {
    const totalQty = cartData.reduce(
      (prev, curr) => prev + parseFloat(curr.qty),
      0
    );
    totalQtySet(totalQty);
  }, [cartData]);

  const handleCartDelete = (inx) => {
    const filteredData = cartData.filter((item, index) => index != inx);
    cartDataSet(filteredData);
  };

  const handleCartEdit = (cartItem, inx) => {
    selectedItemSet({ name: cartItem.itemName, id: cartItem.itemId });
    selectedQtySet(cartItem.qty);

    cartIndexSet(inx);
  };

  useEffect(() => {
    getUnits();
    getCategories();
    getItems();
  }, []);

  // itemCategory CRUD Operations
  const getCategories = async () => {
    try {
      const response = await axios.get(`${API_URL}api/v1/ItemCategory`, {
        headers: authHeaders,
      });
      categoriesSet(response.data);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Failed Load Data! Please try again later.",
        confirmButtonText: "OK",
      });
    }
  };

  const getUnits = async () => {
    try {
      const response = await axios.get(`${API_URL}api/v1/ItemUnit`, {
        headers: authHeaders,
      });
      unitsSet(response.data);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Failed Load Data! Please try again later.",
        confirmButtonText: "OK",
      });
    }
  };
  const getItems = async () => {
    try {
      const response = await axios.get(`${API_URL}api/v1/Item`, {
        headers: authHeaders,
      });
      itemsSet(response.data);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Failed Load Data! Please try again later.",
        confirmButtonText: "OK",
      });
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
          ITEM ENTRY
        </Typography>
        <Grid
          container
          spacing={3}
          rowSpacing={2}
          columnSpacing={{ xs: 1, sm: 2, md: 3 }}
        >
          <Grid item xs={12} sm={2} md={3}>
            <TextField
              label="CODE"
              name="code"
              autoComplete="off"
              size="small"
              fullWidth
              onKeyDown={handleKeyPress}
              value={itemFormData.code}
              onChange={handleChange}
              inputRef={codeRef}
            />
          </Grid>
          <Grid item xs={12} sm={2} md={3}>
            <TextField
              label="NAME"
              name="name"
              autoComplete="off"
              size="small"
              fullWidth
              onKeyDown={handleKeyPress}
              value={itemFormData.name}
              onChange={handleChange}
              inputRef={nameRef}
            />
          </Grid>
          <Grid item xs={12} sm={2} md={3}>
            <TextField
              label="SALE RATE"
              name="saleRate"
              autoComplete="off"
              size="small"
              fullWidth
              type="number"
              onKeyDown={handleKeyPress}
              value={itemFormData.saleRate}
              onChange={(e) => {
                if (0 > e.target.value) {
                  return false;
                }
                itemFormDataSet({ ...itemFormData, saleRate: e.target.value });
              }}
              onBlur={(e) => {
                if (e.target.value === "" || parseFloat(e.target.value) < 0) {
                  itemFormDataSet({ ...itemFormData, saleRate: 0 });
                }
              }}
              inputRef={saleRateRef}
              onFocus={() => saleRateRef.current.select()}
            />
          </Grid>

          <Grid item xs={12} sm={2} md={3}>
            <TextField
              label="PURCHASE RATE"
              name="purchaseRate"
              autoComplete="off"
              size="small"
              fullWidth
              type="number"
              onKeyDown={handleKeyPress}
              value={itemFormData.purchaseRate}
              onChange={(e) => {
                if (0 > e.target.value) {
                  return false;
                }
                itemFormDataSet({
                  ...itemFormData,
                  purchaseRate: e.target.value,
                });
              }}
              onBlur={(e) => {
                if (e.target.value === "" || parseFloat(e.target.value) < 0) {
                  itemFormDataSet({ ...itemFormData, purchaseRate: 0 });
                }
              }}
              inputRef={purchaseRateRef}
              onFocus={() => purchaseRateRef.current.select()}
            />
          </Grid>

          <Grid item xs={12} sm={2} md={3}>
            <TextField
              label="OPENING QTY"
              name="openingQty"
              autoComplete="off"
              size="small"
              fullWidth
              type="number"
              onKeyDown={handleKeyPress}
              value={itemFormData.openingQty}
              onChange={(e) => {
                if (0 > e.target.value) {
                  return false;
                }
                itemFormDataSet({
                  ...itemFormData,
                  openingQty: e.target.value,
                });
              }}
              onBlur={(e) => {
                if (e.target.value === "" || parseFloat(e.target.value) < 0) {
                  itemFormDataSet({ ...itemFormData, openingQty: 0 });
                }
              }}
              inputRef={openingQtyRef}
              onFocus={() => openingQtyRef.current.select()}
            />
          </Grid>
          <Grid item xs={12} sm={2} md={3}>
            <TextField
              label="OPENING RATE"
              name="openingRate"
              autoComplete="off"
              size="small"
              fullWidth
              type="number"
              onKeyDown={handleKeyPress}
              value={itemFormData.openingRate}
              onChange={(e) => {
                if (0 > e.target.value) {
                  return false;
                }
                itemFormDataSet({
                  ...itemFormData,
                  openingRate: e.target.value,
                });
              }}
              onBlur={(e) => {
                if (e.target.value === "" || parseFloat(e.target.value) < 0) {
                  itemFormDataSet({ ...itemFormData, openingRate: 0 });
                }
              }}
              inputRef={openingRateRef}
              onFocus={() => openingRateRef.current.select()}
            />
          </Grid>

          <Grid item xs={12} sm={2} md={3}>
            <TextField
              label="DESCRIPTION"
              name="description"
              autoComplete="off"
              size="small"
              fullWidth
              onKeyDown={handleKeyPress}
              value={itemFormData.description}
              onChange={handleChange}
              inputRef={descriptionRef}
            />
          </Grid>

          <Grid item xs={12} sm={2} md={3}>
            <Autocomplete
              autoHighlight={true}
              openOnFocus={true}
              size="small"
              id="combo-box-item-unit"
              options={units}
              value={selectedUnit}
              onKeyDown={handleKeyPress}
              onChange={(e, obj) => selectedUnitSet(obj)}
              getOptionLabel={(option) => option.name}
              fullWidth
              renderInput={(params) => (
                <TextField inputRef={unitRef} {...params} label="SELECT UNIT" />
              )}
            />
          </Grid>

          <Grid item xs={12} sm={2} md={3}>
            <Autocomplete
              autoHighlight={true}
              openOnFocus={true}
              size="small"
              id="combo-box-item-category"
              options={categories}
              value={selectedCategory}
              onKeyDown={handleKeyPress}
              onChange={(e, obj) => selectedCategorySet(obj)}
              getOptionLabel={(option) => option.name}
              fullWidth
              renderInput={(params) => (
                <TextField
                  inputRef={categoryRef}
                  {...params}
                  label="SELECT CATEGORY"
                />
              )}
            />
          </Grid>
          {items.length > 0 && (
            <Grid
              item
              xs={12}
              sm={2}
              md={3}
              style={{ marginTop: "10px", cursor: "pointer" }}
            >
              <AddIcon onClick={() => assignMaterialModalSet(true)} />
            </Grid>
          )}
        </Grid>
        <Stack direction="row" spacing={2}>
          <Button
            variant="outlined"
            style={{ margin: "15px", color: "green" }}
            loading={isSaving}
            onClick={() => postitem()}
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
          ITEM LIST
        </Typography>
        <MaterialReactTable table={table} />
      </Paper>

      {/* Modal */}

      <Modal
        open={assignMaterialModal}
        onClose={() => assignMaterialModalSet(false)}
        center
        style={{
          minWidth: "600px",
          minHeight: "500px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "20px",
        }}
      >
        <h5
          style={{
            margin: 0,
            padding: 0,
            fontWeight: "bold",
            marginBottom: "20px",
          }}
        >
          Assign Materials
        </h5>
        <Grid container spacing={2} justifyContent="center">
          <Grid item xs={12} sm={10}>
            <Autocomplete
              autoHighlight={true}
              openOnFocus={true}
              size="small"
              id="combo-box-item"
              options={items}
              onKeyDown={handleKeyPress}
              value={selectedItem}
              onChange={(e, obj) => selectedItemSet(obj)}
              getOptionLabel={(option) => option.name}
              fullWidth
              renderInput={(params) => (
                <TextField inputRef={itemRef} {...params} label="SELECT ITEM" />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={10}>
            <TextField
              label="QTY"
              name="qty"
              autoComplete="off"
              size="small"
              fullWidth
              type="number"
              onKeyDown={handleKeyPress}
              value={selectedQty}
              onChange={(e) => selectedQtySet(e.target.value)}
              inputRef={qtyRef}
              onFocus={() => qtyRef.current.select()}
            />
          </Grid>

          <Grid item xs={12} sm={10}>
            <Button
              onClick={() => handleCart()}
              style={{
                background: "black",
                color: "#ffffff",
                width: "100%",
              }}
              variant="contained"
            >
              {cartIndex != null ? "Edit" : "Add"}
            </Button>
          </Grid>
        </Grid>

        <br />

        <TableContainer style={{ marginTop: "20px", width: "100%" }}>
          <Table size="small" aria-label="a dense table">
            <TableHead>
              <TableRow>
                <TableCell align="left">SL</TableCell>
                <TableCell align="left">ITEM NAME</TableCell>
                <TableCell align="right">QTY</TableCell>
                <TableCell align="left">Edit</TableCell>
                <TableCell align="left">DELETE</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {/* Replace this with dynamic rows based on your data */}
              {cartData?.map((cartItem, inx) => (
                <TableRow>
                  <TableCell align="left">{inx + parseFloat(1)}</TableCell>
                  <TableCell align="left">{cartItem.itemName}</TableCell>
                  <TableCell align="right">{cartItem.qty}</TableCell>
                  <TableCell align="left">
                    <EditNoteIcon
                      style={{
                        color: "green",
                        cursor: "pointer",
                        display: isSaving ? "none" : "block",
                      }}
                      onClick={() => handleCartEdit(cartItem, inx)}
                    />
                  </TableCell>
                  <TableCell align="left">
                    <DeleteForeverIcon
                      style={{
                        color: "red",
                        cursor: "pointer",
                        display: isSaving ? "none" : "block",
                      }}
                      onClick={() => handleCartDelete(inx)}
                    />
                  </TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell colSpan={1} align="left"></TableCell>
                <TableCell align="left">TOTAL</TableCell>
                <TableCell align="right">{totalQty}</TableCell>
                <TableCell colSpan={2} align="left"></TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Modal>
    </>
  );
};

export default Item;
