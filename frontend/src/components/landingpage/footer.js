import React from 'react'
import { Link } from 'react-router-dom'
import SocialMedia from './social-media'
import './footer.css'

const Footer = () => {
  const today= new Date();
  const year = today.getFullYear();
  return (
    <footer className="footer-footer">
      <div className="footer-container">
        <div className="footer-container1">
          <span className="footer-text">GradeGo</span>
          <span>Copyright © {year}.</span>
        </div>
        <div className="social-media-container">
          <SocialMedia/>
        </div>
        <div className="footer-container2">
          <div className="footer-container3">
            <span className="footer-text02 Large">Quick Links</span>
            <span className="footer-text03 Large">
              <Link to="/login">Login</Link>
            </span>
            <span className="footer-text04 Large">Features</span>
            <span className="footer-text04 Large">
              <Link to="/contact">
                Contact Us
              </Link></span>
            <span className="footer-text05 Large">About Us</span>
          </div>
        </div>
      </div>
      <img
        alt="image"
        src="/playground_assets/waves-white.svg"
        className="footer-image"
      />
    </footer>
  )
}

export default Footer
