import React, {Fragment} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
// import Spinner from "../layout/Spinner";
import {addLike, removeLike, deletePost} from "../../actions/post";
import Moment from 'react-moment';
import {Link} from "react-router-dom";

const PostItem = ({auth, post: {_id, text, name, avatar, user, likes, comments, date}, addLike, removeLike, deletePost, showActions}) => {
  return (
    <Fragment>
      <div className="post bg-white p-1 my-1">
        <div>
          <Link to={`/profile/${user}`}>
            <img
              className="round-img"
              src={avatar}
              alt="profile"
            />
            <h4>{name}</h4>
          </Link>
        </div>
        <div>
          <p className="my-1">
            {text}
          </p>
          <p className="post-date">
            Posted on <Moment format="MM/DD/YYYY">{date}</Moment>
          </p>
          {showActions && <Fragment>
            <button type="button" className="btn btn-light" onClick={() => addLike(_id)}>
              <i className="fas fa-thumbs-up"/> {likes.length > 0 && <span>{likes.length}</span>}
            </button>
            <button type="button" className="btn btn-light" onClick={() => removeLike(_id)}>
              <i className="fas fa-thumbs-down"/>
            </button>
            <Link to={`/posts/${_id}`} className="btn btn-primary">
              Discussion {comments.length > 0 && (
              <span className='comment-count'>{comments.length}</span>
            )}
            </Link>
          {!auth.loading && user === auth.user._id &&
          <button type="button" className="btn btn-danger" onClick={() => deletePost(_id)}>
            <i className="fas fa-times"/>
          </button>
          }
          </Fragment>
          }

        </div>
      </div>

    </Fragment>
  )
};

PostItem.propTypes = {
  post: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  addLike: PropTypes.func.isRequired,
  removeLike: PropTypes.func.isRequired,
  deletePost: PropTypes.func.isRequired
}

PostItem.defaultProps = {
  showActions: true
}

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps, {addLike, removeLike, deletePost})(PostItem);