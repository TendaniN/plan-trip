import { useState } from "react";
import { Button, Modal, Box } from "@mui/material";
import { FaPlus } from "react-icons/fa6";

export const AddLocationModal = ({ tripId }: { tripId: string }) => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  // When add location if start is before trip start then update trip
  // If end is after trip end then update trip
  // Check if new location does not overlap with other locations
  // Location dates and location city

  return (
    <div>
      <Button onClick={handleOpen}>
        <FaPlus />
        Add Location
      </Button>
      <Modal open={open} onClose={handleClose}>
        <Box>Hello</Box>
      </Modal>
    </div>
  );
};
