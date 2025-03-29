import { useRoutes } from 'react-router-dom';
import { routes } from './router/routes';

function App() {
  // Use routes configuration to render the appropriate components
  const content = useRoutes(routes);
  
  return content;
}

export default App;
