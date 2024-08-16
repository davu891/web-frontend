import React, { useState, useEffect, useContext } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import axiosInstance from './utils/axiosConfig';
import Home from './pages/content/Home';
import Blog from './pages/content/Blog';
import Contact from './pages/content/Contact';
import AboutCourse from './pages/content/AboutCourse';
import Register from './pages/auth/Register';
import Login from './pages/auth/Login';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import Admin from './pages/admin/Admin';
import Tables from './pages/admin/Tables';
import Users from './pages/admin/Users';
import Courses from './pages/admin/Courses';
import Dashboard from './pages/admin/Dashboard';
import Learn from './pages/courses/Learn';
import CoursesContent from './pages/courses/CoursesContent';
import Vocabulary from './pages/courses/Vocabulary';
import Kanji from './pages/courses/Kanji';
import Grammar from './pages/courses/Grammar';
import Test from './pages/courses/Test';
import Purchase from './pages/Purchases';
import TeacherManagement from './pages/teacher/TeacherManagement';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './App.css';
import NotFound from './pages/NotFound';
import Header from './components/Header';
import Footer from './components/Footer';
import { AuthProvider, AuthContext } from './pages/auth/AuthProvider';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
const ProtectedRoute = ({ children, roles }) => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (user && roles && (!user.roles || !roles.some(role => user.roles.includes(role)))) {
            navigate('/');
        }
    }, [user, roles, navigate]);
    

    return user && roles && user.roles && roles.some(role => user.roles.includes(role)) ? children : null;
};

function App() {
    return (
        <AuthProvider>
  <DndProvider backend={HTML5Backend}>

                <AppContent />
                </DndProvider>,

        </AuthProvider>
    );
}

const AppContent = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, setUser } = useContext(AuthContext);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isTeacher, setIsTeacher] = useState(false);
    const [username, setUsername] = useState('');
    const [roles, setRoles] = useState([]);
// Lưu trữ roles đúng cách
const handleLogin = (email, token, userId, roles) => {
    if (!Array.isArray(roles)) {
        console.error('Invalid roles format:', roles);
        return;
    }

    localStorage.setItem('token', token);
    localStorage.setItem('userId', userId);
    localStorage.setItem('roles', JSON.stringify(roles)); // Lưu trữ roles như JSON

    setUser({ email, token, userId, roles });
    console.log('Logged in user:', { email, token, userId, roles });
    navigate('/');
};

useEffect(() => {
    const token = localStorage.getItem('token');
    const storedRoles = localStorage.getItem('roles');

    try {
        const parsedRoles = storedRoles ? JSON.parse(storedRoles) : [];

        if (token && !user) {
            axiosInstance.get('/auth/status').then(response => {
                setUser({ ...response.data.user, token });
                setRoles(parsedRoles); // Sử dụng roles đã được kiểm tra
            }).catch(error => {
                console.error('Error fetching user:', error);
            });
        } else if (user) {
            setRoles(user.roles || []);
        }
    } catch (error) {
        console.error('Error parsing roles from localStorage:', error);
        setRoles([]); // Đặt roles là mảng rỗng nếu có lỗi xảy ra
    }
}, [user, setUser]);


useEffect(() => {
    if (user) {
        setIsAdmin(user.roles && user.roles.includes('Admin'));
        setIsTeacher(user.roles && user.roles.includes('Teacher'));
        setUsername(user.username);
        try {
            const storedRoles = localStorage.getItem('roles');
            const parsedRoles = storedRoles ? JSON.parse(storedRoles) : [];
            setRoles(parsedRoles);
        } catch (error) {
            console.error('Error parsing roles from localStorage:', error);
            setRoles([]); // Đặt roles là mảng rỗng nếu có lỗi xảy ra
        }
    } else {
        setIsAdmin(false);
        setIsTeacher(false);
        setUsername('');
        setRoles([]);
    }
}, [user]);


    const handleMenuToggle = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleCloseMenu = () => {
        setIsMenuOpen(false);
    };


    const handleLogout = async () => {
        try {
            await axiosInstance.post('/auth/logout');
            localStorage.removeItem('token');
            setUser(null);
            navigate('/login');
            setRoles([]);
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    const hideMenuPaths = ["/courses/coursescontent"];
    const isMenuHidden = hideMenuPaths.includes(location.pathname);

    return (
        <div>
             <Header
                isMenuOpen={isMenuOpen}
                handleMenuToggle={handleMenuToggle}
                handleCloseMenu={handleCloseMenu}
                isLoggedIn={!!user}
                username={username}
                roles={roles}
                handleLogout={handleLogout}
            />
            <div className={`content ${isMenuHidden ? 'full-height' : ''}`}>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/blog" element={<Blog />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/AboutCourse" element={<AboutCourse />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/login" element={<Login onLogin={handleLogin} />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/reset-password/:token" element={<ResetPassword />} />
                    <Route path="/courses/learn/:title" element={<Learn />} />
                    <Route path="/courses/learn/:title/:view" element={<Learn />} />
                    <Route path="/courses/coursescontent/:title" element={<CoursesContent />} />
                    <Route path="/courses/vocabulary/:title/:unit" element={<Vocabulary />} />
                    <Route path="/courses/grammar/:title/:unit/:mau_cau" element={<Grammar />} />
                    <Route path="/courses/grammar/:title/:unit" element={<Grammar />} />
                    <Route path="/courses/kanji/:title/:unit" element={<Kanji />} />
                    <Route path="/courses/test/:title" element={<Test />} />
                    <Route path="/purchases" element={<Purchase />} />
                    {isAdmin && (
                        <Route path="/admin/*" element={<ProtectedRoute roles={['Admin']}><Admin /></ProtectedRoute>}>
                            <Route path="dashboard" element={<Dashboard />} />
                            <Route path="tables" element={<Tables />} />
                            <Route path="users" element={<Users />} />
                            <Route path="courses" element={<Courses />} />
                        </Route>
                    )}
                    {isTeacher && (
                        <Route path="/teacher/manage" element={<ProtectedRoute roles={['Teacher']}><TeacherManagement /></ProtectedRoute>} />
                    )}
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </div>
            <Footer />
        </div>
    );
};

export default App;

