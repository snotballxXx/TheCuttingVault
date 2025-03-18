import React, { useEffect, useState } from 'react';
import {
    Box,
    Button,
    MenuItem,
    Select,
    SelectChangeEvent,
    Typography,
} from '@mui/material';
import { useDispatch } from 'react-redux';
import { updateTitle } from '../../store/actions';
import {
    createCustomer,
    deleteCustomer,
    getCustomerPage,
    updateCustomer,
} from '../../services/api-service';
import { useSnackbar } from 'notistack';
import {
    DataGrid,
    GridColDef,
    GridFilterModel,
    GridFooterContainer,
    gridPageCountSelector,
    gridPageSelector,
    gridPageSizeSelector,
    GridRowSelectionModel,
    GridSortModel,
    useGridApiContext,
    useGridSelector,
} from '@mui/x-data-grid';
import {
    Customer,
    DialogResult,
    FilterModel,
    PagedSet,
    PaginationModel,
} from '../../store/dataTypes';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddUpdateDialog from '../Dialogs/AddUpdateDialog';
import DeleteDialog from '../Dialogs/DeleteDialog';
import Pagination from '@mui/material/Pagination';
import {
    readObjectFromLocalStorage,
    saveObjectToLocalStorage,
} from '../../utils/utils';

const CustomFooter: React.FC = () => {
    const apiRef = useGridApiContext();
    const page = useGridSelector(apiRef, gridPageSelector); // Current page
    const pageCount = useGridSelector(apiRef, gridPageCountSelector); // Total pages
    const pageSize = useGridSelector(apiRef, gridPageSizeSelector); // Current page size

    const handlePageSizeChange = (event: SelectChangeEvent<number>) => {
        const newPageSize = Number(event.target.value); // Convert value to number
        apiRef.current.setPageSize(newPageSize); // Update page size in DataGrid
    };

    return (
        <GridFooterContainer
            style={{ justifyContent: 'flex-start', gap: '10px' }}
        >
            {' '}
            {/* Align to the left */}
            {/* Page size selector */}
            <Typography sx={{ paddingLeft: '10px' }}>Page Size</Typography>
            <Select
                value={pageSize}
                onChange={handlePageSizeChange}
                variant="outlined"
                size="small"
            >
                {[5, 10, 20, 50, 100].map((size) => (
                    <MenuItem key={size} value={size}>
                        {size} rows
                    </MenuItem>
                ))}
            </Select>
            {/* Pagination controls */}
            <Pagination
                count={pageCount}
                page={page + 1}
                onChange={(_, value) => apiRef.current.setPage(value - 1)}
                color="primary"
            />
        </GridFooterContainer>
    );
};

const columns: GridColDef[] = [
    {
        field: 'firstName',
        headerName: 'First name',
        width: 150,
        editable: false,
    },
    { field: 'lastName', headerName: 'Last name', width: 150, editable: false },
    {
        field: 'loyaltyCount',
        headerName: 'Loyalty Count',
        type: 'number',
        width: 110,
        editable: false,
        filterable: false,
    },
    {
        field: 'phoneNumber',
        headerName: 'Phone Number',
        width: 150,
        editable: false,
    },
    { field: 'comment', headerName: 'Comment', width: 150, editable: false },
    { field: 'email', headerName: 'Email', width: 150, editable: false },
    { field: 'street', headerName: 'Street', width: 150, editable: false },
    { field: 'town', headerName: 'Town', width: 150, editable: false },
    { field: 'suburb', headerName: 'Suburb', width: 150, editable: false },
];

