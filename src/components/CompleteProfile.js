import { FilePond, registerPlugin } from "react-filepond";
import "filepond/dist/filepond.min.css";
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import { useState, useEffect } from "react";
import "../styles/CompleteProfile.css";
import profileBlank from "../img/user.png";
import { auth, db, storage } from "./utils/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useHistory } from "react-router-dom";
import { doc, setDoc } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { Loader } from "./Loader";
// Register the plugins
registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview);

function CompleteProfile(props) {
  const [user, setuser] = useState({});
  const [files, setFiles] = useState([]);
  const [datas, setdatas] = useState({
    profilePreview: profileBlank,
    photo: null,
  });
  const [showLoader, setshowLoarder] = useState(false);
  let history = useHistory();

  onAuthStateChanged(auth, (user) => {
    if (user) {
      //user is signed in
      setuser(user);
    } else {
      // User is signed out
      history.push("/");
    }
  });

  // useEffect(() => {
  //   console.log(datas);
  //   return () => {};
  // }, [files, datas]);

  function handleSubmit(e) {
    e.preventDefault();
    //force profile selection
    let selection = document.querySelector(".selected");
    if (!selection) {
      alert("choose a profile please");
      return;
    }
    //show loader
    setshowLoarder(true);
    // store files in storage
    let allfiles = [...files, datas.photo];
    let allfilesurl = allfiles.map((fileItem) => {
      return new Promise((resolve) => {
        let file;
        let userFileRef;
        if (allfiles.indexOf(fileItem) === allfiles.length - 1) {
          if (fileItem === null) resolve(null);
          file = fileItem;
          userFileRef = ref(storage, `images/${user.uid}/${file.name}`);
        } else {
          file = fileItem.file;
          userFileRef = ref(storage, `images/${user.uid}/files/${file.name}`);
        }

        const uploadTask = uploadBytesResumable(userFileRef, file);
        uploadTask.on(
          "state_changed",
          (snapshot) => {},
          (error) => {},
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              resolve(downloadURL);
            });
          }
        );
      });
    });

    //update firestore user informations
    Promise.all(allfilesurl).then((urls) => {
      const docRef = doc(db, "users", user.email);
      setDoc(
        docRef,
        {
          firstName: datas.firstName,
          lastName: datas.lastName,
          birthDate: datas.birthDate,
          birthPlace: datas.birthPlace,
          address: datas.address,
          tel: datas.tel,
          profile: datas.profile,
          photo: urls[urls.length - 1],
          files: urls.slice(0, urls.length - 1),
        },
        { merge: true }
      ).then(() => {
        //hide loader
        setshowLoarder(false);
        if (datas.profile === "transporter") history.push("/travelerdashboard");
        else history.push("/senderdashboard");
      });
    });
  }

  function handleInputChange(e) {
    let name = e.target.name;
    let value = e.target.value;
    setdatas({ ...datas, [name]: value });
  }

  function handleProfilePic(e) {
    if (e.target.files[0]) {
      //show preview
      let photo = e.target.files[0];
      let profilePreview = URL.createObjectURL(photo);
      setdatas({ ...datas, profilePreview: profilePreview, photo: photo });
    }
  }

  function handleProfileChoice(e) {
    let target = e.target;
    let profile = target.dataset.profile;
    setdatas({ ...datas, profile });
    let selected = document.querySelector(".selected");
    if (selected) {
      selected.classList.remove("selected");
      target.classList.add("selected");
    }
    target.classList.add("selected");
  }

  return (
    <div>
      <div className="completeProfile">
        <h2>Complete your Profile to start using wannaKilos</h2>
        <form id="completeProfileForm" onSubmit={handleSubmit}>
          <input
            type="file"
            id="profilePic"
            onChange={handleProfilePic}
            accept="image/*)"
          />
          <br></br>
          <label id="profilePiclabel" htmlFor="profilePic">
            <div className="profileWrapper">
              <img
                src={datas.profilePreview}
                id="profilePreview"
                alt="profilePreview"
              />
              <img
                src="https://img.icons8.com/ios-glyphs/30/000000/edit--v1.png"
                id="changeImage"
                alt="changeImage"
              />
            </div>
          </label>
          <br />
          <input
            type="text"
            name="firstName"
            onChange={handleInputChange}
            required
            placeholder="First name"
          />
          <br></br>
          <input
            type="text"
            name="lastName"
            onChange={handleInputChange}
            required
            placeholder="Last name"
          />
          <br></br>
          <input
            type="text"
            name="birthDate"
            onChange={handleInputChange}
            required
            placeholder="Birth date"
            onFocus={(e) => {
              e.target.type = "date";
            }}
            onBlur={(e) => {
              e.target.type = "text";
            }}
          />
          <br></br>
          <input
            type="text"
            name="birthPlace"
            onChange={handleInputChange}
            required
            placeholder="Birth place"
          />
          <br></br>
          <input
            type="text"
            name="address"
            onChange={handleInputChange}
            required
            placeholder="Address"
          />
          <br></br>
          <input
            type="tel"
            name="tel"
            onChange={handleInputChange}
            required
            placeholder="Phone number"
          />
          <br></br>
          <FilePond
            files={files}
            onupdatefiles={setFiles}
            allowMultiple={true}
            maxFiles={3}
            name="files"
            labelIdle='Identity card or <span class="filepond--label-action">passport</span>'
          />
          <div style={{ marginTop: "25px" }}>You want to :</div>
          <div className="profilesWrapper">
            <div
              data-profile="sender"
              className="profile"
              onClick={handleProfileChoice}
            >
              Send Packages
            </div>
            <div
              data-profile="transporter"
              className="profile"
              onClick={handleProfileChoice}
            >
              Offer Kilos
            </div>
          </div>
          <input type="submit" value="Send" />
        </form>
      </div>
      {showLoader && <Loader />}
    </div>
  );
}

export default CompleteProfile;
