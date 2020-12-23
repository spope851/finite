import React from 'react'
import styled from 'styled-components'

class PlayerDetails extends React.Component{
  render() {
    let base = this.props.data.height_inches !== 0 ? this.props.data.height_inches : this.props.data.height_feet
    let price = ((base+10)*1.16).toFixed(2)
    return (
      <>
        <p><span>Price: <Price onClick={e => e.target === e.currentTarget && this.props.trade(price)}>{price}</Price></span></p>
        <p>{'Position: '+this.props.data.position}</p>
        <p>{this.props.data.height_feet ? 'Height: '+this.props.data.height_feet+'\''+this.props.data.height_inches+'"' : ''}</p>
        {window.location.pathname.indexOf('team') === -1? <><span>Team: </span><a href={"/teams/"+this.props.data.team.id}>{this.props.data.team.full_name}</a></> : <p></p>}
      </>
    );
  }
}

const Price = styled.span`
&& {
  color:green;
  :hover {
    text-shadow: 0 0 5px #00ff00;
    cursor: pointer;
  }
}`

export default PlayerDetails;