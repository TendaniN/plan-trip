import { useState } from "react";
import { Button, Modal, Box } from "@mui/material";
import { FaRegEdit } from "react-icons/fa";

export const EditTripModal = () => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div>
      <Button onClick={handleOpen}>
        <FaRegEdit />
        Edit Trip
      </Button>
      <Modal open={open} onClose={handleClose}>
        <Box>Hello</Box>
      </Modal>
    </div>
  );
};
