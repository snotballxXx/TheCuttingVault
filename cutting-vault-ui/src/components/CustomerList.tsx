import React, { useEffect, useState } from 'react';
import {
    List,
    ListItem,
    ListItemText,
    Box,
    ListItemButton,
    TextField,
    IconButton,
    Stack,
    Typography,
} from '@mui/material';

import CancelIcon from '@mui/icons-material/Cancel';
import { Customer } from '../store/dataTypes';
import { getCustomerPage } from '../services/api-service';
import { useSnackbar } from 'notistack';

export type CustomerSelectedCallback = (customer: Customer | null) => void;

interface CustomerListProps {
    callback: CustomerSelectedCallback;
}

const CustomerList: React.FC<CustomerListProps> = ({ callback }) => {
    const [rows, setRows] = useState<Customer[]>([]);
    const [totalRows, setTotalRows] = useState<Customer[]>([]);
    const { enqueueSnackbar } = useSnackbar();
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
        null,
    );

    useEffect(() => {
        const init = async () => {
            try {
                const result = await getCustomerPage( { pageNumber:1, itemsPerPage:10000, sortColumn:'LastName', directionAsc:true });
                setTotalRows(result.page);
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

    const handleListItemClick = (customer: Customer) => {
        setSelectedCustomer(customer);
    };

    useEffect(() => {
        callback(selectedCustomer);
    }, [selectedCustomer]);

    useEffect(() => {
        handleKeyPress();
    }, [firstName, lastName]);

    const handleKeyPress = () => {
        const firstNameRows = totalRows.filter(
            (e) =>
                firstName.length === 0 ||
                e.firstName?.toLowerCase()?.includes(firstName.toLowerCase()),
        );

        const finalRows = firstNameRows.filter(
            (e) =>
                lastName.length === 0 ||
                e.lastName?.toLowerCase()?.includes(lastName.toLowerCase()),
        );
        setRows(finalRows);
    };

    return (
        <Stack direction="row" spacing={2}>
                <Box>
                    <Typography variant="h4">Customer Search</Typography>
                </Box>            
            <Box>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        gap: 2,
                        width: '100%',
                        maxWidth: 360,
                    }}
                >
                    <TextField
                        label="First Name"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={firstName}
                        onKeyUp={handleKeyPress}
                        onChange={(e) => setFirstName(e.target.value)}
                    />
                    <IconButton size="medium" onClick={() => setFirstName('')}>
                        <CancelIcon />
                    </IconButton>
                </Box>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        gap: 2,
                        width: '100%',
                        maxWidth: 360,
                    }}
                >
                    <TextField
                        label="Last Name"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={lastName}
                        onKeyUp={handleKeyPress}
                        onChange={(e) => setLastName(e.target.value)}
                    />
                    <IconButton onClick={() => setLastName('')}>
                        <CancelIcon />
                    </IconButton>
                </Box>
                {selectedCustomer !== null && (
                            <Typography>
                                Selected customer: {selectedCustomer.firstName}{' '}
                                {selectedCustomer.lastName}
                            </Typography>
                        )}                
            </Box>
            <Box
                sx={{
                    width: '100%',
                    maxWidth: 360,
                    height: 400,
                    overflowY: 'auto',
                    bgcolor: 'background.paper',
                    borderStyle: 'solid',
                    borderWidth: '1px',
                    borderRadius: '5px',
                }}
            >
                <List sx={{ maxHeight: '200px' }}>
                    {rows.map((user) => (
                        <ListItem key={user.id}>
                            <ListItemButton
                                onClick={() => handleListItemClick(user)}
                            >
                                <ListItemText
                                    primary={`${user.firstName} ${user.lastName}`}
                                />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            </Box>
        </Stack>
    );
};

export default CustomerList;
