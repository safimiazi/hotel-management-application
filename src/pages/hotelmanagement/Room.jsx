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

const Room = () => {
  const [floors, floorsSet] = useState([]);
  const [roomTypes, roomTypesSet] = useState([]);
  const [roomNo, roomNoSet] = useState("");
  const [selectedRoomTypes, selectedRoomTypesSet] = useState(null);
  const [selectedFloor, selectedFloorSet] = useState(null);
  const [rooms, roomsSet] = useState([]);
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
      accessorKey: "roomNo",
      header: "ROOM NO",
      size: 50,
    },
    {
      header: "FLOOR NO",
      size: 20,
      Cell: ({ row }) => <>{row.original.floor.floorNo}</>,
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
    let data = rooms;
    if (data.length == 0) return false;
    const csv = generateCsv(csvConfig)(
      data.map((row) => {
        return {
          type: row.roomNo,
          creator: row.creator?.userName,
          updater: row.updater?.userName,
        };
      })
    );
    download(csvConfig)(csv);
  };

  const resetForm = () => {
    actionSet("post");
    roomNoSet("");
    selectedFloorSet(null);
    selectedRoomTypesSet(null);
  };

  const handleUpdate = (row) => {
    roomNoSet(row.roomNo);
    idSet(row.id);
    actionSet("put");
    selectedFloorSet(row.floor);
    selectedRoomTypesSet(row.roomType);
  };

  const table = useMaterialReactTable({
    columns,
    data: rooms,
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
    getFloors();
    getRooms();
  }, []);

  const getRooms = async () => {
    try {
      const response = await axios.get(`${API_URL}api/v1/Room`, {
        headers: authHeaders,
      });
      roomsSet(response.data);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Failed Load Data! Please try again later.",
        confirmButtonText: "OK",
      });
    }
  };

  const getFloors = async () => {
    try {
      const response = await axios.get(`${API_URL}api/v1/Floor`, {
        headers: authHeaders,
      });
      floorsSet(response.data);
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

  const postRoom = async () => {
    const postData = {
      floorId: selectedFloor?.id,
      roomtypeId: selectedRoomTypes?.id,
      roomNo: roomNo,
    };

    if (!postData.floorId) {
      Swal.fire({
        title: "FLOOR is Required.",
        icon: "warning",
      });
      return false;
    } else if (!postData?.roomtypeId) {
      Swal.fire({
        title: "ROOM TYPE is Required.",
        icon: "warning",
      });
    } else if (!postData?.roomNo) {
      Swal.fire({
        title: "ROOM NO is Required.",
        icon: "warning",
      });
    } else {
      isSavingSet(true);
      try {
        let response;

        if (action == "post") {
          response = await axios.post(`${API_URL}api/v1/Room`, postData, {
            headers: authHeaders,
          });
        }

        if (action == "put") {
          response = await axios.put(`${API_URL}api/v1/Room/${id}`, postData, {
            headers: authHeaders,
          });
        }

        // After Api Response

        Swal.fire({
          icon: "success",
          title: `${response.data.roomNo} is ${
            action == "post" ? "Create" : "update"
          } Successfully`,
          text: "Premium Service added successfully",
        });
        resetForm();
        getRooms();
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
            `${API_URL}api/v1/Room/${row.id}`,
            { headers: authHeaders },
            { id: row.id }
          );
          Swal.fire({
            icon: "success",
            title: `${response.data.roomNo} is deleted Successfully`,
          });
          resetForm();
          getRooms();
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
  const roomRef = useRef(null);
  const floorRef = useRef(null);
  const roomTypeRef = useRef(null);

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      if (e.target === roomRef.current) {
        floorRef.current.focus();
      } else if (e.target === floorRef.current) {
        roomTypeRef.current.focus();
      } else if (e.target == roomTypeRef.current) {
        postRoom();
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
          ROOM ENTRY
        </Typography>
        <Grid container spacing={3}>
          {/* type form */}
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              label="ROOM NO"
              name="roomNo"
              autoComplete="off"
              size="small"
              inputRef={roomRef}
              onKeyDown={handleKeyPress}
              fullWidth
              value={roomNo}
              onChange={(e) => {
                roomNoSet(e.target.value);
              }}
            />
          </Grid>
          {/* floor id form */}
          <Grid item xs={12} sm={6} md={3}>
            <Autocomplete
              autoHighlight={true}
              openOnFocus={true}
              size="small"
              id="combo-box-floors"
              options={floors}
              value={selectedFloor}
              onKeyDown={handleKeyPress}
              onChange={(e, obj) => selectedFloorSet(obj)}
              getOptionLabel={(option) => option.floorNo}
              fullWidth
              renderInput={(params) => (
                <TextField
                  inputRef={floorRef}
                  {...params}
                  label="SELECT FLOOR"
                />
              )}
            />
          </Grid>
          {/* roomtypeId form */}
          <Grid item xs={12} sm={6} md={3}>
            <Autocomplete
              openOnFocus={true}
              size="small"
              id="combo-box-room-type"
              options={roomTypes}
              value={selectedRoomTypes}
              onChange={(e, obj) => selectedRoomTypesSet(obj)}
              getOptionLabel={(option) => option.type}
              fullWidth
              renderInput={(params) => (
                <TextField
                  onKeyDown={handleKeyPress}
                  inputRef={roomTypeRef}
                  {...params}
                  label="SELECT ROOM TYPE"
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
            onClick={() => postRoom()}
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
          ROOM LIST
        </Typography>
        <MaterialReactTable table={table} />
      </Paper>
    </>
  );
};

export default Room;
