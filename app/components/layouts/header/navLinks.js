"use client";
import React from "react";
import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

const NavLinks = () => {
  return (
    <>
      <Link
        className="hover:text-yellow-500 hover:font-medium transition-colors"
        href="/merch"
      >
        Merchandising
      </Link>
      <Link
        className="hover:text-yellow-500 hover:font-medium transition-colors"
        href="/contacto"
      >
        Contacto
      </Link>
      <Link
        className="hover:text-yellow-500 hover:font-medium transition-colors"
        href="/estrenos"
      >
        Estrenos
      </Link>
      <Link
        className="hover:text-yellow-500 hover:font-medium transition-colors"
        href="/about"
      >
        Nosotros
      </Link>
    </>
  );
};

const Nav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleNavbar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <nav className="w-1/4 flex justify-end">
        {/* Usamos un breakpoint personalizado con max-w-[1475px] */}
        <div className="hidden w-full max-w-[1475px]:hidden xl:flex justify-between">
          <NavLinks />
        </div>
        <div className="xl:hidden max-w-[1475px]:flex">
          <button onClick={toggleNavbar}>{isOpen ? <X /> : <Menu />}</button>
        </div>
      </nav>
      {isOpen && (
        <div className="flex flex-col items-center basis-full">
          <NavLinks />
        </div>
      )}
    </>
  );
};
export default Nav;
