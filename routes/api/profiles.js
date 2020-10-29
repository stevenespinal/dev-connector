const express = require("express");
const {check, validationResult} = require("express-validator");
const router = express.Router();
const auth = require("../../middleware/auth");
const Profile = require("../../models/Profile");
const User = require("../../models/User");
const Post = require("../../models/Post");
const mongoose = require("mongoose");
const request = require("request");
const config = require("config");
const axios = require("axios");

router.get("/me", auth, async (req, res) => {
  try {
    //populate allows you to send back certain information from a different collection, in this case you're grabbing name and avatar from the user collection and sending it back with Profile
    const profile = await Profile.findOne({user: req.user.id}).populate('user', 'name avatar');
    if (!profile) return res.status(400).json({message: "No profile for this user."});
    return res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error.");
  }
});

router.get("/", async (req, res) => {
  try {
    const profiles = await Profile.find().populate('user', 'name avatar');
    return res.json(profiles);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error.");
  }
});

router.get("/user/:user_id", async (req, res) => {
  try {
    const profile = await Profile.findOne({user: req.params.user_id}).populate('user', 'name avatar');
    if (!profile) return res.status(400).json({message: "Profile not found."});
    return res.json(profile);
  } catch (err) {
    console.error(err.message);
    if (!mongoose.Types.ObjectId.isValid(req.params.user_id))
      return res.status(400).json({message: 'Invalid user ID'});

    res.status(500).send("Server error.");
  }
});

router.post("/", [auth, [
  check('status', 'Status is required').not().isEmpty(),
  check('skills', 'Skills is required').not().isEmpty()
]], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({errors: errors.array()});
  }

  const {company, website, location, status, skills, bio, githubUsername, experience, education, youtube, linkedIn, instagram, facebook, twitter} = req.body;

  const profileFields = {};
  profileFields.user = req.user.id;
  if (company) profileFields.company = company;
  if (website) profileFields.website = website;
  if (location) profileFields.location = location;
  if (bio) profileFields.bio = bio;
  if (status) profileFields.status = status;
  if (githubUsername) profileFields.githubUsername = githubUsername;
  if (skills) {
    profileFields.skills = skills.split(',').map(skill => skill.trim());
  }

  profileFields.social = {};
  if (youtube) profileFields.social.youtube = youtube;
  if (linkedIn) profileFields.social.linkedIn = linkedIn;
  if (instagram) profileFields.social.instagram = instagram;
  if (facebook) profileFields.social.facebook = facebook;
  if (twitter) profileFields.social.twitter = twitter;

  try {
    let profile = await Profile.findOne({user: req.user.id});
    if (profile) {
      profile = await Profile.findOneAndUpdate({user: req.user.id}, {$set: profileFields}, {new: true});
      return res.json(profile);
    }
    profile = new Profile(profileFields);
    await profile.save();
    return res.json(profile);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

router.delete("/", auth, async (req, res) => {
  try {
    await Post.deleteMany({user: req.user.id});
    await Profile.findOneAndRemove({user: req.user.id});
    await User.findOneAndRemove({_id: req.user.id});
    return res.json({message: "User deleted."});
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

router.put("/experience", [auth, [
  check('title', "Title is required.").not().isEmpty(),
  check('company', "Company is required.").not().isEmpty(),
  check('from', "From date is required.").not().isEmpty()
]], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({errors: errors.array()});
  }
  const {title, company, from, location, to, current, description} = req.body;
  const newExperience = {
    title,
    company,
    location,
    current,
    description,
    from,
    to
  };

  try {
    const profile = await Profile.findOne({user: req.user.id});
    profile.experience.unshift(newExperience);
    await profile.save();
    return res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error.");
  }

});

router.delete("/experience/:exp_id", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({user: req.user.id});
    // profile.experience = profile.experience.filter(exp => exp._id.toString() !== req.params.exp_id);
    profile.experience = profile.experience.filter(
      (exp) => exp._id.toString() !== req.params.exp_id
    );
    await profile.save();
    return res.json(profile);
  } catch (err) {
    console.error(err.message);
  }
});


router.put("/education", [auth, [
  check('school', "School is required.").not().isEmpty(),
  check('degree', "Degree is required.").not().isEmpty(),
  check('from', "From date is required.").not().isEmpty(),
  check('fieldOfStudy', "Field of Study is required.").not().isEmpty()
]], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({errors: errors.array()});
  }
  const {school, degree, fieldOfStudy, from, to, current, description} = req.body;
  const newEducation = {
    school,
    degree,
    fieldOfStudy,
    current,
    description,
    from,
    to
  };

  try {
    const profile = await Profile.findOne({user: req.user.id});
    profile.education.unshift(newEducation);
    await profile.save();
    return res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error.");
  }

});

router.delete("/education/:edu_id", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({user: req.user.id});
    // profile.experience = profile.experience.filter(exp => exp._id.toString() !== req.params.exp_id);
    profile.education = profile.education.filter(
      (edu) => edu._id.toString() !== req.params.edu_id
    );
    await profile.save();
    return res.json(profile);
  } catch (err) {
    console.error(err.message);
  }
});
//
//
// router.get("/github/:username", async (req, res) => {
//   try {
//     // const options = {
//     //   uri: `https://api.github.com/users/${req.params.username}/repos?per_page=5&sort=created:asc&client_id=${config.get("githubClientId")}&client_secret=${config.get("githubSecret")}`,
//     //   method: "GET",
//     //   headers: {'user-agent': 'node-js'}
//     //   // uri: `https://api.github.com/user/repos?per_page=5`,
//     //   // headers: {authorization: `token ${config.get("githubSecretToken")}`, 'user-agent': 'node-js'}
//     // };
//
//     const options = {
//       uri: encodeURI(
//         `https://api.github.com/users/${req.params.username}/repos?per_page=5&sort=created:asc`
//       ),
//       method: 'GET',
//       headers: {
//         'user-agent': 'node.js',
//         Authorization: `token ${config.get('githubToken')}`
//       }
//     };
//
//     request(options, (error, response, body) => {
//       if (error) console.error(error);
//
//       if (response.statusCode !== 200) {
//         return res.status(404).json({message: "No github profile found."});
//       }
//
//       return res.json(JSON.parse(body));
//       // return res.json(body);
//     });
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send("Server Error.");
//   }
// });

router.get('/github/:username', async (req, res) => {
  try {
    const uri = encodeURI(
      `https://api.github.com/users/${req.params.username}/repos?per_page=5&sort=created:asc`
    );
    const headers = {
      'user-agent': 'node.js',
      Authorization: `token ${config.get('githubToken')}`
    };

    const gitHubResponse = await axios.get(uri, { headers });
    return res.json(gitHubResponse.data);
  } catch (err) {
    console.error(err.message);
    return res.status(404).json({ msg: 'No Github profile found' });
  }
});


module.exports = router;
