import React from "react";
import Image from "next/image";
import Link from "next/link";
const Logo = () => {
  return (
    <div className="logo">
      <Link href="/">
        <Image
          src={"/OscaredLogo.png"}
          alt="logo"
          title="logo"
          width={150}
          height={150}
          className="object-contain cursor-pointer"
        />
      </Link>
    </div>
  );
};

export default Logo;
