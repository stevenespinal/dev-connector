import {Route} from "react-router";
import React from "react";
import Alert from "../layout/Alert";
import {Switch} from "react-router-dom";
import Register from "../auth/Register";
import Login from "../auth/Login";
import Profiles from "../profiles/profiles";
import Profile from "../profile/profile";
import PrivateRoute from "./PrivateRoute";
import Dashboard from "../dashboard/Dashboard";
import CreateProfile from "../profile-form/createProfile";
import EditProfile from "../profile-form/editProfile";
import Posts from "../posts/posts";
import Post from "../post/post";
import AddExperience from "../profile-form/addExperience";
import AddEducation from "../profile-form/addEducation";
import NotFound from "../layout/NotFound";


const Routes = () => {
  return (
    <section className="container">
      <Alert/>
      <Switch>
        <Route exact path="/register" component={Register}/>
        <Route exact path="/login" component={Login}/>
        <Route exact path="/profiles" component={Profiles}/>
        <Route exact path="/profile/:id" component={Profile}/>
        <PrivateRoute exact path="/dashboard" component={Dashboard}/>
        <PrivateRoute exact path="/create-profile" component={CreateProfile}/>
        <PrivateRoute exact path="/edit-profile" component={EditProfile}/>
        <PrivateRoute exact path="/posts" component={Posts}/>
        <PrivateRoute exact path="/posts/:id" component={Post}/>
        <PrivateRoute exact path="/add-experience" component={AddExperience}/>
        <PrivateRoute exact path="/add-education" component={AddEducation}/>
        <Route component={NotFound}/>
      </Switch>
    </section>
  )
}

export default Routes;