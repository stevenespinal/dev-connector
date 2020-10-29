import React, {Fragment, useEffect} from 'react';
import {connect} from 'react-redux';
import {getProfileById} from "../../actions/profile";
import PropTypes from 'prop-types';
import Spinner from "../layout/Spinner";
import ProfileTop from "./ProfileTop";
import {Link} from "react-router-dom";
import ProfileAbout from "./ProfileAbout";
import ProfileExperience from "./ProfileExperience";
import ProfileEducation from "./ProfileEducation";
import ProfileGithub from "./ProfileGithub";

const Profile = ({getProfileById, auth, profile: {profile, loading}, match}) => {
  useEffect(() => {
    getProfileById(match.params.id);
  }, [getProfileById, match.params.id])
  return (
    <Fragment>
      {profile === null || loading ? <Spinner/> : (<Fragment>
        <Link to="/profiles" className="btn btn-primary">Back to Profiles</Link>
        {auth.isAuthenticated && auth.loading === false && auth.user._id === profile.user._id &&
        <Link to="/edit-profile" className="btn btn-dark">Edit Profile</Link>}
        <div className="profile-grid my-1">
          <ProfileTop profile={profile}/>
          <ProfileAbout profile={profile}/>
          <div className="profile-exp bg-white p-2">
            <h2 className="text-primary">Experience</h2>
            {profile.experience.length > 0 ? <Fragment>{profile.experience.map((exp) => {
              return (
                <ProfileExperience key={exp._id} experience={exp}/>
              )
            })}</Fragment> : <h4>No experience credentials.</h4>}
          </div>
          <div className="profile-edu bg-white p-2">
            <h2 className="text-primary">Education</h2>
            {profile.education.length > 0 ? <Fragment>{profile.education.map((edu) => {
              return (
                <ProfileEducation key={edu._id} education={edu}/>
              )
            })}</Fragment> : <h4>No experience credentials.</h4>}
          </div>
          {profile.githubUsername && <ProfileGithub username={profile.githubUsername}/>}
        </div>
      </Fragment>)}
    </Fragment>
  )
}

Profile.propTypes = {
  getProfileById: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  profile: state.profile,
  auth: state.auth
});

export default connect(mapStateToProps, {getProfileById})(Profile);