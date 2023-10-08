import React from "react";
import { MdOutlineAccountCircle } from "react-icons/md";
export const NavBar = () => {
  return (
    <div className="flex justify-between md:text-2xl items-center text-left p-4 text-lg uppercase bg-slate-100">
      <h2>Your Cloud</h2>
      <MdOutlineAccountCircle size={30} />
    </div>
  );
};
