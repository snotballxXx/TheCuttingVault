import { MouseEventHandler, ReactNode } from 'react';
import {
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
} from '@mui/material';
import { Link } from 'react-router-dom';

type GetIcon = () => ReactNode;
type Props = {
    isOpen: boolean;
    getIcon: GetIcon;
    route?: string;
    onClick?: MouseEventHandler<HTMLDivElement>;
    title: string;
};

const MiniDrawItem = (props: Props) => {
    return (
        <List>
            <ListItem key="1" disablePadding sx={{ display: 'block' }}>
                {props.route && (
                    <ListItemButton
                        component={Link}
                        to={props.route}
                        sx={[
                            { minHeight: 48, px: 2.5 },
                            props.isOpen
                                ? { justifyContent: 'initial' }
                                : { justifyContent: 'center' },
                        ]}
                    >
                        <ListItemIcon
                            sx={[
                                { minWidth: 0, justifyContent: 'center' },
                                props.isOpen ? { mr: 3 } : { mr: 'auto' },
                            ]}
                        >
                            {props.getIcon()}
                        </ListItemIcon>
                        <ListItemText
                            primary={props.title}
                            sx={[
                                props.isOpen ? { opacity: 1 } : { opacity: 0 },
                            ]}
                        />
                    </ListItemButton>
                )}
                {props.onClick && (
                    <ListItemButton
                        onClick={props.onClick}
                        sx={[
                            { minHeight: 48, px: 2.5 },
                            props.isOpen
                                ? { justifyContent: 'initial' }
                                : { justifyContent: 'center' },
                        ]}
                    >
                        <ListItemIcon
                            sx={[
                                { minWidth: 0, justifyContent: 'center' },
                                props.isOpen ? { mr: 3 } : { mr: 'auto' },
                            ]}
                        >
                            {props.getIcon()}
                        </ListItemIcon>
                        <ListItemText
                            primary={props.title}
                            sx={[
                                props.isOpen ? { opacity: 1 } : { opacity: 0 },
                            ]}
                        />
                    </ListItemButton>
                )}
            </ListItem>
        </List>
    );
};

export default MiniDrawItem;
