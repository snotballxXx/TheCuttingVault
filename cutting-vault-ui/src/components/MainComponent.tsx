import React from 'react';
import MiniDrawer from './MiniDrawer';
import { Outlet } from 'react-router-dom';

const MainComponent: React.FC = () => (
    <MiniDrawer>
        <Outlet />
    </MiniDrawer>
);

export default MainComponent;
