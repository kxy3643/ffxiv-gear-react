import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import $ from "jquery";

const getModalStyle = () => {
  return {
    top: `${50}%`,
    left: `${50}%`,
    transform: `translate(-${50}%, -${50}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function MyModal(props) {
  const classes = useStyles();
  const [modalStyle] = React.useState(getModalStyle);
  
  let body = (
    <div style={modalStyle} className={classes.paper}>
    <h2 id="simple-modal-title">{props.title}</h2>
    <p id="simple-modal-description">
    {props.message}
    </p>
    </div>
    );
    
    const handleClose = () => {
      setOpen(false);
      props.onClose(null);
    }
    const [open, setOpen] = React.useState(true);
    
    return (
      <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
      >
      {body}
      </Modal>
      );
    }
    
    
    export default MyModal;