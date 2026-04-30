import { RouterProvider } from 'react-router';
import { AuthProvider } from './auth/AuthContext';
import { router } from './routes';

export default function App() {
  return (
    <div className="dark">
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </div>
  );
}
