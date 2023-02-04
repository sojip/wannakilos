import "./ContactSupport.css";
import { TextField } from "@mui/material";
import { useState } from "react";
import { FilePond, registerPlugin } from "react-filepond";
import "filepond/dist/filepond.min.css";
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
// Register the plugins
registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview);

const ContactSupport = (props) => {
  const [files, setFiles] = useState([]);
  const [isSubmitting, setissubmitting] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    setissubmitting(true);
    //check inputs and send them to the requests
  }

  return (
    <div className="container contact-support">
      <div className="wrapper">
        <form action="" id="contact-support">
          <TextField
            id="summary"
            label="Summary"
            fullWidth
            margin="normal"
            required
          />
          <TextField
            fullWidth
            id="description"
            label="Description"
            multiline
            minRows={4}
            margin="normal"
            required
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
