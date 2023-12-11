import React from "react";
import { TextField } from "@mui/material";
import { useState } from "react";
import { FilePond, registerPlugin } from "react-filepond";
import "filepond/dist/filepond.min.css";
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import { useAuthContext } from "components/auth/useAuthContext";
import { ToastContainer, toast } from "react-toastify";
import { Content } from "components/DashboardContent";
import { Form } from "components/DashboardForm";
import { FilePondFile } from "filepond";
import {
  createSupportRequest,
  storeFileAndGetUrl,
  updateRequestDetails,
} from "./utils";
import { Button } from "components/Button";
// Register the plugins
registerPlugin(
  FilePondPluginImageExifOrientation,
  FilePondPluginImagePreview,
  FilePondPluginFileValidateType
);

type FormDatas = {
  summary: string;
  description: string;
};

const ContactSupport = () => {
  const { user } = useAuthContext();
  const uid = user?.id;
  const [files, setFiles] = useState<FilePondFile[]>([]);
  const [datas, setdatas] = useState<FormDatas>({
    summary: "",
    description: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      let filesUrls = await Promise.all(
        files.map((item) => storeFileAndGetUrl(item, uid as string))
      );
      const supportRequest = await createSupportRequest(
        uid as string,
        datas.summary
      );
      await updateRequestDetails(
        supportRequest.id,
        datas.description,
        filesUrls
      );
      toast.success("Your request was successfully received");
      setIsSubmitting(false);
      setdatas({ summary: "", description: "" });
      setFiles([]);
      return;
    } catch (e) {
      toast.error(e.message);
    }
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    let name = e.target.name;
    let value = e.target.value;
    setdatas({ ...datas, [name]: value });
  }

  return (
    <Content>
      <ToastContainer />
      <Form onSubmit={handleSubmit}>
        <TextField
          id="summary"
          variant="standard"
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
          variant="standard"
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
          allowFileTypeValidation={true}
          acceptedFileTypes={["image/*"]}
          // @ts-ignore
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
          <Button type="submit" value="send" />
        )}
      </Form>
    </Content>
  );
};

export default ContactSupport;
