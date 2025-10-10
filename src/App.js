import React, {useEffect, useState} from "react";
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import { isMobile } from "react-device-detect";
import Home from "./pages/Home";
import MobileWarning from "./components/MobileWarning";



function App() {

    return (
         <Router>
             <Routes>
                 <Route
                     path="/"
                     element={isMobile ? <MobileWarning /> : <Home />} /> {/*Se apertura in mobile device, warning
                                                                             altrimenti viene caricata la webApp*/}
             </Routes>
         </Router>

         )
}

export default App
