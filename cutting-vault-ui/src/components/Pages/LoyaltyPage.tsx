import React, { useEffect, useState } from 'react';
import { Box, Button, Stack } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { updateTitle } from '../../store/actions';
import { updateCustomerLoyalty } from '../../services/api-service';
import { useSnackbar } from 'notistack';
import { Customer } from '../../store/dataTypes';
import LoyaltyStars from '../LoyaltyStars';
import { RootState } from '../../store/store';
import { set } from '../../store/loyaltySlice';
import UpgradeIcon from '@mui/icons-material/Upgrade';
import CustomerList from '../CustomerList';
import ConfettiParticles from '../ConfettiParticles';

const styles = {
    button: {
        margin: '20px',
        maxWidth: '400px',
        height: '50px',
    },
};

const LoyaltyPage: React.FC = () => {
    const dispatch = useDispatch();
    const loyaltyCount = useSelector((state: RootState) => state.loyaltyCount);
    const { enqueueSnackbar } = useSnackbar();
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
        null,
    );
    const [displayConfetti, setDisplayConfetti] = useState(false);

    useEffect(() => {
        dispatch(updateTitle('Loyalty Program'));
        dispatch(set(0));
    }, []);

    useEffect(() => {
        if (loyaltyCount.value === 9) {
            setDisplayConfetti(true);
            setTimeout(() => setDisplayConfetti(false), 2000);
        }
    }, [loyaltyCount]);

    const handleUpdate = async () => {
        try {
            if (selectedCustomer != null) {
                const result = await updateCustomerLoyalty(
                    selectedCustomer.id,
                    loyaltyCount.value,
                );
                selectedCustomer.loyaltyCount = result.loyaltyCount;
                enqueueSnackbar(
                    `Successfully updated loyalty count for ${result.firstName} to ${result.loyaltyCount}`,
                    { variant: 'success' },
                );
            }
        } catch (err) {
            console.log(err);
            enqueueSnackbar('Failed to update loyalty count', {
                variant: 'error',
            });
        }
    };

    const customerSelectedCallback = (customer: Customer | null) => {
        setSelectedCustomer(customer);
        if (customer) {
            dispatch(set(customer?.loyaltyCount));
        } else {
            dispatch(set(0));
        }
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
                <LoyaltyStars disable={selectedCustomer === null} />
                {displayConfetti && <ConfettiParticles />}
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

export default LoyaltyPage;
