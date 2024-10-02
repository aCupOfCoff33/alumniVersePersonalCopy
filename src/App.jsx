import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./assets/components/Header.jsx";
import IntroForFirstPage from "./assets/components/IntroforFirstPage.jsx";
import AboutPage from "./assets/components/About/AboutPage.jsx"; 
import Footer from "./assets/components/Footer.jsx";
import PresentingIt from "./assets/components/Networking/Presentingit.jsx";
import ContactPage from "./assets/components/ContactUs/ContactPage.jsx"

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<IntroForFirstPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/network" element={<PresentingIt />} />
        <Route path = "/contact" element = {<ContactPage />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
