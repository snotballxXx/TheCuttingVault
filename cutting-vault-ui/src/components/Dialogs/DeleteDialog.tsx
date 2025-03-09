import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Typography,
} from '@mui/material';
import { useState } from 'react';
import { DialogResult } from '../../store/dataTypes';


export type DeleteDialogResult = (result: DialogResult) => void;

export interface Props {
    closeCallback: DeleteDialogResult;
}

const DeleteDialog: React.FC<Props> = (props: Props) => {
    const [open, setOpen] = useState(true);

    const buttonClick = (state: boolean): void => {
        setOpen(false);
        props.closeCallback(state ? DialogResult.ok : DialogResult.cancel);
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
                <DialogTitle sx={{ marginBottom: '20px' }}>
                    Delete Confirmation
                </DialogTitle>
                <DialogContent>
                    <Typography>
                        Are you sure you want to delete the selected
                        customer(s)?
                    </Typography>
                </DialogContent>

                <DialogActions>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => buttonClick(true)}
                    >
                        Yes
                    </Button>
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => buttonClick(false)}
                    >
                        No
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default DeleteDialog;
