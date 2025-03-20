import React from "react";
import { Breadcrumbs as MUIBreadcrumbs, Link } from "@mui/material";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { useLocation, Link as RouterLink } from "react-router-dom";

const Breadcrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  return (
    <MUIBreadcrumbs
      separator={<NavigateNextIcon fontSize="small" />}
      aria-label="breadcrumb"
      sx={{ my: 2 }}
    >
      <Link component={RouterLink} to="/" underline="hover" sx={{ color: "#B7152F" }}>
        Home
      </Link>
      {pathnames.map((value, index) => {
        const routeTo = `/${pathnames.slice(0, index + 1).join("/")}`;
        return (
          <Link
            key={routeTo}
            component={RouterLink}
            to={routeTo}
            underline="hover"
            sx={{ color: "#B7152F" }}
          >
            {value}
          </Link>
        );
      })}
    </MUIBreadcrumbs>
  );
};

export default Breadcrumbs;
