import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

(window as unknown as { __HARDWAREDEX_VITE_ACTIVE__?: boolean }).__HARDWAREDEX_VITE_ACTIVE__ = true;

createRoot(document.getElementById('root')!).render(<App />);
