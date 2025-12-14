import { Typography, TextField, ClickAwayListener } from "@mui/material";
import { useState } from "react";
import { FaPen } from "react-icons/fa6";

interface Props {
  id: string;
  initialText?: string;
  onSave: (id: string, text: string) => void;
}

export const EditableText = ({ id, initialText = "", onSave }: Props) => {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(initialText);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    setIsEditing(false);
    onSave(id, text);
  };

  return (
    <ClickAwayListener onClickAway={handleSave}>
      {isEditing ? (
        <TextField
          value={text}
          onChange={(e) => setText(e.target.value)}
          onBlur={handleSave} // Saves when focus is lost
          autoFocus // Focuses the input when it appears
          size="small"
        />
      ) : (
        <Typography
          onClick={handleEdit}
          sx={{ cursor: "pointer", display: "flex", gap: "0.5rem" }}
        >
          {text}
          <FaPen style={{ margin: "auto 0" }} />
        </Typography>
      )}
    </ClickAwayListener>
  );
};
