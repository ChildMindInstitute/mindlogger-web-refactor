import { Logo } from "~/shared/ui"

import "./style.scss"

const Footer = () => {
  const buildVersion = import.meta.env.VITE_BUILD_VERSION

  return (
    <footer className="d-flex justify-content-center align-items-center bg-light">
      <div className="mt-3 mb-3 text-center d-flex align-items-center">
        <Logo className="d-none d-sm-block" />
        <span className="d-none d-sm-block">&#169;</span>
        <a href="https://childmind.org" className="mx-1" target="_blank" rel="noreferrer">
          Child Mind Institute
        </a>
        <span className="d-none d-sm-block">MATTER Lab 2023</span>
        <a className="mx-4" href="https://mindlogger.org/terms" target="_blank" rel="noreferrer">
          Terms of Service
        </a>
        {buildVersion && <span className="text-secondary build-label">{buildVersion}</span>}
      </div>
    </footer>
  )
}

export default Footer
