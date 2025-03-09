import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { setNavigateFunction } from '../services/NavigationService';

const NavigationInitializer: React.FC = () => {
    const navigate = useNavigate();

    useEffect(() => {
        setNavigateFunction(navigate);
    }, [navigate]);

    return null; // This component doesn't render anything
};

export default NavigationInitializer;
