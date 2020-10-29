import React, {useState, Fragment, useEffect} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {Link, withRouter} from "react-router-dom";
import {createProfile, getCurrentProfile} from "../../actions/profile";

const initialState = {
  company: '',
  website: '',
  location: '',
  status: '',
  skills: '',
  githubUsername: '',
  bio: '',
  twitter: '',
  facebook: '',
  linkedIn: '',
  youtube: '',
  instagram: '',
};

const EditProfile = ({createProfile, history, getCurrentProfile, profile: {profile, loading}}) => {
  const [formData, setFormData] = useState(initialState);

  const {company, website, location, status, skills, githubUsername, bio, twitter, facebook, youtube, linkedIn, instagram} = formData;

  const [displaySocialInput, toggleSocialInput] = useState(false);

  useEffect(() => {
    if (!profile) getCurrentProfile();
    if (!loading && profile) {
      const profileData = {...initialState};
      for (const key in profile) {
        if (key in profileData) profileData[key] = profile[key];
      }
      for (const key in profile.social) {
        if (key in profileData) profileData[key] = profile.social[key];
      }
      if (Array.isArray(profileData.skills)) {
        profileData.skills = profileData.skills.join(', ');
      }
      setFormData(profileData);
    }
  }, [loading, getCurrentProfile, profile]);

  const handleChange = e => setFormData({
    ...formData, [e.target.name]: e.target.value
  });

  const handleSubmit = e => {
    e.preventDefault();
    createProfile(formData, history, true);
  }

  return (
    <Fragment>
      <section className="container">
        <h1 className="large text-primary">
          Create Your Profile
        </h1>
        <p className="lead">
          <i className="fas fa-user"/> Let's get some information to make your
          profile stand out
        </p>
        <small>* = required field</small>
        <form className="form" onSubmit={e => handleSubmit(e)}>
          <div className="form-group">
            <select name="status" value={status} onChange={e => handleChange(e)}>
              <option value="0">* Select Professional Status</option>
              <option value="Developer">Developer</option>
              <option value="Junior Developer">Junior Developer</option>
              <option value="Senior Developer">Senior Developer</option>
              <option value="Manager">Manager</option>
              <option value="Student or Learning">Student or Learning</option>
              <option value="Instructor">Instructor or Teacher</option>
              <option value="Intern">Intern</option>
              <option value="Other">Other</option>
            </select>
            <small className="form-text">Give us an idea of where you are at in your career</small>
          </div>
          <div className="form-group">
            <input type="text" placeholder="Company" name="company" onChange={e => handleChange(e)} value={company}/>
            <small className="form-text">Could be your own company or one you work for</small>
          </div>
          <div className="form-group">
            <input type="text" placeholder="Website" name="website" onChange={e => handleChange(e)} value={website}/>
            <small className="form-text">Could be your own or a company website</small>
          </div>
          <div className="form-group">
            <input type="text" placeholder="Location" name="location" onChange={e => handleChange(e)} value={location}/>
            <small className="form-text">City & state suggested (eg. Boston, MA)</small>
          </div>
          <div className="form-group">
            <input type="text" placeholder="* Skills" name="skills" onChange={e => handleChange(e)} value={skills}/>
            <small className="form-text">Please use comma separated values (eg. HTML,CSS,JavaScript,PHP)</small>
          </div>
          <div className="form-group">
            <input
              type="text"
              placeholder="Github Username"
              name="githubUsername"
              onChange={e => handleChange(e)}
              value={githubUsername}
            />
            <small className="form-text">If you want your latest repos and a Github link, include your username</small>
          </div>
          <div className="form-group">
            <textarea placeholder="A short bio of yourself" name="bio" onChange={e => handleChange(e)} value={bio}/>
            <small className="form-text">Tell us a little about yourself</small>
          </div>

          <div className="my-2">
            <button type="button" className="btn btn-light" onClick={() => toggleSocialInput(!displaySocialInput)}>
              Add Social Network Links
            </button>
            <span>Optional</span>
          </div>

          {displaySocialInput && (
            <Fragment>
              <div className="form-group social-input">
                <i className="fab fa-twitter fa-2x"/>
                <input type="text" placeholder="Twitter URL" name="twitter" onChange={e => handleChange(e)}
                       value={twitter}/>
              </div>

              <div className="form-group social-input">
                <i className="fab fa-facebook fa-2x"/>
                <input type="text" placeholder="Facebook URL" name="facebook" onChange={e => handleChange(e)}
                       value={facebook}/>
              </div>

              <div className="form-group social-input">
                <i className="fab fa-youtube fa-2x"/>
                <input type="text" placeholder="YouTube URL" name="youtube" onChange={e => handleChange(e)}
                       value={youtube}/>
              </div>

              <div className="form-group social-input">
                <i className="fab fa-linkedin fa-2x"/>
                <input type="text" placeholder="Linkedin URL" name="linkedIn" onChange={e => handleChange(e)}
                       value={linkedIn}/>
              </div>

              <div className="form-group social-input">
                <i className="fab fa-instagram fa-2x"/>
                <input type="text" placeholder="Instagram URL" name="instagram" onChange={e => handleChange(e)}
                       value={instagram}/>
              </div>
            </Fragment>)
          }
          <input type="submit" className="btn btn-primary my-1" />
          <Link className="btn btn-light my-1" to="/dashboard">Go Back</Link>
        </form>
      </section>
    </Fragment>
  )
};

EditProfile.propTypes = {
  createProfile: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired,
  getCurrentProfile: PropTypes.func.isRequired
}

const mapStateToProps = state => ({
  profile: state.profile
})

export default connect(mapStateToProps, {createProfile, getCurrentProfile})(withRouter(EditProfile));
