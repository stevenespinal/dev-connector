import React, {useState, Fragment} from 'react';
import {Link, Redirect} from "react-router-dom";
import {connect} from "react-redux";
import {setAlert} from "../../actions/alert";
import PropTypes from 'prop-types';
import {register} from "../../actions/auth";

const Register = ({setAlert, register, isAuthenticated}) => {

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const {name, email, password, confirmPassword} = formData;

  const handleChange = (e) => setFormData({...formData, [e.target.name]: e.target.value});

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setAlert("Passwords don't match", 'danger');
    } else if (password.length < 6 || confirmPassword.length < 6) {
      setAlert("Password must be 6 characters or longer.", 'danger');
    } else {
      register({name, email, password});
      setFormData({...formData, name: '', email: '', password: '', confirmPassword: ''});
    }
  }


  if (isAuthenticated) {
    return <Redirect to="/login"/>
  }
  return (
    <Fragment>
      <h1 className="large text-primary">Sign Up</h1>
      <p className="lead"><i className="fas fa-user"/> Create Your Account</p>
      <form className="form">
        <div className="form-group">
          <input type="text" placeholder="Name" name="name" onChange={e => handleChange(e)} value={name} required/>
        </div>
        <div className="form-group">
          <input type="email" placeholder="Email Address" name="email" value={email} onChange={e => handleChange(e)}
                 required/>
          <small className="form-text"
          >This site uses Gravatar so if you want a profile image, use a
            Gravatar email</small
          >
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Password"
            name="password"
            minLength="6"
            value={password}
            onChange={e => handleChange(e)}
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Confirm Password"
            name="confirmPassword"
            minLength="6"
            value={confirmPassword}
            onChange={e => handleChange(e)}
          />
        </div>
        <input type="submit" className="btn btn-primary" value="Register" onClick={handleSubmit}/>
      </form>
      <p className="my-1">
        Already have an account? <Link to="/login">Sign In</Link>
      </p>
    </Fragment>
  )
};

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated
});

Register.propTypes = {
  setAlert: PropTypes.func.isRequired,
  register: PropTypes.func.isRequired
}

export default connect(mapStateToProps, {setAlert, register})(Register);
