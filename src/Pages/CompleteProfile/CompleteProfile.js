import { FilePond, registerPlugin } from "react-filepond";
import "filepond/dist/filepond.min.css";
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import { useState } from "react";
import "./CompleteProfile.css";
import profileBlank from "../../img/user.png";
import { db, storage } from "../../components/utils/firebase";
import { doc, setDoc } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import useAuthContext from "../../components/auth/useAuthContext";
import { TextField } from "@mui/material";
import { AdapterLuxon } from "@mui/x-date-pickers/AdapterLuxon";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

// Register the plugins
registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview);

function CompleteProfile(props) {
  const [files, setFiles] = useState([]);
  const [datas, setdatas] = useState({
    profilePreview: profileBlank,
    photo: null,
    birthDate: null,
  });
  const { setshowLoader } = props;
  const user = useAuthContext();
  const uid = user?.id;
  const isprofilesubmited = user?.isprofilesubmited;
  // const [isprofilesubmited, setisprofilesubmited] = useState(
  //   user?.isprofilesubmited
  // );

  function handleSubmit(e) {
    e.preventDefault();
    //show loader
    setshowLoader(true);
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
      const docRef = doc(db, "users", uid);
      setDoc(
        docRef,
        {
          firstName: datas.firstName.toLowerCase(),
          lastName: datas.lastName.toLowerCase(),
          birthDate: datas.birthDate.toISODate(),
          birthPlace: datas.birthPlace.toLowerCase(),
          address: datas.address.toLowerCase(),
          tel: Number(datas.tel),
          photo: urls[urls.length - 1],
          files: urls.slice(0, urls.length - 1),
          isprofilesubmited: true,
        },
        { merge: true }
      ).then(() => {
        //hide loader
        setshowLoader(false);
        user.setuser({ ...user, isprofilesubmited: true });
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

  return (
    <div className="completeProfile">
      {isprofilesubmited ? (
        <h2 style={{ textAlign: "center" }}>
          Your profile is under review
          <br />
          We will reach out to you very soon...
        </h2>
      ) : (
        <div className="completeProfileFormWrapper">
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
            <TextField
              id="firstName"
              label="First Name"
              required
              onChange={handleInputChange}
              fullWidth
              type="text"
              name="firstName"
              margin="dense"
            />
            <TextField
              id="lastName"
              label="Last Name"
              required
              onChange={handleInputChange}
              fullWidth
              type="text"
              name="lastName"
              margin="dense"
            />
            <LocalizationProvider dateAdapter={AdapterLuxon}>
              <DatePicker
                label="Birth Date"
                value={datas.birthDate}
                onChange={(newValue) => {
                  setdatas({
                    ...datas,
                    birthDate: newValue,
                  });
                }}
                renderInput={(params) => (
                  <TextField
                    margin="dense"
                    fullWidth
                    {...params}
                    helperText={"mm/dd/yyyy"}
                    required
                  />
                )}
              />
            </LocalizationProvider>
            <TextField
              id="birthPlace"
              label="Birth Place"
              required
              onChange={handleInputChange}
              fullWidth
              type="text"
              name="birthPlace"
              margin="dense"
            />
            <TextField
              id="address"
              label="Address"
              required
              onChange={handleInputChange}
              fullWidth
              type="text"
              name="address"
              margin="dense"
            />
            <TextField
              id="phoneNumber"
              label="Phone Number"
              required
              onChange={handleInputChange}
              fullWidth
              type="text"
              name="tel"
              margin="dense"
              inputProps={{
                inputMode: "numeric",
                pattern: "[0-9]*",
              }}
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
      )}
    </div>
  );
}

export default CompleteProfile;
