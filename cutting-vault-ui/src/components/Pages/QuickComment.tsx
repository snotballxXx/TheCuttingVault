import React, { useEffect, useState } from 'react';
import { Box, Button, Stack, TextField } from '@mui/material';
import { useDispatch } from 'react-redux';
import { updateTitle } from '../../store/actions';
import { useSnackbar } from 'notistack';
import { Customer } from '../../store/dataTypes';
import UpgradeIcon from '@mui/icons-material/Upgrade';
import CustomerList from '../CustomerList';
import { updateCustomerComment } from '../../services/api-service';

const styles = {
    button: {
        margin: '20px',
        maxWidth: '400px',
        height: '50px',
    },
};

const QuickCommentPage: React.FC = () => {
    const dispatch = useDispatch();
    const [comment, setComment] = useState<string>('');
    const { enqueueSnackbar } = useSnackbar();
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
        null,
    );

    useEffect(() => {
        dispatch(updateTitle('Quick Comment'));
    }, []);

    const handleUpdate = async () => {
        try {
            if (selectedCustomer != null) {
                selectedCustomer.comment = comment;
                const result = await updateCustomerComment(selectedCustomer);
                enqueueSnackbar(
                    `Successfully updated comment for ${result.firstName}`,
                    { variant: 'success' },
                );
            }
        } catch (err) {
            console.log(err);
            enqueueSnackbar('Failed to update comment', {
                variant: 'error',
            });
        }
    };

    const customerSelectedCallback = (customer: Customer | null) => {
        setSelectedCustomer(customer);
        if (customer) {
            setComment(customer.comment ?? '');
        } else {
            setComment('');
        }
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setComment(event.target.value);
    };

    return (
        <Box
            sx={{
                gap: 2,
                /*display: 'flex',*/
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
            }}
        >
            <Box>
                <CustomerList callback={customerSelectedCallback} />
                <TextField
                    sx={{ marginTop: '20px', maxWidth:'80%' }}
                    id="large-text-entry"
                    label="Enter Your Comment"
                    multiline
                    rows={10} // Number of visible rows
                    variant="outlined"
                    fullWidth // Makes the text area take full width
                    value={comment}
                    onChange={handleChange}
                    placeholder="Type here..."
                />

                <Stack direction={'column'}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleUpdate}
                        endIcon={<UpgradeIcon />}
                        disabled={selectedCustomer === null}
                        sx={styles.button}
                    >
                        Update
                    </Button>
                </Stack>
            </Box>
        </Box>
    );
};

export default QuickCommentPage;
