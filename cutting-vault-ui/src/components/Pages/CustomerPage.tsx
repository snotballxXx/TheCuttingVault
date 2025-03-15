import React, { useEffect, useState } from 'react';
import { Box, Button } from '@mui/material';
import { useDispatch } from 'react-redux';
import { updateTitle } from '../../store/actions';
import {
    createCustomer,
    deleteCustomer,
    getCustomerPage,
    updateCustomer,
} from '../../services/api-service';
import { useSnackbar } from 'notistack';
import { DataGrid, GridColDef, GridRowSelectionModel } from '@mui/x-data-grid';
import { Customer, DialogResult } from '../../store/dataTypes';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddUpdateDialog from '../Dialogs/AddUpdateDialog';
import DeleteDialog from '../Dialogs/DeleteDialog';

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
    const dispatch = useDispatch();
    const { enqueueSnackbar } = useSnackbar();
    const [rows, setRows] = useState<Customer[]>([]);
    const [selectionModel, setSelectionModel] = useState<GridRowSelectionModel>(
        [],
    );
    const [showAddUpdate, setShowAddUpdate] = useState(false);
    const [showDelete, setShowDelete] = useState(false);

    useEffect(() => {
        dispatch(updateTitle('Customer Management'));

        const init = async () => {
            try {
                const result = await getCustomerPage({
                    pageNumber: 1,
                    itemsPerPage: 10000,
                    sortColumn: 'lastName',
                    directionAsc: true,
                });
                setRows(result.page);
            } catch (err) {
                console.log(err);
                enqueueSnackbar('Failed to get customer data', {
                    variant: 'error',
                });
            }
        };
        init();
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
        <Box sx={{ height: 800, width: '100%' }}>
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
                initialState={{
                    pagination: {
                        paginationModel: {
                            pageSize: 25,
                        },
                    },
                }}
                rowSelectionModel={selectionModel}
                pageSizeOptions={[5, 10, 25, 50, 100]}
                checkboxSelection
                onRowSelectionModelChange={(newSelectionModel) => {
                    setSelectionModel(newSelectionModel);
                }}
            />
        </Box>
    );
};

export default CustomerPage;
