import React from 'react';

const Link = ({ children, href }) => {
  return <a href={href}>{children}</a>;
};

export default Link;
