const express = require("express");
const connectDB = require("./config/db");
const userApi = require("./routes/api/users");
const authApi = require("./routes/api/auth");
const profileApi = require("./routes/api/profiles");
const postApi = require("./routes/api/posts");
const path = require("path");
const PORT = process.env.PORT || 5000;
const app = express();


connectDB();
app.use(express.json({extended: false}))

app.use("/api/users", userApi)
app.use("/api/auth", authApi)
app.use("/api/profile", profileApi)
app.use("/api/posts", postApi)

if (process.env.NODE_ENV === 'production') {
  app.use(express.static("client/build"));
  app.get("*", (req, res) => res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html')))
}

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))
