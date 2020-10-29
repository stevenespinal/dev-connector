import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {addEducation} from "../../actions/profile";
import {Link, withRouter} from "react-router-dom";

const AddEducation = ({addEducation, history}) => {
  const [formData, setFormData] = useState({
    school: '',
    degree: '',
    fieldOfStudy: '',
    from: '',
    to: '',
    current: false,
    description: ''
  });

  const {school, degree, fieldOfStudy, from, to, current, description} = formData;

  const [toDateDisabled, toggleDisabled] = useState(false);

  const handleChange = (e) => setFormData({...formData, [e.target.name]: e.target.value});

  const handleSubmit = (e) => {
    e.preventDefault();
    addEducation(formData, history);
  }

  return (
    <section className="container">
      <h1 className="large text-primary">
        Add Your Education
      </h1>
      <p className="lead">
        <i className="fas fa-code-branch"/> Add any school or boot camp you have attended
      </p>
      <small>* = required field</small>
      <form className="form" onSubmit={handleSubmit}>
        <div className="form-group">
          <input type="text" placeholder="* School or Boot Camp" name="school" required value={school}
                 onChange={e => handleChange(e)}/>
        </div>
        <div className="form-group">
          <input type="text" placeholder="* Degree or Certificate" name="degree" required value={degree}
                 onChange={e => handleChange(e)}/>
        </div>
        <div className="form-group">
          <input type="text" placeholder="Field Of Study" name="fieldOfStudy" value={fieldOfStudy}
                 onChange={e => handleChange(e)}/>
        </div>
        <div className="form-group">
          <h4>From Date</h4>
          <input type="date" name="from" value={from} onChange={e => handleChange(e)}/>
        </div>
        <div className="form-group">
          <p><input type="checkbox" name="current" checked={current} value={current} onChange={() => {
            setFormData({...formData, current: !current});
            toggleDisabled(!toDateDisabled)
          }}/> Currently Enrolled</p>
        </div>
        <div className="form-group">
          <h4>To Date</h4>
          <input type="date" name="to" value={to} onChange={e => handleChange(e)}
                 disabled={toDateDisabled ? 'disabled' : ''}/>
        </div>
        <div className="form-group">
          <textarea
            name="description"
            cols="30"
            rows="5"
            placeholder="Program Description"
            value={description}
            onChange={e => handleChange(e)}
          />
        </div>
        <input type="submit" className="btn btn-primary my-1"/>
        <Link className="btn btn-light my-1" to="/dashboard">Go Back</Link>
      </form>
    </section>
  );
};

AddEducation.propTypes = {
  addEducation: PropTypes.func.isRequired
}


export default connect(null, {addEducation})(withRouter(AddEducation));