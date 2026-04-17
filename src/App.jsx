  import { BrowserRouter, Routes, Route } from 'react-router-dom';
  import Home from './pages/Home';
  import Detail from './pages/Detail';
  import Bookmark from "./pages/Bookmark";

  function App() {
    return (
      // BrowserRouter: Membungkus seluruh aplikasi untuk routing
      <BrowserRouter>
        <div className="min-h-screen bg-gray-50">
          {/* Routes: Container untuk semua Route */}
          <Routes>
            {/* Route: Menghubungkan URL dengan komponen */}
            <Route path="/" element={<Home />} />
            <Route path="/surat/:nomor" element={<Detail />} />
            {/* :nomor adalah parameter dinamis */}
            {/*Book mark */}
            <Route path="/bookmark" element={<Bookmark />} />
          </Routes>
        </div>
      </BrowserRouter>
    );
  }

  export default App; 
