import Box from "@mui/material/Box"

import { Theme } from "~/shared/constants"

import "./style.scss"

const Footer = () => {
  const buildVersion = import.meta.env.VITE_BUILD_VERSION

  return (
    <Box
      id="app-footer"
      display="flex"
      justifyContent="center"
      alignItems="center"
      sx={{ backgroundColor: Theme.colors.light.surface, borderTop: `1px solid ${Theme.colors.light.surfaceVariant}` }}>
      <div className="mt-3 mb-3 text-center d-flex align-items-center">
        <span className="d-none d-sm-block">
          Mindlogger is a product of the{" "}
          <a href="https://childmind.org" target="_blank" rel="noreferrer">
            Child Mind Institute
          </a>{" "}
          &#169; 2023
        </span>
        <a className="mx-1 mx-md-4" href="https://mindlogger.org/terms" target="_blank" rel="noreferrer">
          Terms of Service
        </a>
        <a className="mx-4" href="https://help.mindlogger.org/" target="_blank" rel="noreferrer">
          Support
        </a>
        {buildVersion && <span className="text-secondary build-label">{buildVersion}</span>}
      </div>
    </Box>
  )
}

export default Footer
