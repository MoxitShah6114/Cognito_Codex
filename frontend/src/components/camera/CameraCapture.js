import React, { useRef, useState, useCallback } from 'react';
import { Box, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import Webcam from 'react-webcam';

const CameraCapture = ({ onCapture, onCancel }) => {
  const webcamRef = useRef(null);
  const [img, setImg] = useState(null);
  
  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImg(imageSrc);
  }, [webcamRef]);
  
  const handleConfirm = () => {
    if (img) {
      onCapture(img);
    }
  };
  
  const handleRetake = () => {
    setImg(null);
  };

  return (
    <Dialog open={true} onClose={onCancel} maxWidth="md" fullWidth>
      <DialogTitle>Capture Image</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {!img ? (
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              videoConstraints={{
                width: 640,
                height: 480,
                facingMode: "environment"
              }}
              style={{ width: '100%', maxHeight: '70vh' }}
            />
          ) : (
            <img src={img} alt="captured" style={{ width: '100%', maxHeight: '70vh' }} />
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} color="secondary">
          Cancel
        </Button>
        {!img ? (
          <Button onClick={capture} color="primary">
            Take Photo
          </Button>
        ) : (
          <>
            <Button onClick={handleRetake} color="secondary">
              Retake
            </Button>
            <Button onClick={handleConfirm} color="primary">
              Confirm
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default CameraCapture;
