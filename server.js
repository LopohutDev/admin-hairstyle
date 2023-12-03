// server.js
const express = require("express");
const admin = require("firebase-admin");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();

app.use(cors());
app.use(bodyParser.json({ limit: "50mb" }));
app.use(
  bodyParser.urlencoded({
    limit: "50mb",
    extended: true,
    parameterLimit: 50000,
  })
);

// Initialize Firebase Admin SDK
const serviceAccount = require("./serviceAccountKey.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://hairstyledatabase-default-rtdb.firebaseio.com",
  storageBucket: "hairstyledatabase.appspot.com",
});

// Endpoint to get the user list
app.get("/api/users", async (req, res) => {
  try {
    const userRecords = await admin.auth().listUsers();
    const db = admin.database();
    // User Profiling
    const userProfileDataRef = db.ref("User_Profiling");
    const userProfileSnapshot = await userProfileDataRef.once("value");
    const userProfile = userProfileSnapshot.val();
    // User Feedback
    const userFeedbackDataRef = db.ref("Feedback User");
    const userFeedbackSnapshot = await userFeedbackDataRef.once("value");
    const userFeedback = userFeedbackSnapshot.val();

    const userList = userRecords.users.map((user) => {
      const userFeedbackArray = Object.values(userFeedback);

      const checkedUserData = userProfile[user.uid];
      const checkedUserFeedback = userFeedbackArray.find(
        (fb) => fb.userId === user.uid
      );

      if (checkedUserData) {
        return {
          createdAt: user.metadata.creationTime,
          email: user.email,
          fullName: checkedUserData.fullname,
          photo: checkedUserData.profilePicUri,
          role: checkedUserData.role,
          uid: user.uid,
          feedback: checkedUserFeedback && checkedUserFeedback.text,
          rating: checkedUserFeedback && checkedUserFeedback.rating,
          dob: checkedUserData.dob,
          gender: checkedUserData.gender,
          phoneNumber: checkedUserData.phonenumber,
        };
      }
    });

    const filteredList = userList.filter((d) => d !== (null || undefined));

    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ userList: filteredList, count: userList.length }));
  } catch (error) {
    console.error("Error fetching user list:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Endpoint to delete a user by UID
app.delete("/api/users/:uid", async (req, res) => {
  try {
    const uid = req.params.uid;

    // Fetch user data to get the photo URL
    const db = admin.database();

    const userProfileDataRef = db.ref("User_Profiling");

    // Delete the user from Firebase Authentication
    await admin.auth().deleteUser(uid);

    // Delete additional user data from your database (e.g., User_Profiling)
    await userProfileDataRef.child(uid).remove();

    // Delete the user's photo from Firebase Storage
    const storage = admin.storage();
    const photoRef = storage
      .bucket()
      .file(`profile_pics/${uid}/profile_pic.jpg`);
    if (photoRef) {
      await photoRef.delete();
    }

    // Send a success response
    res.status(200).json({ message: "User deleted successfully." });
  } catch (error) {
    console.error("Error deleting user:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Endpoint to add a new user
app.post("/api/users", async (req, res) => {
  try {
    const {
      fullName,
      role,
      age,
      gender,
      phoneNumber,
      photoBase64,
      dob,
      email,
      password,
    } = req.body;

    // Create the user in Firebase Authentication
    const userRecord = await admin.auth().createUser({
      email,
      password,
      displayName: fullName,
    });

    const { uid } = userRecord;

    console.log(userRecord);

    // // Add additional user data to your database (e.g., User_Profiling)
    const db = admin.database();
    const userProfileDataRef = db.ref("User_Profiling");

    // Add profilePicUri to User_Profiling if a photo is provided
    let profilePicUri = null;
    if (photoBase64) {
      const storage = admin.storage();
      const photoRef = storage
        .bucket()
        .file(`profile_pics/${uid}/profile_pic.jpg`);
      const base64Image = photoBase64.replace(/^data:image\/\w+;base64,/, "");
      const fileBuffer = Buffer.from(base64Image, "base64");

      await photoRef.save(fileBuffer, {
        metadata: {
          contentType: "image/jpeg",
        },
      });

      // Get the download URL for the photo
      const [url] = await photoRef.getSignedUrl({
        action: "read",
        expires: "03-09-2491",
      });
      profilePicUri = url;
    }

    // Add user details to User_Profiling
    await userProfileDataRef.child(uid).set({
      fullname: fullName,
      role: role,
      age: age,
      dob: dob,
      gender: gender,
      phonenumber: phoneNumber,
      email: userRecord.email,
      profilePicUri: profilePicUri, // Add the download URL of the photo
      // Add other user details as needed
    });

    // Send a success response
    res.status(201).json({ message: "User added successfully." });
  } catch (error) {
    console.error("Error adding user:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Endpoint to edit user information
app.put("/api/users/:uid", async (req, res) => {
  try {
    const uid = req.params.uid;
    const { fullName, role, gender, phoneNumber, photoBase64 } = req.body;

    // Update the user in Firebase Authentication
    await admin.auth().updateUser(uid, {
      displayName: fullName,
    });

    // Update additional user data in your database (e.g., User_Profiling)
    const db = admin.database();
    const userProfileDataRef = db.ref("User_Profiling");

    // Upload the user's photo to Firebase Storage if base64 data is provided
    let profilePicUri = null;
    if (photoBase64) {
      const storage = admin.storage();
      const photoRef = storage
        .bucket()
        .file(`profile_pics/${uid}/profile_pic.jpg`);
      const base64Image = photoBase64.replace(/^data:image\/\w+;base64,/, "");
      const fileBuffer = Buffer.from(base64Image, "base64");

      await photoRef.save(fileBuffer, {
        metadata: {
          contentType: "image/jpeg",
        },
      });

      // Get the download URL for the photo
      const [url] = await photoRef.getSignedUrl({
        action: "read",
        expires: "03-09-2491",
      });
      profilePicUri = url;
    }

    // Update user details in User_Profiling
    await userProfileDataRef.child(uid).update({
      fullname: fullName,
      role: role,
      gender: gender,
      phonenumber: phoneNumber,
      profilePicUri: profilePicUri, // Use the new download URL or keep the existing one
      // Update other user details as needed
    });

    // Send a success response
    res.status(200).json({ message: "User updated successfully." });
  } catch (error) {
    console.error("Error updating user:", error.message);
    res
      .status(500)
      .json({ error: "Internal Server Error", errorMessage: error });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
