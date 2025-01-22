import React from "react";
import Logo from "../../common/logo/logo";
import Nav from "./navLinks";
const Header = () => {
  return (
    <>
      <header className="bg-black shadow-md sticky top-0 flex-wrap z-20 mx-auto flex w-full items-center justify-between p-8">
        <Logo />
        <Nav />
      </header>
    </>
  );
};

export default Header;
