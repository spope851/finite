import React from 'react'
import { Backdrop, Fade, makeStyles, Modal as MuiModal } from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}))

interface OwnProps {
  open: boolean
  message: JSX.Element
  handleClose?: () => void
}

export const Modal: React.FC<OwnProps> = ({
  open,
  handleClose,
  message
}) => {
  const classes = useStyles()

  return (
    <MuiModal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      className={classes.modal}
      open={open}
      onClose={handleClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
      timeout: 500,
      }}>
        <Fade in={open}>
          <div className={classes.paper}>
            {message}
          </div>
        </Fade>
    </MuiModal>
  )
}