const CustomerPage: React.FC = () => {
    const rowsPerPage = readObjectFromLocalStorage('rowsPerPage') ?? {
        count: 5,
    };

    const dispatch = useDispatch();
    const { enqueueSnackbar } = useSnackbar();
    const [rows, setRows] = useState<Customer[]>([]);
    const [pagedSet, setPagedSet] = useState<PagedSet<Customer> | null>();
    const [selectionModel, setSelectionModel] = useState<GridRowSelectionModel>(
        [],
    );
    const [showAddUpdate, setShowAddUpdate] = useState(false);
    const [showDelete, setShowDelete] = useState(false);
    const [loading, setLoading] = useState(false);
    const [paginationModel, setPaginationModel] = useState({
        page: 0,
        pageSize: rowsPerPage.count,
    });
    const [sortModel, setSortModel] = useState<GridSortModel>([]);
    const [filterModel, setFilterModel] = useState<GridFilterModel>({
        items: [],
    });

    const fetchData = async (
        paginationModel: PaginationModel,
        sort: GridSortModel,
        filter: GridFilterModel,
    ) => {
        try {
            if (loading) return;
            setLoading(true);

            const filterModels = filter.items.map<FilterModel>((e) => {
                return { field: e.field, operator: e.operator, value: e.value };
            });

            const result = await getCustomerPage({
                pageNumber: paginationModel.page,
                itemsPerPage: paginationModel.pageSize,
                sortColumn: sort.length === 0 ? 'lastName' : sort[0].field,
                directionAsc: sort.length === 0 ? true : sort[0].sort === 'asc',
                filters: filterModels,
            });
            setPagedSet(result);
            setRows(result.page);
        } catch (err) {
            console.log(err);
            enqueueSnackbar('Failed to get customer data', {
                variant: 'error',
            });
        }
        setLoading(false);
    };

    const rowCountRef = React.useRef(pagedSet?.totalCount || 0);
    const rowCount = React.useMemo(() => {
        if (pagedSet?.totalCount !== undefined) {
            rowCountRef.current = pagedSet?.totalCount;
        }
        return rowCountRef.current;
    }, [pagedSet?.totalCount]);

    useEffect(() => {
        fetchData(paginationModel, sortModel, filterModel);
        saveObjectToLocalStorage('rowsPerPage', {
            count: paginationModel.pageSize,
        });
    }, [paginationModel, sortModel, filterModel]);

    useEffect(() => {
        dispatch(updateTitle('Customer Management'));
    }, []);

    const addUpdateClosed = async (
        result: DialogResult,
        customer: Customer | null,
    ) => {
        setShowAddUpdate(false);

        if (result !== DialogResult.ok || customer === null) return;

        try {
            if (selectionModel.length === 0) {
                var newCustomer = await createCustomer(customer);
                setRows([newCustomer, ...rows]);
            } else {
                var updatedCustomer = await updateCustomer(customer);
                const newRows = Array.from(rows);
                for (let i = 0; i < newRows.length; ++i) {
                    if (newRows[i].id == updatedCustomer.id) {
                        newRows[i] = updatedCustomer;
                    }
                }
                setRows([...newRows]);
            }

            enqueueSnackbar('Successfully updated customer data', {
                variant: 'success',
            });
        } catch (err) {
            console.log(err);
            enqueueSnackbar('Failed to update/add customer data', {
                variant: 'error',
            });
        }
    };

    const deleteClosed = async (result: DialogResult) => {
        setShowDelete(false);

        if (result !== DialogResult.ok) return;

        try {
            const selectedRows = rows
                .filter((row: Customer) => selectionModel.includes(row.id))
                .map((e) => e.id);

            if (selectedRows) {
                await deleteCustomer(selectedRows);
                debugger;
                const newRows = rows.filter(
                    (customer) => !selectedRows.includes(customer.id),
                );
                setRows(newRows);

                enqueueSnackbar('Successfully deleted customer data', {
                    variant: 'success',
                });
            }
        } catch (err) {
            console.log(err);
            enqueueSnackbar('Failed to delete customer data', {
                variant: 'error',
            });
        }
    };

    const getSelectedCustomerPage = (): Customer | null => {
        if (selectionModel.length === 0) return null;

        return rows.filter(
            (customer) => customer.id === Number(selectionModel[0]),
        )[0];
    };

    return (
        <Box sx={{ height: '80vh', width: '100%' }}>
            <Box>
                <Button
                    sx={{ margin: '10px' }}
                    variant="contained"
                    color="primary"
                    endIcon={<AddIcon />}
                    onClick={() => setShowAddUpdate(true)}
                    disabled={selectionModel.length !== 0}
                >
                    Add
                </Button>
                <Button
                    sx={{ margin: '10px' }}
                    variant="contained"
                    color="primary"
                    endIcon={<EditIcon />}
                    onClick={() => setShowAddUpdate(true)}
                    disabled={selectionModel.length !== 1}
                >
                    Edit
                </Button>
                <Button
                    sx={{ margin: '10px' }}
                    variant="contained"
                    color="primary"
                    endIcon={<DeleteIcon />}
                    onClick={() => setShowDelete(true)}
                    disabled={selectionModel.length === 0}
                >
                    Delete
                </Button>
            </Box>

            {showAddUpdate && (
                <AddUpdateDialog
                    customer={getSelectedCustomerPage()}
                    closeCallback={addUpdateClosed}
                />
            )}
            {showDelete && <DeleteDialog closeCallback={deleteClosed} />}
            <DataGrid
                rows={rows}
                columns={columns}
                rowCount={rowCount}
                loading={loading}
                rowSelectionModel={selectionModel}
                pageSizeOptions={[5, 10, 25, 50, 100]}
                checkboxSelection
                onRowSelectionModelChange={(newSelectionModel) => {
                    setSelectionModel(newSelectionModel);
                }}
                pagination
                paginationModel={paginationModel}
                sortModel={sortModel}
                filterModel={filterModel}
                paginationMode="server"
                sortingMode="server"
                filterMode="server"
                onPaginationModelChange={setPaginationModel}
                onSortModelChange={setSortModel}
                onFilterModelChange={(newModel) => setFilterModel(newModel)}
                slots={{ footer: CustomFooter }}
            />
        </Box>
    );
};

export default CustomerPage;
