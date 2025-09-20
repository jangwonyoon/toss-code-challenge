import 'modern-normalize';
import './index.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import ModalFormPage from './ModalFormPage';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element not found');
}

createRoot(rootElement).render(
  <StrictMode>
    <ModalFormPage />
  </StrictMode>
);
