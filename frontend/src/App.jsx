import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import TeacherClasses from './pages/teacher/TeacherClasses';
import MarkAttendance from './pages/teacher/MarkAttendance';
import StudentAttendance from './pages/student/StudentAttendance';
import StudentQRScan from './pages/student/StudentQRScan';
import Layout from './components/Layout';
import UserManagement from './pages/admin/UserManagement';
import DepartmentManagement from './pages/admin/DepartmentManagement';
import ClassManagement from './pages/admin/ClassManagement';
import ProtectedRoute from './components/ProtectedRoute';
import Dashboard from './pages/Dashboard';
import LeaveApplication from './pages/student/LeaveApplication';
import LeaveManagement from './pages/admin/LeaveManagement';
import ReportsDashboard from './pages/admin/ReportsDashboard';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/unauthorized" element={<div className='p-10'>Unauthorized Access</div>} />

          {/* Protected Routes with Layout */}
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={
              <Layout>
                <Dashboard />
              </Layout>
            } />
          </Route>

          {/* Admin Routes */}
          <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route path="/users" element={
              <Layout>
                <UserManagement />
              </Layout>
            } />
            <Route path="/departments" element={
              <Layout>
                <DepartmentManagement />
              </Layout>
            } />
            <Route path="/classes" element={
              <Layout>
                <ClassManagement />
              </Layout>
            } />
          </Route>

          {/* Teacher Routes */}
          <Route element={<ProtectedRoute allowedRoles={['admin', 'teacher']} />}>
            <Route path="/attendance" element={
              <Layout>
                <TeacherClasses />
              </Layout>
            } />
            <Route path="/attendance/:classId" element={
              <Layout>
                <MarkAttendance />
              </Layout>
            } />
            <Route path="/leave-requests" element={
              <Layout>
                <LeaveManagement />
              </Layout>
            } />
            <Route path="/reports" element={
              <Layout>
                <ReportsDashboard />
              </Layout>
            } />
          </Route>

          {/* Student Routes */}
          <Route element={<ProtectedRoute allowedRoles={['admin', 'teacher', 'student']} />}>
            <Route path="/my-attendance" element={
              <Layout>
                <StudentAttendance />
              </Layout>
            } />
            <Route path="/scan-qr" element={
              <Layout>
                <StudentQRScan />
              </Layout>
            } />
            <Route path="/leaves" element={
              <Layout>
                <LeaveApplication />
              </Layout>
            } />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
