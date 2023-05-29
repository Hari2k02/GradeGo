import React from 'react'

import { Helmet } from 'react-helmet'

import Header from '../components/landingpage/header'
import FeatureCard from '../components/landingpage/feature-card'
import Footer from '../components/landingpage/footer'
import './home.css'

const Home = () => {
  return (
    <div className="home-container">
      <Helmet>
        <title>GradeGo - Student Progress Tracker</title>
        <meta property="og:title" content="GradeGo" />
      </Helmet>
      <Header rootClassName="header-root-class-name"></Header>
      <div className="home-hero">
        <div className="home-container01">
          <div className="home-card">
            <h1 className="home-text HeadingOne">GradeGo</h1>
            <h1 className="home-text01 HeadingOne">Empower Your Learning Journey</h1>
            <span className="home-text02 Lead">
              <span>
                Effortlessly Monitor, Measure, and Maximize Your Academic Success with GradeGo!
              </span>
            </span>
          </div>
        </div>
      </div>
      <img
        alt="image"
        src="/playground_assets/curved5-1400w.jpg"
        loading="eager"
        className="home-image04 list"
      />
      <section className="home-features">
        <FeatureCard
          text="Real-time tracking of your grades, assignments, and performance in one place."
          new_prop="Real-time monitoring"
          image_src="/playground_assets/cube1.svg"
        ></FeatureCard>
        <FeatureCard
          image_src="/playground_assets/person1.svg"
          text="Gain valuable insights into your strengths and weaknesses."
          new_prop="Personalised insights"
        ></FeatureCard>
        <FeatureCard
          text="Collaborate with classmates and teachers through shared features like assignment tracking."
          new_prop="Collaborative Tools"
          image_src="/playground_assets/rocket1.svg"
        ></FeatureCard>
        <FeatureCard
          text="Set academic goals, create study plans, and receive reminders to stay focused and motivated towards
          your targets."
          new_prop="Goal Setting and Reminders"
          image_src="/playground_assets/credit%20card1.svg"
        ></FeatureCard>
      </section>
      <Footer></Footer>
    </div>
  )
}

export default Home
