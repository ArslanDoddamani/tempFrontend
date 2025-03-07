import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Emailviewer from "./Emailviewer";

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<><h1>Hello World</h1></>} />
                <Route path="/email-viewer" element={<Emailviewer />} />
            </Routes>
        </Router>
    );
};

export default App;
