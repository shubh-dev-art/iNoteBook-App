import './App.css';
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import NavBar from './components/NavBar';
import Home from './components/Home';
import About from './components/About';
import NoteState from './context/notes/NoteState';
import Alert from './components/Alert';
import Login from './components/Login';
import Signup from './components/Signup';
import React, {useState} from 'react';


function App() {
    const [alert, setAlert] = useState(null);
    
    const showAlert = (message , type)=>{
        setAlert({
            msg: message,
            type: type
        })
        setTimeout(() => {
            setAlert(null);
        }, 1500);
    }

    return (
        <>
            <NoteState>
                <Router>
                    <NavBar/>
                    <Alert alert={alert}/>
                    <div className="container">
                        <Routes>
                            <Route showAlert={showAlert} exact path ="/" element = {<Home />}/>
                            <Route exact path ="/about" element = {<About />}/>
                            <Route showAlert={showAlert} exact path ="/login" element = {<Login />}/>
                            <Route showAlert={showAlert} exact path ="/signup" element = {<Signup />}/>
                        </Routes>
                    </div>
                </Router>
            </NoteState>
        </>
    );
}

export default App;
