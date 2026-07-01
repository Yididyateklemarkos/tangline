import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LangProvider } from './i18n/LangContext.jsx';
import { AdminProvider } from './AdminContext.jsx';
import Navbar from './components/Navbar.jsx';

import Home from './pages/Home.jsx';
import Catalog from './pages/Catalog.jsx';
import RequestProduct from './pages/RequestProduct.jsx';
import About from './pages/About.jsx';
import Contact from './pages/Contact.jsx';

import AdminLogin from './pages/AdminLogin.jsx';
import AdminLayout from './pages/AdminLayout.jsx';
import AdminProducts from './pages/AdminProducts.jsx';
import AdminCategories from './pages/AdminCategories.jsx';
import AdminRequests from './pages/AdminRequests.jsx';
import AdminMessages from './pages/AdminMessages.jsx';
import AdminAssistant from './pages/AdminAssistant.jsx';

function PublicLayout({ children }) {
  return (
    <>
      <Navbar />
      {children}
      <footer>© {new Date().getFullYear()} Tang Line Trading — Trade, the way it was always meant to move.</footer>
    </>
  );
}

export default function App() {
  return (
    <LangProvider>
      <AdminProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
            <Route path="/catalog" element={<PublicLayout><Catalog /></PublicLayout>} />
            <Route path="/request" element={<PublicLayout><RequestProduct /></PublicLayout>} />
            <Route path="/about" element={<PublicLayout><About /></PublicLayout>} />
            <Route path="/contact" element={<PublicLayout><Contact /></PublicLayout>} />

            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminLayout />}>
              <Route path="products" element={<AdminProducts />} />
              <Route path="categories" element={<AdminCategories />} />
              <Route path="requests" element={<AdminRequests />} />
              <Route path="messages" element={<AdminMessages />} />
              <Route path="assistant" element={<AdminAssistant />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AdminProvider>
    </LangProvider>
  );
}
