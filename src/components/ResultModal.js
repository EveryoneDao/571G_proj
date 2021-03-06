import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { useEffect, useState } from "react";

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

export default function ResultModal(props) {
    const [open, setOpen] = React.useState(false);
    const [message, setMessage] = React.useState("");
    const handleClose = () =>{
        setOpen(false);
        props.handleModalClose();
    } 

    //called only once
    useEffect(() => { 
        async function fetchData() {
            console.log(props);
            setOpen(props.status);
            setMessage(props.result);
        }
        fetchData();
    }, [props]);

    return (
        <div>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        Voting Result is
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        {message}
                    </Typography>
                </Box>
            </Modal>
        </div>
    );
}