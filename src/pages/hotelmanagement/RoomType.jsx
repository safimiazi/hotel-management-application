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
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";

import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { mkConfig, generateCsv, download } from "export-to-csv";
import { Autocomplete, Typography } from "@mui/material";

const csvConfig = mkConfig({
  fieldSeparator: ",",
  decimalSeparator: ".",
  useKeysAsHeaders: true,
});

const RoomType = () => {
  const typeRef = useRef(null);
  const betQtyRef = useRef(null);
  const fareRef = useRef(null);
  const adultCapacityRef = useRef(null);
  const childCapacityRef = useRef(null);
  const descriptionRef = useRef(null);
  const cancellationPolicyRef = useRef(null);
  const amenityIdsRef = useRef(null);
  const facilityIdsRef = useRef(null);
  const [selectedFormData, selectedFormDataSet] = useState({
    type: "",
    betQty: 0,
    fare: 0,
    adultCapacity: 0,
    childCapacity: 0,
    description: "",
    cancellationPolicy: "",
  });
  const [selectFacilityId, selectFacilityIdSet] = useState([]);
  const [selectAmenityId, selectAmenityIdSet] = useState([]);
  const [facilities, facilitiesSet] = useState([]);
  const [amenities, amenitiesSet] = useState([]);
  const [roomTypes, roomTypesSet] = useState([]);
  const [id, idSet] = useState(null);
  const [isSaving, isSavingSet] = useState(false);
  const [action, actionSet] = useState("post");

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
      accessorKey: "type",
      header: "TYPE",
      size: 50,
    },
    {
      accessorKey: "betQty",
      header: "BET QTY",
      size: 50,
    },
    {
      accessorKey: "fare",
      header: "FARE",
      size: 50,
    },
    {
      accessorKey: "adultCapacity",
      header: "ADULT CAPACITY",
      size: 50,
    },
    {
      accessorKey: "childCapacity",
      header: "CHILD CAPACITY",
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
    let data = roomTypes;
    if (data.length == 0) return false;
    const csv = generateCsv(csvConfig)(
      data.map((row) => {
        return {
          type: row.type,
          betQty: row.betQty,
          fare: row.fare,
          adultCapacity: row.adultCapacity,
          childCapacity: row.childCapacity,
          creator: row.creator?.userName,
          updater: row.updater?.userName,
        };
      })
    );
    download(csvConfig)(csv);
  };

  const resetForm = () => {
    actionSet("post");
    selectedFormDataSet({
      type: "",
      betQty: 0,
      fare: 0,
      adultCapacity: 0,
      childCapacity: 0,
      description: "",
      cancellationPolicy: "",
    });
    selectAmenityIdSet([]);
    selectFacilityIdSet([]);
  };

  const handleUpdate = (row) => {
    idSet(row.id);
    actionSet("put");
    selectedFormDataSet({
      type: row.type,
      betQty: row.betQty,
      fare: row.fare,
      adultCapacity: row.adultCapacity,
      childCapacity: row.childCapacity,
      description: row.description,
      cancellationPolicy: row.cancellationPolicy,
    });

    selectAmenityIdSet(row.roomTypeAmenities.map((item) => item.amenity.id));
    selectFacilityIdSet(row.roomTypeFacilities.map((item) => item.facility.id));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    selectedFormDataSet({ ...selectedFormData, [name]: value });
  };

  const table = useMaterialReactTable({
    columns,
    data: roomTypes,
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

  useEffect(() => {
    getRoomTypes();
    getAmenities();
    getFacilities();
  }, []);

  const getAmenities = async () => {
    try {
      const response = await axios.get(`${API_URL}api/v1/Amenity`, {
        headers: authHeaders,
      });
      amenitiesSet(response.data);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Failed Load Data! Please try again later.",
        confirmButtonText: "OK",
      });
    }
  };

  const getFacilities = async () => {
    try {
      const response = await axios.get(`${API_URL}api/v1/Facility`, {
        headers: authHeaders,
      });
      facilitiesSet(response.data);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Failed Load Data! Please try again later.",
        confirmButtonText: "OK",
      });
    }
  };

  // RoomType CRUD Operations
  const getRoomTypes = async () => {
    try {
      const response = await axios.get(`${API_URL}api/v1/RoomType`, {
        headers: authHeaders,
      });
      roomTypesSet(response.data);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Failed Load Data! Please try again later.",
        confirmButtonText: "OK",
      });
    }
  };

  const postRoomType = async () => {
    if (selectedFormData.type.trim() === "") {
      Swal.fire({
        title: "Type is Required.",
        icon: "warning",
      });
      return false;
    } else {
      const postData = {
        type: selectedFormData.type,
        betQty: parseInt(selectedFormData.betQty),
        fare: parseInt(selectedFormData.fare),
        adultCapacity: parseInt(selectedFormData.adultCapacity),
        childCapacity: parseInt(selectedFormData.childCapacity),
        description: selectedFormData.description,
        cancellationPolicy: selectedFormData.cancellationPolicy,
        amenityIds: selectAmenityId,
        facilityIds: selectFacilityId,
      };
      isSavingSet(true);
      try {
        let response;

        if (action == "post") {
          response = await axios.post(`${API_URL}api/v1/RoomType`, postData, {
            headers: authHeaders,
          });
        }

        if (action == "put") {
          response = await axios.put(
            `${API_URL}api/v1/RoomType/${id}`,
            postData,
            {
              headers: authHeaders,
            }
          );
        }

        // After Api Response

        Swal.fire({
          icon: "success",
          title: `${response.data.type} is ${
            action == "post" ? "Create" : "update"
          } Successfully`,
          text: "Premium Service added successfully",
        });
        resetForm();
        getRoomTypes();
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
            `${API_URL}api/v1/RoomType/${row.id}`,
            { headers: authHeaders },
            { id: row.id }
          );
          Swal.fire({
            icon: "success",
            title: `${response.data.type} is deleted Successfully`,
          });
          resetForm();
          getRoomTypes();
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

  // Start handle Enter event function

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      if (e.target === typeRef.current) {
        betQtyRef.current.focus();
      } else if (e.target === betQtyRef.current) {
        fareRef.current.focus();
      } else if (e.target === fareRef.current) {
        adultCapacityRef.current.focus();
      } else if (e.target === adultCapacityRef.current) {
        childCapacityRef.current.focus();
      } else if (e.target === childCapacityRef.current) {
        descriptionRef.current.focus();
      } else if (e.target === descriptionRef.current) {
        cancellationPolicyRef.current.focus();
      } else if (e.target === cancellationPolicyRef.current) {
        amenityIdsRef.current.focus();
      } else if (e.target === amenityIdsRef.current) {
        facilityIdsRef.current.focus();
      } else if (e.target === facilityIdsRef.current) {
        postRoomType();
      }
    }
  };

  // End handle Enter event function

  return (
    <>
      <Paper className="m-3 p-3">
        <Typography
          variant="h6"
          className="MuiTypography-h6 mb-3"
          style={{ marginBottom: "8px" }}
        >
          ROOM TYPE ENTRY
        </Typography>
        <Grid container spacing={3}>
          {/* type form */}
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              label="TYPE"
              name="type"
              autoComplete="off"
              size="small"
              inputRef={typeRef}
              onKeyDown={handleKeyPress}
              fullWidth
              value={selectedFormData.type}
              onChange={handleChange}
            />
          </Grid>

          {/* betQty form */}
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              label="BET QTY"
              name="betQty"
              autoComplete="off"
              size="small"
              type="number"
              inputRef={betQtyRef}
              onFocus={() => betQtyRef.current.select()}
              onKeyDown={handleKeyPress}
              fullWidth
              value={selectedFormData.betQty}
              onChange={(e) => {
                if (0 > e.target.value) {
                  return false;
                }
                selectedFormDataSet({
                  ...selectedFormData,
                  betQty: e.target.value,
                });
              }}
              onBlur={(e) => {
                if (e.target.value === "" || parseFloat(e.target.value) < 0) {
                  selectedFormDataSet({ ...selectedFormData, betQty: 0 });
                }
              }}
            />
          </Grid>

          {/* fare */}
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              label="FARE"
              name="fare"
              autoComplete="off"
              size="small"
              type="number"
              inputRef={fareRef}
              onFocus={() => fareRef.current.select()}
              onKeyDown={handleKeyPress}
              fullWidth
              value={selectedFormData.fare}
              onChange={(e) => {
                if (0 > e.target.value) {
                  return false;
                }
                selectedFormDataSet({
                  ...selectedFormData,
                  fare: e.target.value,
                });
              }}
              onBlur={(e) => {
                if (e.target.value === "" || parseFloat(e.target.value) < 0) {
                  selectedFormDataSet({ ...selectedFormData, fare: 0 });
                }
              }}
            />
          </Grid>

          {/* adultCapacity */}
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              label="ADULT CAPACITY"
              name="adultCapacity"
              autoComplete="off"
              size="small"
              type="number"
              inputRef={adultCapacityRef}
              onFocus={() => adultCapacityRef.current.select()}
              onKeyDown={handleKeyPress}
              fullWidth
              value={selectedFormData.adultCapacity}
              onChange={(e) => {
                if (0 > e.target.value) {
                  return false;
                }
                selectedFormDataSet({
                  ...selectedFormData,
                  adultCapacity: e.target.value,
                });
              }}
              onBlur={(e) => {
                if (e.target.value === "" || parseFloat(e.target.value) < 0) {
                  selectedFormDataSet({
                    ...selectedFormData,
                    adultCapacity: 0,
                  });
                }
              }}
            />
          </Grid>

          {/* childCapacity */}
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              label="CHILD CAPACITY"
              name="childCapacity"
              autoComplete="off"
              size="small"
              type="number"
              inputRef={childCapacityRef}
              onFocus={() => childCapacityRef.current.select()}
              fullWidth
              onKeyDown={handleKeyPress}
              value={selectedFormData.childCapacity}
              onChange={(e) => {
                if (0 > e.target.value) {
                  return false;
                }
                selectedFormDataSet({
                  ...selectedFormData,
                  childCapacity: e.target.value,
                });
              }}
              onBlur={(e) => {
                if (e.target.value === "" || parseFloat(e.target.value) < 0) {
                  selectedFormDataSet({
                    ...selectedFormData,
                    childCapacity: 0,
                  });
                }
              }}
            />
          </Grid>

          {/* description */}
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              label="DESCRIPTION"
              name="description"
              autoComplete="off"
              size="small"
              inputRef={descriptionRef}
              onKeyDown={handleKeyPress}
              fullWidth
              value={selectedFormData.description}
              onChange={handleChange}
            />
          </Grid>

          {/* cancellationPolicy */}
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              label="CANCELATION POLICY"
              name="cancellationPolicy"
              autoComplete="off"
              size="small"
              inputRef={cancellationPolicyRef}
              onKeyDown={handleKeyPress}
              fullWidth
              value={selectedFormData.cancellationPolicy}
              onChange={handleChange}
            />
          </Grid>

          {/* amenityIds */}
          <Grid item xs={12} sm={6} md={3}>
            <Autocomplete
              autoHighlight={true}
              openOnFocus={true}
              multiple
              id="tags-outlined"
              options={amenities}
              size="small"
              onKeyDown={handleKeyPress}
              getOptionLabel={(option) => option.title}
              value={amenities.filter((item) =>
                selectAmenityId.includes(item.id)
              )}
              onChange={(e, value) => {
                const ids = value.map((option) => option.id);
                selectAmenityIdSet(ids);
              }}
              filterSelectedOptions
              fullWidth
              renderInput={(params) => (
                <TextField
                  inputRef={amenityIdsRef}
                  {...params}
                  variant="outlined"
                  label="SELECT AMENITIES"
                  placeholder="Favorites"
                />
              )}
            />
          </Grid>
          {/* facilityIds */}
          <Grid item xs={12} sm={6} md={3}>
            <Autocomplete
              autoHighlight={true}
              openOnFocus={true}
              multiple
              id="tags-outlined"
              size="small"
              options={facilities}
              getOptionLabel={(option) => option.title}
              value={facilities.filter((item) =>
                selectFacilityId.includes(item.id)
              )}
              onChange={(e, value) => {
                const ids = value.map((option) => option.id);
                selectFacilityIdSet(ids);
              }}
              filterSelectedOptions
              fullWidth
              renderInput={(params) => (
                <TextField
                  onKeyDown={handleKeyPress}
                  inputRef={facilityIdsRef}
                  {...params}
                  variant="outlined"
                  label="SELECT FACILITIES"
                  placeholder="Favorites"
                />
              )}
            />
          </Grid>
        </Grid>
        <Stack direction="row" spacing={2}>
          <Button
            variant="outlined"
            style={{ margin: "15px", color: "green" }}
            loading={isSaving}
            onClick={() => postRoomType()}
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
          ROOM TYPE LIST
        </Typography>
        <MaterialReactTable table={table} />
      </Paper>
    </>
  );
};

export default RoomType;
