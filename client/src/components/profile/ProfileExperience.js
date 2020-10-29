import React, {Fragment} from "react";
import PropTypes from 'prop-types';
import Moment from 'react-moment';

const ProfileExperience = ({experience: {company, title, location, current, to, from, description}}) => {
  return (
    <Fragment>
      <div>
        <h3 className="text-dark">{company}</h3>
        <p>{<Moment format="MM/DD/YYYY">{from}</Moment>} { !to ? ' - Now' : <Moment format="MM/DD/YYYY">{to}</Moment>}</p>
        <p><strong>Position: </strong>{title}</p>
        <p>
          <strong>Description: </strong> {description}
        </p>
      </div>
    </Fragment>
  )
};

ProfileExperience.propTypes = {
  experience: PropTypes.object.isRequired
}

export default ProfileExperience;
