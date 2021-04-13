import React from 'react'
import styled from 'styled-components'
import { Fab as MUIFab } from '@material-ui/core'
import AccountBalanceRounded from '@material-ui/icons/AccountBalanceRounded'

const Fab = styled(MUIFab)({
  background: 'linear-gradient(45deg, green 30%, green 90%)',
  border: 0,
  boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
  color: 'white'
})

interface OwnProps {
  toggleDrawer: () => void
}

export const BankFab:React.FC<OwnProps> = ({
  toggleDrawer
}) => {

  return (
    <Fab
      size="small"
      color="secondary"
      onClick={() => toggleDrawer()}>
      <AccountBalanceRounded />
    </Fab>
  )
}