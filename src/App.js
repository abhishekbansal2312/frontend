import { BrowserRouter, Routes, Route } from "react-router-dom";
import DashBoard from "./pages/DashBoard";
import Items from "./pages/Items";
import Form from "./pages/Form";
import Login from "./pages/Login";
import { AuthProvider } from "./pages/AuthProvider"; // Import the AuthProvider

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/dashboard" element={<DashBoard />} />
        <Route path="/items" element={<Items />} />
        <Route path="/" element={<Form />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}
