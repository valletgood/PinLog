import { createBrowserRouter } from 'react-router-dom';
import SettingLocationPage from './pages/SettingLocationPage';
import MapView from './components/ui/MapView';
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
        <MapView />
      </ProtectedRoute>
    ),
  },
]);

export default router;
