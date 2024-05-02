import React from "react";
import {
  Box,
  Typography,
  Stack,
  TextField,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Toolbar,
  Paper,
  Tooltip,
  Chip,
  Autocomplete,
} from "@mui/material";
import PropTypes from "prop-types";
import { useTheme } from "@emotion/react";
import headCells from "./TableHeadCellsClient";
import StyledButton from "../MainPages/StyledButton";
import { BusinessCenterOutlined } from "@mui/icons-material";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import CustomTextField from "./StyledParts/StyledTextField";
import CloseIcon from "@mui/icons-material/Close";
import { alpha } from "@mui/material/styles";

const ClientTable = ({
  query,
  handleSearchChange,
  clientData,
  selectedHeadCell,
  clientId,
  selected,
  order,
  orderBy,
  rowsPerPage,
  page,
  dense,
  handleRequestSort,
  handleSelectAllClick,
  handleChangeRowsPerPage,
  handleChangePage,
  handleClickOpen,
  selectedHeadCellFunc,
  openRemovePopup,
  handleClick,
  setClientId,
}) => {
  const theme = useTheme();

  function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
  }

  function getComparator(order, orderBy) {
    return order === "desc"
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  }

  function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) {
        return order;
      }
      return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
  }

  function EnhancedTableHead(props) {
    const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } = props;

    const createSortHandler = (property) => (event) => {
      onRequestSort(event, property);
    };

    return (
      <TableHead>
        <TableRow>
          <TableCell padding="checkbox">
            <Checkbox
              color="primary"
              indeterminate={numSelected > 0 && numSelected < rowCount}
              checked={rowCount > 0 && numSelected === rowCount}
              onChange={onSelectAllClick}
              inputProps={{
                "aria-label": "select all desserts",
              }}
            />
          </TableCell>
          {headCells.map((headCell) => (
            <TableCell
              key={headCell.id}
              align={headCell.numeric ? "left" : "right"}
              padding={headCell.disablePadding ? "none" : "normal"}
              sortDirection={orderBy === headCell.id ? order : false}
            >
              {headCell.label}
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
    );
  }

  EnhancedTableHead.propTypes = {
    numSelected: PropTypes.number.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    onSelectAllClick: PropTypes.func.isRequired,
    order: PropTypes.oneOf(["asc", "desc"]).isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired,
  };

  function EnhancedTableToolbar(props) {
    const { numSelected } = props;

    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "15px",
        }}
      >
        {" "}
        <Typography
          variant="h5"
          component="h2"
          fontWeight={600}
          display="flex"
          alignItems="center"
          width="25%"
        >
          <BusinessCenterOutlined
            style={{ fontSize: "35px", color: "#c9c9c9", marginRight: "10px" }}
          />{" "}
          Client List
        </Typography>
        <Toolbar
          sx={{
            pl: { sm: 2 },
            pr: { xs: 1, sm: 1 },
            width: "100%",
            borderRadius: "5px",

            ...(numSelected > 0 && {
              bgcolor: (theme) =>
                alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
            }),
          }}
        >
          {numSelected > 0 ? (
            <Tooltip title="Delete">
              <StyledButton variant="main" onClick={openRemovePopup}>
                Delete
              </StyledButton>
            </Tooltip>
          ) : (
            <Stack flex={1} display={"flex"} flexDirection={"row"}>
              <CustomTextField
                autoFocus={query.search ? true : false}
                type="text"
                variant="outlined"
                label="Search client"
                id="search"
                name="search"
                value={query?.search}
                size="small"
                onChange={handleSearchChange}
                sx={{ width: "100%", marginRight: "10px" }}
              />

              <Autocomplete
                size="small"
                id="multiple-limit-tags"
                options={headCells.map((headCell) => headCell.label)} // Use the label property from headCells
                name="FilterClient"
                onChange={(e, value) => selectedHeadCellFunc(value)} // Use the value from Autocomplete
                value={selectedHeadCell}
                getOptionLabel={(option) => option} // Use the option directly (as it is a string)
                renderInput={(params) => <TextField {...params} placeholder="Filter client" />}
                sx={{ width: "100%", marginBottom: "20px" }}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      key={index}
                      label={option}
                      padding="0px"
                      deleteIcon={<CloseIcon style={{ color: "white", fontSize: "12px" }} />}
                      {...getTagProps({ index })}
                      style={{
                        backgroundColor: theme.palette.primary.main,
                        color: "white",
                        borderRadius: "4px",
                        fontSize: "12px",
                        marginRight: "4px",
                      }}
                    />
                  ))
                }
              />
            </Stack>
          )}

          {numSelected === 1 ? (
            <Tooltip>
              <StyledButton
                sx={{ marginLeft: "10px" }}
                variant="secondary"
                onClick={(e) => handleClickOpen(e, clientId)}
              >
                Edit
              </StyledButton>
            </Tooltip>
          ) : null}
        </Toolbar>
      </Box>
    );
  }

  EnhancedTableToolbar.propTypes = {
    numSelected: PropTypes.number.isRequired,
  };

  const isSelected = (fullname) => selected.includes(fullname);

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - clientData?.length) : 0;

  const visibleRows = React.useMemo(
    () =>
      stableSort(clientData, getComparator(order, orderBy))
        .reverse()
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [order, orderBy, page, rowsPerPage, clientData]
  );

  return (
    <Paper sx={{ width: "100%", mb: 2, boxShadow: "none" }}>
      <EnhancedTableToolbar numSelected={selected?.length} />
      <TableContainer>
        <Table
          sx={{ minWidth: 750 }}
          aria-labelledby="tableTitle"
          size={dense ? "small" : "medium"}
        >
          <EnhancedTableHead
            numSelected={selected?.length}
            order={order}
            orderBy={orderBy}
            onSelectAllClick={handleSelectAllClick}
            onRequestSort={handleRequestSort}
            rowCount={clientData?.length}
          />

          <TableBody>
            {visibleRows.map((row, index) => {
              const isItemSelected = isSelected(row._id);
              const labelId = `enhanced-table-checkbox-${index}`;
              //change this later to only first+last names
              const fullName = row.fullname ? row.fullname : row.firstName + " " + row.lastName;
              return (
                <TableRow
                  hover
                  role="checkbox"
                  aria-checked={isItemSelected}
                  tabIndex={-1}
                  key={row._id}
                  selected={isItemSelected}
                  sx={{ cursor: "pointer" }}
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      color="primary"
                      checked={isItemSelected}
                      onClick={(event) => handleClick(event, row._id)}
                      onChange={() => {
                        if (isItemSelected) {
                          setClientId((prevClientIds) =>
                            prevClientIds.filter((id) => id !== row._id)
                          );
                        } else {
                          setClientId((prevClientIds) => [...prevClientIds, row._id]);
                        }
                      }}
                      inputProps={{
                        "aria-labelledby": labelId,
                      }}
                    />
                  </TableCell>
                  <TableCell component="th" id={labelId} scope="row" padding="none">
                    {fullName.length > 15 ? (
                      <Tooltip title={fullName}>
                        <span>{fullName.slice(0, 15) + "..."}</span>
                      </Tooltip>
                    ) : (
                      fullName
                    )}
                  </TableCell>
                  <TableCell align="left">
                    {row.lookingFor?.length > 15 ? (
                      <Tooltip title={row.lookingFor}>
                        <span>{row.lookingFor.slice(0, 15) + "..."}</span>
                      </Tooltip>
                    ) : (
                      row.lookingFor
                    )}
                  </TableCell>
                  <TableCell align="left">{row.jobType}</TableCell>
                  <TableCell align="left">
                    {row.requiredSkills?.length > 0 ? (
                      row.requiredSkills?.length === 1 ? (
                        row.requiredSkills[0]
                      ) : (
                        <Tooltip title={row.requiredSkills.join(", ")} aria-label="required-skills">
                          <span>{row.requiredSkills[0]}, ...</span>
                        </Tooltip>
                      )
                    ) : (
                      "-"
                    )}
                  </TableCell>
                  <TableCell align="left">{new Date(row.startDate).toLocaleDateString()}</TableCell>
                  <TableCell align="left">{row.currentStage}</TableCell>
                  <TableCell align="left">
                    {row.notes?.length > 10 ? (
                      <Tooltip title={row.notes}>
                        <span>{row.notes.slice(0, 10) + "..."}</span>
                      </Tooltip>
                    ) : (
                      row.notes
                    )}
                  </TableCell>
                  {row.assignedVas.some((va) => va.selected === true) ? (
                    <TableCell align="left">
                      <NotificationsActiveIcon
                        style={{
                          fontSize: "10px",
                          color: "#1ec31e",
                          width: 30,
                          height: 30,
                          borderRadius: "50px",
                          background: "#daffd2",
                          padding: "7px",
                        }}
                      />
                    </TableCell>
                  ) : null}
                </TableRow>
              );
            })}
            {emptyRows > 0 && (
              <TableRow
                style={{
                  height: (dense ? 33 : 53) * emptyRows,
                }}
              >
                <TableCell colSpan={6} />
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={clientData?.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
};

export default ClientTable;
