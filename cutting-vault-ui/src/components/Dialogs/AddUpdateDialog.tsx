import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Stack,
    TextField,
} from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'
import { useState } from 'react';
import { Customer, DialogResult } from '../../store/dataTypes';
import { Moment } from 'moment';
import moment from 'moment';

export type AddUpdateDialogResult = (
    result: DialogResult,
    customer: Customer | null,
) => void;

export interface Props {
    customer: Customer | null;
    closeCallback: AddUpdateDialogResult;
}

const AddUpdateDialog = (props: Props) => {
    const [open, setOpen] = useState(true);

    const inputCustomer: Customer = props.customer ?? {
        id: 0,
        firstName: '',
        lastName: '',
        phoneNumber: null,
        dateOfBirth: null,
        email: null,
        barcode: null,
        street: null,
        town: null,
        suburb: null,
        comment: null,
        loyaltyCount: 0,
        lastLoyaltyCountUpdate: null,
        lastUpdate: new Date(),
    };

    const [customer, setCustomer] = useState<Customer>(inputCustomer);
    const [dob, setDob] = useState<Moment | null>(moment(inputCustomer.dateOfBirth));

    const handleOk = (): void => {
        setOpen(false);
        props.closeCallback(DialogResult.ok, customer);
    };

    const handleCancel = (): void => {
        setOpen(false);
        props.closeCallback(DialogResult.cancel, null);
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setCustomer({
            ...customer,
            [name]: value,
        });
    };

    function handleClose(): void {
        return;
    }

    return (
        <>
            <Dialog
                open={open}
                onClose={handleClose}
                disableEscapeKeyDown
                slotProps={{
                    backdrop: {
                      style: { backgroundColor: 'rgba(0, 0, 0, 0.0)' }
                    },
                    paper: {
                        component: 'form',
                    },
                }}
            >
                <DialogTitle>
                    {props.customer ? 'Update Customer' : 'Add Customer'}
                </DialogTitle>
                <DialogContent>
                    <Stack
                        direction="column"
                        spacing={0}
                        flexWrap="wrap"
                        sx={{ padding: '10px' }}
                    >
                        <Stack
                            direction="row"
                            spacing={2}
                            sx={{
                                flex: 1,
                                minWidth: '45%',
                                marginBottom: '10px',
                            }}
                        >
                            <TextField
                                autoFocus
                                margin="dense"
                                name="firstName"
                                label="First Name"
                                type="text"
                                fullWidth
                                variant="outlined"
                                value={customer.firstName}
                                onChange={handleChange}
                            />
                            <TextField
                                margin="dense"
                                name="lastName"
                                label="Last Name"
                                type="text"
                                fullWidth
                                variant="outlined"
                                value={customer.lastName}
                                onChange={handleChange}
                            />
                        </Stack>
                        <Stack
                            direction="row"
                            spacing={2}
                            sx={{
                                flex: 1,
                                minWidth: '45%',
                                marginBottom: '10px',
                            }}
                        >
                            <TextField
                                margin="dense"
                                name="phoneNumber"
                                label="Phone Number"
                                type="text"
                                fullWidth
                                variant="outlined"
                                value={customer.phoneNumber}
                                onChange={handleChange}
                            />
                            <LocalizationProvider dateAdapter={AdapterMoment}>
                                <DatePicker
                                    value={dob}
                                    onChange={(newValue) => {
                                        setDob(newValue);
                                        if (newValue)
                                          customer.dateOfBirth = newValue?.toDate();
                                    }}
                                    slotProps={{
                                        textField: {
                                          
                                        },
                                    }}
                                />
                            </LocalizationProvider>
                        </Stack>
                        <Stack
                            direction="row"
                            spacing={2}
                            sx={{
                                flex: 1,
                                minWidth: '45%',
                                marginBottom: '10px',
                            }}
                        >
                            <TextField
                                margin="dense"
                                name="email"
                                label="Email"
                                type="email"
                                fullWidth
                                variant="outlined"
                                value={customer.email}
                                onChange={handleChange}
                            />
                            <TextField
                                margin="dense"
                                name="street"
                                label="Street"
                                type="text"
                                fullWidth
                                variant="outlined"
                                value={customer.street}
                                onChange={handleChange}
                            />
                        </Stack>
                        <Stack
                            direction="row"
                            spacing={2}
                            sx={{
                                flex: 1,
                                minWidth: '45%',
                                marginBottom: '10px',
                            }}
                        >
                            <TextField
                                margin="dense"
                                name="town"
                                label="Town"
                                type="text"
                                fullWidth
                                variant="outlined"
                                value={customer.town}
                                onChange={handleChange}
                            />
                            <TextField
                                margin="dense"
                                name="suburb"
                                label="Suburb"
                                type="text"
                                fullWidth
                                variant="outlined"
                                value={customer.suburb}
                                onChange={handleChange}
                            />
                        </Stack>
                        <Stack
                            direction="row"
                            spacing={2}
                            sx={{
                                flex: 1,
                                minWidth: '45%',
                                marginBottom: '5px',
                            }}
                        >
                            <TextField
                                margin="dense"
                                name="Barcode"
                                label="barcode"
                                type="text"
                                fullWidth
                                variant="outlined"
                                value={customer.barcode}
                                onChange={handleChange}
                            />
                            <TextField
                                margin="dense"
                                name="loyaltyCount"
                                label="Loyalty Count"
                                type="number"
                                fullWidth
                                variant="outlined"
                                value={customer.loyaltyCount}
                                onChange={handleChange}
                            />
                        </Stack>
                        <Stack
                            direction="row"
                            spacing={0}
                            sx={{ flex: 1, minWidth: '45%' }}
                        >
                            <TextField
                                margin="dense"
                                name="comment"
                                label="Comment"
                                type="textarea"
                                multiline
                                fullWidth
                                variant="outlined"
                                value={customer.comment}
                                onChange={handleChange}
                            />
                        </Stack>
                    </Stack>
                </DialogContent>

                <DialogActions>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleOk()}
                    >
                        Save
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleCancel()}
                    >
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default AddUpdateDialog;
