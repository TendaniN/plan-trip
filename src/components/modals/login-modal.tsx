import { Modal, Button } from "@mui/material";
import { useState } from "react";
import { LoginForm } from "../forms/login-form";

export const LoginModal = () => {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <Button>Login</Button>
      <Modal open={open} onClose={() => setOpen(false)}>
        <LoginForm />
      </Modal>
    </div>
  );
};
