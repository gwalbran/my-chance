import '@blueprintjs/core/lib/css/blueprint.css';
import '@blueprintjs/icons/lib/css/blueprint-icons.css';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import { StoreProvider } from './state/store';

const root = document.getElementById('root')!;
createRoot(root).render(
  <StoreProvider>
    <App />
  </StoreProvider>
);
