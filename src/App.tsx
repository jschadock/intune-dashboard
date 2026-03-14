import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppShell } from './components/layout/AppShell';
import { UploadPage } from './pages/UploadPage';
import { DashboardPage } from './pages/DashboardPage';
import { DeviceConfigPage } from './pages/DeviceConfigPage';
import { AppDeploymentPage } from './pages/AppDeploymentPage';
import { RawLogsPage } from './pages/RawLogsPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppShell />}>
          <Route path="/" element={<UploadPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/config" element={<DeviceConfigPage />} />
          <Route path="/apps" element={<AppDeploymentPage />} />
          <Route path="/logs" element={<RawLogsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
