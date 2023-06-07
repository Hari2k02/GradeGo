/**
 * Contact.js
 *
 * This file contains the Contact component, which is responsible for rendering
 * the contact form and contact information section of the GradeGo application.
 * It imports necessary dependencies and components, defines the Contact function,
 * and exports it as the default component.
 */

import React from 'react';
import { Helmet } from 'react-helmet';
import Header from '../components/landingpage/header';
import PrimaryBlueButton from '../components/landingpage/primary-blue-button';
import Footer from '../components/landingpage/footer';
import './contact.css';

/**
 * Contact component renders the contact form and contact information section.
 *
 * @returns {JSX.Element} The rendered Contact component.
 */
const Contact = () => {
  // Render the Contact component
  return (
    <div className="profile-container">
      <Helmet>
        <title>GradeGo</title>
        <meta property="og:title" content="GradeGo" />
      </Helmet>

      {/* Render the header */}
      <Header rootClassName="header-root-class-name"></Header>

      <div className="profile-contact">
        <div className="profile-container09">
          <div className="profile-form">
            {/* Render the form heading */}
            <h2 className="profile-text18 HeadingOne">
              <span>Say Hi!</span>
            </h2>

            {/* Render the form description */}
            <span className="profile-text20 Lead">
              We&apos;d like to hear from you.
            </span>

            <form className="profile-form1">
              {/* Render the name input field */}
              <label className="profile-text21 Label">My name is</label>
              <input
                type="text"
                placeholder="Full Name"
                className="profile-textinput Small input"
              />

              {/* Render the email input field */}
              <label className="profile-text22 Label">My email is</label>
              <input
                type="email"
                placeholder="Your email address"
                className="profile-textinput1 Small input"
              />

              {/* Render the message textarea */}
              <label className="profile-text23 Label">My message</label>
              <textarea
                rows="8"
                placeholder="I want to say that..."
                className="profile-textarea textarea Small"
              ></textarea>
            </form>

            <div className="profile-container10">
              <div className="profile-container11">
                {/* Render the send message button */}
                <PrimaryBlueButton button="send message"></PrimaryBlueButton>
              </div>
            </div>
          </div>

          <div className="profile-info">
            <div className="profile-container12">
              {/* Render the contact information heading */}
              <h3 className="HeadingTwo">
                <span>
                  Contact
                  <span
                    dangerouslySetInnerHTML={{
                      __html: ' ',
                    }}
                  />
                </span>
                <span>Information</span>
              </h3>

              {/* Render the contact information description */}
              <span className="profile-text27">
                Fill up the form and our team will get back to you within 24
                hours.
              </span>

              <div className="profile-container13">
                <div className="profile-container14">
                  {/* Render the phone icon */}
                  <svg viewBox="0 0 1024 1024" className="profile-icon02">
                    <path d="M742 460l-94-94q-18-18-10-44 24-72 24-152 0-18 12-30t30-12h150q18 0 30 12t12 30q0 300-213 513t-513 213q-18 0-30-12t-12-30v-150q0-18 12-30t30-12q80 0 152-24 24-10 44 10l94 94q186-96 282-282z"></path>
                  </svg>

                  {/* Render the phone number link */}
                  <a
                    href="tel:+12 345 678 901"
                    className="profile-link Small"
                  >
                    (+12) 345 678 901
                  </a>
                </div>

                <div className="profile-container15">
                  {/* Render the email icon */}
                  <svg viewBox="0 0 1024 1024" className="profile-icon04">
                    <path d="M854 342v-86l-342 214-342-214v86l342 212zM854 170q34 0 59 26t25 60v512q0 34-25 60t-59 26h-684q-34 0-59-26t-25-60v-512q0-34 25-60t59-26h684z"></path>
                  </svg>

                  {/* Render the email address link */}
                  <a
                    href="mailto:abcd@pqrs.com"
                    className="profile-link1 Small"
                  >
                    abcd@pqrs.com
                  </a>
                </div>

                <div className="profile-container16">
                  {/* Render the location icon */}
                  <svg viewBox="0 0 1024 1024" className="profile-icon06">
                    <path d="M512 490q44 0 75-31t31-75-31-75-75-31-75 31-31 75 31 75 75 31zM512 86q124 0 211 87t87 211q0 62-31 142t-75 150-87 131-73 97l-32 34q-12-14-32-37t-72-92-91-134-71-147-32-144q0-124 87-211t211-87z"></path>
                  </svg>

                  {/* Render the location link */}
                  <span className="profile-text28 Small">
                    <a
                      href="https://www.google.com/maps/place/College+of+Engineering+Trivandrum+(CET)/@8.5458513,76.9037658,17z/data=!3m1!4b1!4m6!3m5!1s0x3b05bec79541c519:0x98324eb5aafb3778!8m2!3d8.5458513!4d76.9063407!16zL20vMDVtcTdz"
                      target="_blank"
                      rel="noreferrer"
                    >
                      <span className="profile-text28 Small">
                        College of Engineering, Trivandrum
                      </span>
                    </a>
                  </span>
                </div>
              </div>
            </div>

            {/* Render the profile image */}
            <img
              alt="image"
              src="/playground_assets/wave-1.svg"
              className="profile-image1"
            />

            <div className="profile-container18"></div>
          </div>
        </div>
      </div>

      {/* Render the footer */}
      <Footer></Footer>
    </div>
  );
};

export default Contact;
