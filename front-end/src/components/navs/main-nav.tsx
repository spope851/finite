import React from 'react'
import { onThatTab } from '../../functions/on-that-tab'

export const MainNav:React.FC = () => {

  return (
    <ul className="nav align-self-end mr-auto animate__animated animate__fadeInDownBig">
      <li className={`nav-item`}>
        <a
          className={`navbar-brand text-dark nav-link ${onThatTab('/', true) ? 'active animate__animated animate__pulse animate__delay-2s' : ''}`}
          href="/">
            finite
        </a>
      </li>
      <li className={`nav-item`}>
        <a
          className={`nav-link text-muted ${onThatTab('players') ? 'active' : ''}`}
          href="/players">
            Players
        </a>
      </li>
      <li className={`nav-item`}>
        <a
          className={`nav-link text-muted ${onThatTab('account') ? 'active' : ''}`}
          href="/account">
            Account
        </a>
      </li>
    </ul>
  )
}