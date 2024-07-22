import { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';

const buttonStyle = {
  backgroundColor: 'forestgreen',
  color: 'black',
  weight: 'bold',
  width: '50%',
  fontSize: '16px',
};

const modalStyle = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'black',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export const SignUp = () => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [newName, setName] = useState("");
  const [newEmail, setEmail] = useState("");
  
  const handleCustomerNameInput = (event) => {
    setName(event.target.value);
  }
  
  const handleCustomerEmailInput = (event) => {
    setEmail(event.target.value);
  }
  
  const addCustomer = () => {
    // insertCustomer({ name: newName, location: newEmail }, props.user.id);
    setName("");
    setEmail("");
    handleClose();
  }

  return (
    <div>
      <Button onClick={handleOpen} style={buttonStyle}>Sign Up</Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={modalStyle} alignItems="center">
          <Typography id="modal-modal-title" variant="h6" component="h2" align='center'>
            Sign Up
          </Typography>
          <TextField
            id="customer-name"
            label="Enter Name"
            value={newName}
            onChange={() => handleCustomerNameInput(event)}
            variant="standard"
            color="primary"
            sx={{
              label: { color: 'white' },
              input: { color: 'white' }
            }}
          />
          <br />
          <br />
          <TextField
            id="customer-email"
            label="Enter Email"
            value={newEmail}
            onChange={() => handleCustomerEmailInput(event)}
            variant="standard"
            color="primary"
            sx={{
              label: { color: 'white' },
              input: { color: 'white' }
            }}
          />
          <br />
          <br />
          <button type="button" onClick={() => addCustomer()} style={{ 'marginTop': '10px' }}>
            Submit
          </button>
        </Box>
      </Modal>
    </div>
  );
}
