import React from "react";

const MainLayout = async ({ children }) => {
  return (
    <div className="container mx-auto mb-20 mt-28 px-4 md:px-6">
      <div className="section-shell min-h-[70vh] p-4 md:p-6">{children}</div>
    </div>
  );
};

export default MainLayout;
