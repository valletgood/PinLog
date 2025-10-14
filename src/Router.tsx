import { createBrowserRouter } from 'react-router-dom';
import SettingLocationPage from './pages/SettingLocationPage';
import MapPage from './pages/MapPage';
import ProtectedRoute from './components/ProtectedRoute';

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <ProtectedRoute requireAuth={false}>
        <SettingLocationPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/map-view',
    element: (
      <ProtectedRoute requireAuth={true}>
        <MapPage />
      </ProtectedRoute>
    ),
  },
]);

export default router;
