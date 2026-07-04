import React from 'react';

const Sidebar = ({ children }: { children?: React.ReactNode }) => {
  return <div>
    Sidebar
    {children}
  </div>;
};

export default Sidebar;
