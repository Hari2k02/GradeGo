import React from 'react'

import { faFacebook, faGithub, faInstagram, faTwitter } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import './social-media.css'

const SocialMedia = () => {
    return (
        <div className="social-media-container">
            <ul>
                <li><a href="https://www.facebook.com" target='_blank' rel="noreferrer">
                <FontAwesomeIcon icon={faFacebook} />
                </a></li>
                <li><a href="https://www.instagram.com" target='_blank' rel="noreferrer">
                <FontAwesomeIcon icon={faInstagram} />
                </a></li>
                <li><a href="https://twitter.com" target='_blank' rel="noreferrer">
                <FontAwesomeIcon icon={faTwitter} />
                </a></li>
                <li><a href="https://github.com" target='_blank' rel="noreferrer">
                <FontAwesomeIcon icon={faGithub} />
                </a></li>
            </ul>
        </div>
    )
}

export default SocialMedia;