import React, { useState } from 'react';
import { TextField, IconButton, InputAdornment, Box } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

export type PasswordUpdate = (password: string, enterPressed: boolean) => void;
export type Props = {
    passwordUpdateCallback: PasswordUpdate;
    displayLabel: string;
};

const PasswordInput: React.FC<Props> = (props: Props) => {
    const [showPassword, setShowPassword] = useState(false);
    const [password, setPassword] = useState('');

    const handleClickShowPassword = () => {
        setShowPassword((prev) => !prev);
    };

    const handleKeyPress = (event: React.KeyboardEvent<HTMLDivElement>) => {
        props.passwordUpdateCallback(password, event.key === 'Enter');
    };

    return (
        <Box sx={{ width: '100%' }}>
            <TextField
                label={props.displayLabel}
                type={showPassword ? 'text' : 'password'}
                variant="outlined"
                fullWidth
                value={password}
                onKeyUp={handleKeyPress}
                onChange={(e) => setPassword(e.target.value)}
                slotProps={{
                    input: {
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={handleClickShowPassword}
                                    edge="end"
                                >
                                    {showPassword ? (
                                        <VisibilityOff />
                                    ) : (
                                        <Visibility />
                                    )}
                                </IconButton>
                            </InputAdornment>
                        ),
                    },
                }}
            />
        </Box>
    );
};

export default PasswordInput;
