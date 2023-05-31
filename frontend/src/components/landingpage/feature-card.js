import React from 'react'

import PropTypes from 'prop-types'
import { fadeIn, staggerContainer } from '../../utils/motion'
import { motion } from 'framer-motion'
import './feature-card.css'

const FeatureCard = (props) => {
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      whileInView="show"
      viewport={{ once: false, amount: 0.25 }}
      className="feature-card-container">
        <motion.img
        variants={fadeIn("up","tween",0.3,1)}
          alt={props.image_alt}
          src={props.image_src}
          className="feature-card-image"
        />
        <motion.h5 variants={fadeIn("up","tween",0.3,1)} className="feature-card-text HeadingThree">{props.new_prop}</motion.h5>
        <motion.span variants={fadeIn("up","tween",0.3,1)} className="feature-card-text1">{props.text}</motion.span>
    </motion.div>
  )
}

FeatureCard.defaultProps = {
  image_src: '/playground_assets/rocket1.svg',
  image_alt: 'image',
  text: 'Get the latest design ideas and turn it into reality.',
  new_prop: 'Design',
}

FeatureCard.propTypes = {
  image_src: PropTypes.string,
  image_alt: PropTypes.string,
  text: PropTypes.string,
  new_prop: PropTypes.string,
}

export default FeatureCard
