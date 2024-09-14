import React, { useEffect, useRef, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Grid,
  Paper,
  Typography,
  Autocomplete,
  TextField,
} from "@mui/material";

import "../Accounts/style.css";
import PrintIcon from "@mui/icons-material/Print";
import CompanyProfile from "../../components/common/companyProfile/CompanyProfile";
import ReactToPrint from "react-to-print";
import axios from "axios";

import { API_URL } from "../../../config.json";
import { amountFormat, authHeaders } from "../../../utils";
import Swal from "sweetalert2";
import Button from "@mui/joy/Button";

const HouseKeepingItemStockReport = () => {
  const [loading, loadingSet] = useState(false);

  const reportRef = useRef();
  let [print, printSet] = useState(false);

  const [selectedFilterType, selectedFilterTypeSet] = useState({ type: "All" });

  //get with details expense:
  const [houseKeepingItemStockData, houseKeepingItemStockDataSet] = useState(
    []
  );
  const [items, itemsSet] = useState([]);
  const [selectedItem, selectedItemSet] = useState(null);
  const [categories, categoriesSet] = useState([]);
  const [selectedCategory, selectedCategorySet] = useState(null);

  useEffect(() => {
    selectedItemSet(null);
    selectedCategorySet(null);
  }, [selectedFilterType]);

  const [totalStock, totalStockSet] = useState(0);
  const [totalStockValue, totalStockValueSet] = useState(0);

  useEffect(() => {
    const total = houseKeepingItemStockData.reduce(
      (prev, curr) => prev + parseFloat(curr.currentStock),
      0
    );
    totalStockSet(total);
  }, [houseKeepingItemStockData]);
  useEffect(() => {
    const total = houseKeepingItemStockData.reduce(
      (prev, curr) => prev + parseFloat(curr.stockValue),
      0
    );
    totalStockValueSet(total);
  }, [houseKeepingItemStockData]);

  let ReportDom = React.forwardRef((props, ref) => {
    return (
      <div ref={ref} className="-mt-4">
        <span className="print-source">
          <CompanyProfile />
        </span>

        {/* data table */}
        {print && (
          <div className="print-content p-4">
            <TableContainer className="report-dom">
              <Table size="small" aria-label="a dense table">
                <TableHead>
                  <TableRow>
                    <TableCell align="left" width={"1%"}>
                      SL
                    </TableCell>
                    <TableCell align="left" width={"3%"}>
                      ITEM NAME
                    </TableCell>
                    <TableCell align="left" width={"3%"}>
                      CATEGORY NAME
                    </TableCell>
                    <TableCell align="left" width={"3%"}>
                      UNIT NAME
                    </TableCell>
                   
                    <TableCell align="right" width={"4%"}>
                      CURRENT STOCK
                    </TableCell>
                    <TableCell align="right" width={"3%"}>
                      COST
                    </TableCell>
                    <TableCell align="right" width={"5%"}>
                      STOCK VALUE
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {houseKeepingItemStockData.map((stockItem, inx) => (
                    <>
                      <TableRow>
                        <TableCell style={{ textAlign: "left" }}>
                          {inx + parseFloat(1)}
                        </TableCell>
                        <TableCell style={{ textAlign: "left" }}>
                          {stockItem.item.name}
                        </TableCell>
                        <TableCell style={{ textAlign: "left" }}>
                          {stockItem.item.category.name}
                        </TableCell>
                        <TableCell style={{ textAlign: "left" }}>
                          {stockItem.item.unit.name}
                        </TableCell>

                        <TableCell style={{ textAlign: "right" }}>
                          {stockItem.currentStock}
                        </TableCell>
                        <TableCell style={{ textAlign: "right" }}>
                          {amountFormat(parseFloat(stockItem.cost).toFixed(2))}
                        </TableCell>
                        <TableCell style={{ textAlign: "right" }}>
                          {amountFormat(
                            parseFloat(stockItem.stockValue).toFixed(2)
                          )}
                        </TableCell>
                      </TableRow>
                    </>
                  ))}
                  <TableRow>
                    <TableCell colSpan={4}></TableCell>
                    <TableCell style={{ textAlign: "right" }}>
                      {amountFormat(parseFloat(totalStock).toFixed(2))}
                    </TableCell>
                    <TableCell colSpan={1}></TableCell>
                    <TableCell style={{ textAlign: "right" }}>
                      {amountFormat(parseFloat(totalStockValue).toFixed(2))}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        )}
      </div>
    );
  });

  //handle report:
  const handleReport = () => {
    getItemStockReport();
    printSet(true);
  };
  const getItemStockReport = async () => {
    try {
      loadingSet(true);
      const response = await axios.get(
        `${API_URL}api/v1/Inventory/get-housekeeping-item-stock-report`,
        {
          headers: authHeaders,
          params: {
            CategoryId: selectedCategory != null ? selectedCategory.id : null,
            ItemId: selectedItem != null ? selectedItem.id : null,
          },
        }
      );
      houseKeepingItemStockDataSet(response.data.report);
      loadingSet(false);
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
    getItems();
    getCategories();
  }, []);

  const getItems = async () => {
    try {
      const response = await axios.get(`${API_URL}api/v1/HouseKeepingItem`, {
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

  const getCategories = async () => {
    try {
      const response = await axios.get(
        `${API_URL}api/v1/HouseKeepingItemCategory`,
        {
          headers: authHeaders,
        }
      );
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

  const filterType = [
    { type: "All" },
    { type: "By Item" },
    { type: "By Category" },
  ];
  const recordType = [{ type: "With Details" }, { type: "Without Details" }];

  return (
    <div>
      <Paper className="m-3 p-3">
        <Typography
          variant="h6"
          className="MuiTypography-h6 mb-3"
          style={{ marginBottom: "8px" }}
        >
          HOUSE KEEPING ITEM STOCK REPORT
        </Typography>

        <Grid
          container
          spacing={3}
          style={{ paddingBottom: "5px", paddingTop: "5px" }}
        >
          <Grid item xs={12} md={3} sm={2}>
            <Autocomplete
              autoHighlight={true}
              openOnFocus={true}
              size="small"
              id="combo-box-filter"
              options={filterType}
              value={selectedFilterType}
              onChange={(e, value) => {
                selectedFilterTypeSet(value);
              }}
              getOptionLabel={(option) => option.type}
              fullWidth
              renderInput={(params) => (
                <TextField {...params} label="FILTER TYPE" />
              )}
            />
          </Grid>

          {selectedFilterType != null &&
            selectedFilterType.type === "By Item" && (
              <Grid item xs={12} md={3} sm={2}>
                <Autocomplete
                  autoHighlight={true}
                  openOnFocus={true}
                  size="small"
                  id="combo-box-filter"
                  options={items}
                  value={selectedItem}
                  onChange={(e, value) => {
                    selectedItemSet(value);
                  }}
                  getOptionLabel={(option) => option.name}
                  fullWidth
                  renderInput={(params) => (
                    <TextField {...params} label="SELECT ITEM" />
                  )}
                />
              </Grid>
            )}
          {selectedFilterType != null &&
            selectedFilterType.type === "By Category" && (
              <Grid item xs={12} md={3} sm={2}>
                <Autocomplete
                  autoHighlight={true}
                  openOnFocus={true}
                  size="small"
                  id="combo-box-filter"
                  options={categories}
                  value={selectedCategory}
                  onChange={(e, value) => {
                    selectedCategorySet(value);
                  }}
                  getOptionLabel={(option) => option.name}
                  fullWidth
                  renderInput={(params) => (
                    <TextField {...params} label="SELECT CATEGORY" />
                  )}
                />
              </Grid>
            )}

          <Grid item xs={12} sm={2}>
            <Button
              onClick={() => handleReport()}
              variant="outlined"
              loading={loading}
              style={{ background: "black", color: "white" }}
            >
              Report
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {print ? (
        <Grid container>
          <Grid item xs={12} sm={12} className="mx-3 p-3">
            <Paper
              style={{
                borderRadius: "0px",
                paddingLeft: "10px",
                marginTop: "-18px",
              }}
            >
              <ReactToPrint
                trigger={() => (
                  <button>
                    <PrintIcon />
                  </button>
                )}
                content={() => reportRef.current}
              />
            </Paper>
          </Grid>
        </Grid>
      ) : (
        ""
      )}

      <ReportDom ref={reportRef} />
    </div>
  );
};

export default HouseKeepingItemStockReport;
