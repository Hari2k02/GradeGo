import React from 'react'

import { faFacebook, faGithub, faInstagram, faTwitter } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import './social-media.css'

const SocialMedia = () => {
    return (
        <div className="social-media-container">
            <ul className="ulist">
                <li><a href="https://www.facebook.com">
                <FontAwesomeIcon icon={faFacebook} />
                </a></li>
                <li><a href="https://www.instagram.com">
                <FontAwesomeIcon icon={faInstagram} />
                </a></li>
                <li><a href="https://twitter.com">
                <FontAwesomeIcon icon={faTwitter} />
                </a></li>
                <li><a href="https://github.com" >
                <FontAwesomeIcon icon={faGithub} />
                </a></li>
            </ul>
        </div>
    )
}

export default SocialMedia;