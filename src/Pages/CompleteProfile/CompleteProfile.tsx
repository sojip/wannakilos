import profileBlank from "../../img/user.png";
import React from "react";
import { useState } from "react";
import { FilePond, registerPlugin } from "react-filepond";
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import FilePondPluginPdfPreview from "filepond-plugin-pdf-preview";
import "filepond/dist/filepond.min.css";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import "filepond-plugin-pdf-preview/dist/filepond-plugin-pdf-preview.min.css";
import { db, storage } from "../../components/utils/firebase";
import { doc, setDoc } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { TextField } from "@mui/material";
import { AdapterLuxon } from "@mui/x-date-pickers/AdapterLuxon";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useAuthContext } from "components/auth/useAuthContext";
import { DateTime } from "luxon";
import { ActualFileObject, FilePondFile } from "filepond";
import { UploadTask } from "@firebase/storage-types";
import { Form, Title } from "Pages/SignIn/SignIn";
import styled from "styled-components";
import { Button } from "components/Button";

// Register the plugins
registerPlugin(
  FilePondPluginImageExifOrientation,
  FilePondPluginImagePreview,
  FilePondPluginPdfPreview
);

interface ProfileProps {
  setshowLoader: React.Dispatch<React.SetStateAction<boolean>>;
}

interface ProfileDatas {
  photo: File;
  photoPreview: string;
  birthDate: DateTime | null;
  firstName: string;
  lastName: string;
  birthPlace: string;
  address: string;
  phoneNumber: number;
  files: ActualFileObject[];
  isprofilesubmitted?: boolean;
}

const Wrapper = styled.div`
  font-family: var(--textFont);
  padding-top: calc(10vh + 25px);
`;

const PhotoWrapper = styled.label`
  display: block;
  position: relative;
  width: 128px;
  height: 128px;
  margin: auto;
  border-radius: 50%;
  cursor: pointer;
  margin-bottom: 15px;
  box-shadow: rgba(50, 50, 93, 0.25) 0px 50px 100px -20px,
    rgba(0, 0, 0, 0.3) 0px 30px 60px -30px;
`;

const PhotoPreview = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
`;

const HiddenInput = styled.input`
  display: none;
`;

const Icon = styled.img`
  position: absolute;
  right: 1px;
`;

const P = styled.p`
  max-width: 400px;
  margin: auto;
  text-transform: capitalize;
  text-align: center;
  line-height: 30px;
  font-weight: bold;
`;

const Filepond = styled(FilePond)`
  margin: 5px auto;
`;

function CompleteProfile(props: ProfileProps) {
  const { setshowLoader } = props;
  const [datas, setdatas] = useState<ProfileDatas>({
    photoPreview: profileBlank,
    birthDate: null,
  } as ProfileDatas);
  const { user, setuser } = useAuthContext();
  const uid = user?.id;
  const isprofilesubmited = user?.isprofilesubmited;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    //show loader
    setshowLoader(true);
    // store files in storage and get urls
    let userFiles = [datas.photo, ...datas.files];
    let fileStorageRequests = userFiles.map((file) => {
      return new Promise((resolve, reject) => {
        let fileRef = undefined;
        if (userFiles.indexOf(file) === 0) {
          if (file === null) resolve(null);
          fileRef = ref(storage, `${uid}/profilephotos/${file.name}`);
        } else {
          fileRef = ref(storage, `${uid}/identityfiles/${file.name}`);
        }
        const uploadTask: UploadTask = uploadBytesResumable(fileRef, file);
        uploadTask.on(
          "state_changed",
          (snapshot) => {},
          (error) => {},
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then(
              (downloadURL: string) => {
                resolve(downloadURL);
              }
            );
          }
        );
      });
    });
    let fileURLS = await Promise.all(fileStorageRequests);
    if (!uid) return;
    const docRef = doc(db, "users", uid);
    await setDoc(docRef, {
      firstName: datas.firstName.toLowerCase(),
      lastName: datas.lastName.toLowerCase(),
      birthDate: datas.birthDate?.toISODate(),
      birthPlace: datas.birthPlace.toLowerCase(),
      address: datas.address.toLowerCase(),
      tel: datas.phoneNumber,
      photo: fileURLS[0],
      files: fileURLS.slice(1),
      isprofilesubmited: true,
    });
    setshowLoader(false);
    setuser({ ...user, isprofilesubmited: true });
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    let name = e.target.name;
    let value = e.target.value;
    setdatas({ ...datas, [name]: value });
  }

  function handleProfilePic(e: React.ChangeEvent<HTMLInputElement>) {
    const target = e.target as HTMLInputElement;
    const file = target.files ? target.files[0] : null;
    if (file) {
      const photo = file;
      const photoPreview = URL.createObjectURL(photo);
      setdatas({ ...datas, photoPreview, photo });
    }
  }

  return (
    <Wrapper>
      {isprofilesubmited ? (
        <P>
          Your profile is under review. <br /> We will reach out to you very
          soon...
        </P>
      ) : (
        <Form onSubmit={handleSubmit}>
          <Title>Complete your Profile to start using wannaKilos</Title>
          <PhotoWrapper htmlFor="photo">
            <HiddenInput
              type="file"
              id="photo"
              onChange={handleProfilePic}
              accept="image/*"
            />
            <PhotoPreview src={datas.photoPreview} alt="photo" />
            <Icon
              src="https://img.icons8.com/ios-glyphs/30/000000/edit--v1.png"
              alt="change"
            />
          </PhotoWrapper>
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
            name="phoneNumber"
            margin="dense"
            inputProps={{
              inputMode: "numeric",
              pattern: "[0-9]*",
            }}
          />
          <Filepond
            allowPdfPreview={true}
            pdfPreviewHeight={320}
            pdfComponentExtraParams={"toolbar=0&view=fit&page=1"}
            onaddfile={(err, fileItem) => {
              datas.files
                ? setdatas({
                    ...datas,
                    files: [...datas.files, fileItem.file],
                  })
                : setdatas({ ...datas, files: [fileItem.file] });
            }}
            onremovefile={(err, fileItem) => {
              setdatas({
                ...datas,
                files: datas.files.filter(
                  (file) => file.name !== fileItem.file.name
                ),
              });
            }}
            allowMultiple={true}
            maxFiles={3}
            name="files"
            labelIdle='Identity card or <span class="filepond--label-action">passport</span>'
          />
          <Button $outline={true} type="submit" value="Send" />
        </Form>
      )}
    </Wrapper>
  );
}

export default CompleteProfile;
