import React from 'react';
import Link from 'next/link';

const { shell } = require('electron');

function Navbar() {
  return (
    <React.Fragment>
      <div className="navbar bg-gradient-to-tr from-base-100 to-secondary shadow-2xl">
        <div className="navbar-start">
          <div className="dropdown">
            <label tabIndex={0} className="btn btn-ghost lg:hidden">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /></svg>
            </label>
            <ul tabIndex={0} className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52">
              <li>
                <Link href="/home">
                  <button className="bg-gradient-to-r from-primary to-primary-focus">Home</button>
                </Link>
              </li>
            </ul>
          </div>
          <div className='align-middle tooltip tooltip-right' data-tip="Vicuñas are regarded as the wild ancestors of the Alpaca">
            <p className="btn btn-ghost cursor-default normal-case text-xl " >Vicunia</p>
          </div>

        </div>
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1">
            <li>
              <Link href="/home">
                <button className="bg-gradient-to-r from-primary to-primary-focus">Home</button>
              </Link>
            </li>
          </ul>
        </div>
        <div className="navbar-end">
          <a onClick={() => shell.openExternal("https://github.com/EliasVincent/vicunia")} className="btn btn-base">Github</a>
        </div>
      </div>
    </React.Fragment>
  );
}

export default Navbar;
