import React, {useState} from "react";
import {useNavigate} from 'react-router-dom';

const Signup = (props) => {
    const [credentials, setCredentials] = useState({name: "", email: "", password: "", cpassword: ""});
    let navigate = useNavigate();

    const handleSubmitClick = async (e) =>{
        e.preventDefault();
        const {name, email, password} = credentials;
        // fetch API
        const response = await fetch("http://localhost:5000/api/auth/createuser", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({name, email, password})
        });
        const json = await response.json();
        if (json.success){
            // save auth-token and redirect
            localStorage.setItem('token', json.authToken);
            navigate("/");
            props.showAlert("Account created successfully!","success");
        }else{
            props.showAlert("Invalid details!", "danger")
        }
    }

    const onChange = (e) =>{
        setCredentials({...credentials, [e.target.name]: e.target.value})
    }

    const passwordsMatch = credentials.password && credentials.cpassword? credentials.password === credentials.cpassword: true;

    return (
        <div className="container mt-2">
            <h2 className="my-2">Create account to use iNoteBook</h2>
            <form onSubmit={handleSubmitClick}>
                <div className="mb-3">
                    <label htmlFor="name" className="form-label">Name</label>
                    <input type="text" className="form-control" id="name" name="name" aria-describedby="name" onChange={onChange}/>
                </div>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email address</label>
                    <input type="email" className="form-control" id="email" name="email" aria-describedby="email" onChange={onChange}/>
                    <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input type="password" className="form-control" id="password" name="password" aria-describedby="password" onChange={onChange} minLength={5} required/>
                    <div id="emailHelp" className="form-text">Password must be at least 5 characters long</div>
                </div>
                <div className="mb-3">
                    <label htmlFor="cpassword" className="form-label">Confirm Password</label>
                    <input type="password" className="form-control" id="cpassword" name="cpassword" aria-describedby="confirm password" onChange={onChange} minLength={5} required/>
                    {!passwordsMatch && (<div className="text-danger">Passwords do not match</div>)}
                </div>
                <button type="submit" className="btn btn-primary">Submit</button>
            </form>
        </div>
    )
};

export default Signup;
