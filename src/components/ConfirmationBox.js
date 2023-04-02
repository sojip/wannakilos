import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";

const ConfirmationBox = ({
  title,
  description,
  confirmKeyword,
  keyword,
  handleConfirmation,
  open,
  setopen,
  children,
}) => {
  const [keywordvalue, setkeywordvalue] = useState("");

  const handleClose = () => {
    setopen(false);
    setkeywordvalue("");
  };
  const onConfirmation = async () => {
    try {
      await handleConfirmation();
      handleClose();
      return;
    } catch (e) {
      toast.error(e.message);
    }
  };
  const handlekeywordinputChange = (e) => {
    setkeywordvalue(e.target.value);
  };
  return (
    <Dialog open={open} onClose={handleClose}>
      <ToastContainer />
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{description}</DialogContentText>
        {confirmKeyword && (
          <TextField
            autoFocus
            margin="dense"
            id="keywordvalue"
            type="text"
            fullWidth
            variant="standard"
            value={keywordvalue}
            inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
            onChange={handlekeywordinputChange}
          />
        )}
        {children}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button
          onClick={onConfirmation}
          disabled={
            confirmKeyword ? (keywordvalue === keyword ? false : true) : false
          }
        >
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationBox;
