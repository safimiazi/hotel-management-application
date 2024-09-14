// LoginLayout.jsx
import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { HelmetProvider } from "react-helmet-async";

const LoginLayout = ({ children }) => {
    const [MyclassName, setMyClass] = useState("");

  return (
    <div>
      <HelmetProvider>
        <Helmet
          htmlAttributes={{
            lang: "en",
            dir: "ltr",
            "data-menu-styles": "dark",
            class: "light",
            "data-nav-layout": "vertical",
            "data-header-styles": "light",
            "data-vertical-style": "overlay",
            loader: "disable",
            "data-icon-text": MyclassName,
          }}
        />
        {children}
      </HelmetProvider>
    </div>
  );
};

export default LoginLayout;
