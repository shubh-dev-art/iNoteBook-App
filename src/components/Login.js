import React, {useState} from 'react'
import {useNavigate} from 'react-router-dom';

const Login = (props) => {
    const [credentials, setCredentials] = useState({email: "", password: ""});
    let navigate = useNavigate();

    const handleSubmitClick = async (e) =>{
        e.preventDefault();
        // fetch API
        const response = await fetch("http://localhost:5000/api/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({email: credentials.email, password: credentials.password})
        });
        const json = await response.json();
        if (json.success){
            // save auth-token and redirect
            localStorage.setItem('token', json.authToken);
            navigate("/");
            props.showAlert("Logged in successfully!","success");
        }else{
            props.showAlert("Invalid credentials!", "danger")
        }
    }

    const onChange = (e) =>{
        setCredentials({...credentials, [e.target.name]: e.target.value})
    }

    return (
        <div className='container'>
            <h2 className='my-2'>Login to iNoteBook</h2>
            <form onSubmit={handleSubmitClick}>
                <div className="my-3">
                    <label htmlFor="email" className="form-label">Email address</label>
                    <input type="email" className="form-control" id="email" name="email" aria-describedby="email" value={credentials.email} onChange={onChange}/>
                    <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
                </div>
                <div className="my-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input type="password" className="form-control" id="password" name="password" aria-describedby="password" value={credentials.password} onChange={onChange}/>
                    <div id="emailHelp" className="form-text">Password must be at least 5 characters long.</div>
                </div>
                <button type="submit" className="btn btn-primary">Submit</button>
            </form>
        </div>
    )
}

export default Login;
