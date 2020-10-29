import React, {Fragment} from "react";
import PropTypes from 'prop-types';
import Moment from 'react-moment';

const ProfileEducation = ({education: {school, degree, fieldOfStudy, current, to, from, description}}) => {
  return (
    <Fragment>
      <div>
        <h3 className="text-dark">{school}</h3>
        <p>{<Moment format="MM/DD/YYYY">{from}</Moment>} - { !to ? 'Now' : <Moment format="MM/DD/YYYY">{to}</Moment>}</p>
        <p><strong>Degree: </strong>{degree}</p>
        <p>
          <strong>Description: </strong> {description}
        </p>
        <p>
          <strong>Field Of Study: </strong> {fieldOfStudy}
        </p>
      </div>
    </Fragment>
  )
};

ProfileEducation.propTypes = {
  education: PropTypes.object.isRequired
}

export default ProfileEducation;
