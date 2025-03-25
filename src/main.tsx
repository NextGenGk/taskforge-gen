
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Log environment mode for debugging
console.log('Running in', import.meta.env.MODE, 'mode');

createRoot(document.getElementById("root")!).render(<App />);
