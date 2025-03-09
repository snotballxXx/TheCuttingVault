import { createRoot } from 'react-dom/client';
import App from './App';

const container = document.getElementById('root');
const root = createRoot(container!); // `container!` is a TypeScript non-null assertion
root.render(
    <App />
);
