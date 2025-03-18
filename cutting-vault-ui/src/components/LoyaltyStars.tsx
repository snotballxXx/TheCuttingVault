import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, SvgIconProps, SvgIcon, SxProps, Theme, IconButton } from '@mui/material';
import { updateTitle } from '../store/actions';
import { RootState } from '../store/store';
import { set } from '../store/loyaltySlice';
import CancelIcon from '@mui/icons-material/Cancel';

export type LoyaltyCountUpdate = (value: number) => void;

const StarIcon: React.FC<SvgIconProps> = (props) => (
    <SvgIcon {...props}>
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L17.82 22 12 18.9 6.18 22 7 14.14 2 9.27l6.91-1.01L12 2z" />
    </SvgIcon>
);

export type Props = {
    disable: boolean | null;
    sx?: SxProps<Theme>;
};

export default function LoyaltyStars(props: Props) {
    const loyaltyCount = useSelector((state: RootState) => state.loyaltyCount);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(updateTitle('Counter'));
    }, []);

    const onCountUpdate = (count: number) => {
        dispatch(set(count));
    };

    const handleReset = async () => {
      dispatch(set(0));
    };    

    return (
        <Box
            sx={{
                display: 'flex',
                gap: 1,
                borderColor: 'black',
                borderWidth: '2px',
                borderStyle: 'none',
                margin: '30px',
                alignItems: 'center'                
            }}
        >  
            <IconButton onClick={handleReset}>
                        <CancelIcon />
                    </IconButton>       
            {Array.from({ length: 10 }).map((_, index) => {
                return (
                    <StarIcon
                        key={index + 1}
                        sx={{
                            color:
                                index + 1 > loyaltyCount.value || props.disable
                                    ? 'lightgrey'
                                    : 'gold',
                            width: '3rem',
                            height: '3rem',
                        }}
                        onClick={() => onCountUpdate(index + 1)}
                    />
                );
            })}
        </Box>
    );
}
