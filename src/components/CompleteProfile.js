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
import { DatePickerComponent } from "@syncfusion/ej2-react-calendars";
import { TextBoxComponent } from "@syncfusion/ej2-react-inputs";

// Register the plugins
registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview);

function CompleteProfile(props) {
  const user = props.user;
  const [files, setFiles] = useState([]);
  const [datas, setdatas] = useState({
    profilePreview: profileBlank,
    photo: null,
  });
  const [showLoader, setshowLoarder] = useState(false);
  let history = useHistory();

  useEffect(() => {
    let inputs = document.querySelectorAll(
      "input[type='text'], input[type='tel'], input[id='birthDate'] "
    );
    inputs.forEach((input) => input.setAttribute("required", true));
  }, [datas]);

  function handleSubmit(e) {
    e.preventDefault();
    //show loader
    setshowLoarder(true);
    // store files in storage and get urls
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
      const docRef = doc(db, "users", user.uid);
      setDoc(
        docRef,
        {
          firstName: datas.firstName,
          lastName: datas.lastName,
          birthDate: datas.birthDate,
          birthPlace: datas.birthPlace,
          address: datas.address,
          tel: datas.tel,
          // profile: datas.profile,
          photo: urls[urls.length - 1],
          files: urls.slice(0, urls.length - 1),
          bookings: [],
        },
        { merge: true }
      ).then((e) => {
        //hide loader
        setshowLoarder(false);
        history.push("/");
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
      setdatas({ ...datas, profilePreview, photo });
    }
  }

  function handleDatePicker(e) {
    let value = e.target.value;
    console.log(value);
    if (!value) return;
    let name = e.target.name;
    let year = value.getFullYear();
    let month = value.getMonth() + 1;
    let day = value.getDate();
    let date = `${year}-${month}-${day}`;
    setdatas({ ...datas, [name]: date });
  }

  return (
    <div>
      <div className="completeProfile">
        <div className="formWrapper">
          <h2 style={{ textAlign: "center" }}>
            Complete your Profile to start using wannaKilos
          </h2>
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
            <TextBoxComponent
              name="firstName"
              placeholder="First Name"
              floatLabelType="Auto"
              onChange={handleInputChange}
              id="firstName"
            />
            <TextBoxComponent
              name="lastName"
              placeholder="Last Name"
              floatLabelType="Auto"
              onChange={handleInputChange}
              id="lastName"
            />
            <DatePickerComponent
              id="birthDate"
              name="birthDate"
              placeholder="Birth date"
              onChange={handleDatePicker}
              strictMode={true}
              start="Year"
              format="yyyy-MM-dd"
            />
            <TextBoxComponent
              name="birthPlace"
              placeholder="Birth place"
              floatLabelType="Auto"
              onChange={handleInputChange}
              id="birthPlace"
            />
            <TextBoxComponent
              name="address"
              placeholder="Address"
              floatLabelType="Auto"
              onChange={handleInputChange}
              id="address"
            />
            <TextBoxComponent
              name="tel"
              placeholder="Phone number"
              floatLabelType="Auto"
              onChange={handleInputChange}
              id="tel"
              type="tel"
            />

            <FilePond
              files={files}
              onupdatefiles={setFiles}
              allowMultiple={true}
              maxFiles={3}
              name="files"
              labelIdle='Identity card or <span class="filepond--label-action">passport</span>'
            />
            <input type="submit" value="Send" />
          </form>
        </div>
      </div>
      {showLoader && <Loader />}
    </div>
  );
}

export default CompleteProfile;
