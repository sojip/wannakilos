import "./ContactSupport.css";
import { TextField } from "@mui/material";
import { useState } from "react";
import { FilePond, registerPlugin } from "react-filepond";
import "filepond/dist/filepond.min.css";
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import { storage, db } from "../../components/utils/firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import useAuthContext from "../../components/auth/useAuthContext";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { ToastContainer, toast } from "react-toastify";
// Register the plugins
registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview);

const ContactSupport = (props) => {
  const [files, setFiles] = useState([]);
  const [datas, setdatas] = useState({ summary: "", description: "" });
  const [isSubmitting, setissubmitting] = useState(false);
  const user = useAuthContext();

  function handleSubmit(e) {
    e.preventDefault();
    setissubmitting(true);
    // store files in storage and get urls
    let attachedFilesUrls = files.map((item) => {
      return new Promise((resolve, reject) => {
        let fileRef = ref(
          storage,
          `files/${user.id}/attached/${item.file.name}`
        );
        const uploadTask = uploadBytesResumable(fileRef, item.file);
        uploadTask.on(
          "state_changed",
          (snapshot) => {},
          (error) => {
            reject(error);
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              resolve(downloadURL);
            });
          }
        );
      });
    });
    Promise.all(attachedFilesUrls)
      .then(async (urls) => {
        try {
          const docRef = await addDoc(collection(db, "claims"), {
            uid: user.id,
            summary: datas.summary,
            description: datas.description,
            files: [...urls],
            timestamp: serverTimestamp(),
          });
          toast.success("Your request was successfully received");
        } catch (e) {
          toast.error(e.message);
        }
        setissubmitting(false);
        setdatas({ summary: "", description: "" });
        setFiles([]);
        return;
      })
      .catch((e) => {
        toast.error(e.message);
      });
  }

  function handleChange(e) {
    let name = e.target.name;
    let value = e.target.value;
    setdatas({ ...datas, [name]: value });
  }

  return (
    <div className="container contact-support">
      <ToastContainer />
      <div className="wrapper">
        <form action="" id="contact-support" onSubmit={handleSubmit}>
          <TextField
            id="summary"
            label="Summary"
            fullWidth
            margin="normal"
            required
            onChange={handleChange}
            name="summary"
            value={datas.summary}
          />
          <TextField
            fullWidth
            id="description"
            label="Description"
            multiline
            minRows={4}
            margin="normal"
            required
            onChange={handleChange}
            name="description"
            value={datas.description}
          />
          <FilePond
            files={files}
            onupdatefiles={setFiles}
            allowMultiple={true}
            maxFiles={3}
            name="files"
            labelIdle='<span class="filepond--label-action">Attach Files</span>'
          />
          {isSubmitting ? (
            <div className="lds-dual-ring"></div>
          ) : (
            <input type="submit" value="send" />
          )}
        </form>
      </div>
    </div>
  );
};

export default ContactSupport;
