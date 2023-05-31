import React from 'react'

import { Helmet } from 'react-helmet'
import { motion } from 'framer-motion'
import Header from '../components/landingpage/header'
import FeatureCard from '../components/landingpage/feature-card'
import Footer from '../components/landingpage/footer'
import './home.css'
import {staggerContainer, fadeIn} from '../utils/motion'
const Home = () => {
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      whileInView="show"
      viewport={{ once: false, amount: 0.25 }}
      className="home-container">
      <Helmet>
        <title>GradeGo - Student Progress Tracker</title>
        <meta property="og:title" content="GradeGo" />
      </Helmet>
      <Header rootClassName="header-root-class-name"></Header>
      <div className="home-hero">
        <div className="home-container01">
          <motion.div 
          variants={fadeIn("up","tween",0.3,1)}
          className="home-card">
            <h1 className="home-text HeadingOne">GradeGo</h1>
            <h1 className="home-text01 HeadingOne">Empower Your Learning Journey</h1>
            <span className="home-text02 Lead">
              <span>
                Effortlessly Monitor, Measure, and Maximize Your Academic Success with GradeGo!
              </span>
            </span>
          </motion.div>
        </div>
      </div>
      <motion.img
        variants={fadeIn("left","tween",0.4,1)}
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
      {/* <section className="home-container05">
        <div className="home-container06">
          <h1 className="home-text05 HeadingOne">
            <span className="home-text06">Transform Your Learning Experience: Monitor, Improve, Excel with GradeGo!</span>
          </h1>

        </div>
        <div className="home-container07">
          <div className="home-container08">
            <img
              alt="image"
              src="https://raw.githubusercontent.com/creativetimofficial/public-assets/master/soft-ui-design-system/assets/img/laptop.jpg"
              className="home-image05"
            />
            <span className="home-text09 Small">
              <span class="home-text10">
                With the app's monitoring feature, students can effortlessly keep track of their grades, assignments,
                and overall performance in real-time, providing them with a clear picture of their academic progress.
              </span>
              <br />
            </span>
            <div className="home-container09">
              <img
                alt="image"
                src="https://raw.githubusercontent.com/creativetimofficial/public-assets/master/soft-ui-design-system/assets/img/coding.jpg"
                className="home-image06"
              />
            </div>
          </div>
          <div className="home-container10">
            <img
              alt="image"
              src="https://raw.githubusercontent.com/creativetimofficial/public-assets/master/soft-ui-design-system/assets/img/tasks.jpg"
              className="home-image07"
            />
            <div className="home-container11">
              <h3 className="HeadingTwo">
                <span className="home-text14">
                  So what is the need for a Student Progress Tracker application ?
                </span>
              </h3>
              <p class="home-text15">
                <br />
                <span class="home-text16">
                  In today's dynamic educational landscape, the demand for personalized, data-driven, and efficient
                  monitoring of student academic progress is more critical than ever. Students face various challenges,
                  such as managing their time, staying organized, setting academic goals, and engaging parents in their
                  learning journey. This is where a Student Progress Tracker app comes in.
                  <br />
                  <span></span>
                  <br />
                  <span class="home-text19">
                    Firstly, personalized learning is a key aspect of modern education. Every student has unique
                    learning needs and progresses at their own pace. A Student Progress Tracker app can provide
                    personalized insights and feedback on a student's performance, helping them identify their strengths
                    and weaknesses, set goals, and optimize their learning approach accordingly.
                    <br />
                    <br />
                    Secondly, effective time and task management are essential for student success. Keeping track of
                    assignments, exams, and deadlines can be overwhelming. A Student Progress Tracker app can help
                    students stay organized by providing a centralized platform for managing their tasks, deadlines, and
                    assignments, leading to improved time management skills and better academic performance.
                  </span>
                  <br />
                  <span></span>
                  <br />
                  <span class="home-text22">
                    Thirdly, progress monitoring is crucial for students, parents, and educators. A Student Progress
                    Tracker app can provide real-time updates on grades, attendance, and other performance metrics,
                    allowing stakeholders to monitor progress, identify areas for improvement, and intervene early if
                    needed. This enables timely support and intervention to enhance student success.
                  </span>
                </span>
                <br />
              </p>
            </div>
          </div>
        </div>
      </section> */}
      {/* <section className="home-testimonials">
        <div className="home-container12">
          <div className="home-container13">
            <div className="home-container14">
              <h2 className="home-text23 HeadingOne">Excel with us</h2>
              <p className="home-text24 Lead">
                <span className="home-text25">
                  <br />
                  Whatever your qualification is - we got you!
                </span>
              </p>
              <p className="home-text26 Body">
                <span className="home-text27">
                  "Education is the foundation upon which we build our future. It is the key that unlocks the door to
                  endless possibilities, empowers individuals to reach their full potential, and transforms communities
                  and societies for the better. With the right tools and resources, students can thrive in their
                  learning journey, parents can be engaged partners, and educators can effectively guide and inspire. A
                  student progress tracker, like the one we've built, is not just a technological solution, but a
                  catalyst for positive change in the lives of students, families, and educators. It's a tool that
                  empowers students to take ownership of their learning, helps parents stay informed and involved, and
                  enables educators to tailor instruction to meet the unique needs of each learner. Our mission is to
                  make education more accessible, personalized, and impactful, and our student progress tracker is a
                  step towards that vision, paving the way for a brighter future where every student can thrive and
                  succeed."
                </span>
              </p>
            </div>
          </div>
        </div>
        <img
          alt="image"
          src="/playground_assets/bottom.svg"
          className="home-bottom-wave-image"
        />
        <img
          alt="image"
          src="/playground_assets/waves-white.svg"
          className="home-image19"
        />
        <img
          alt="image"
          src="/playground_assets/top.svg"
          className="home-top-wave-image"
        />
      </section> */}
      {/* <section className="home-contaier">
        <div className="home-container31">
          <div className="home-container32">
            <svg viewBox="0 0 1024 1024" className="home-icon">
              <path d="M363.722 722.052l41.298-57.816-45.254-45.256-57.818 41.296c-10.722-5.994-22.204-10.774-34.266-14.192l-11.682-70.084h-64l-11.68 70.086c-12.062 3.418-23.544 8.198-34.266 14.192l-57.818-41.298-45.256 45.256 41.298 57.816c-5.994 10.72-10.774 22.206-14.192 34.266l-70.086 11.682v64l70.086 11.682c3.418 12.060 8.198 23.544 14.192 34.266l-41.298 57.816 45.254 45.256 57.818-41.296c10.722 5.994 22.204 10.774 34.266 14.192l11.682 70.084h64l11.68-70.086c12.062-3.418 23.544-8.198 34.266-14.192l57.818 41.296 45.254-45.256-41.298-57.816c5.994-10.72 10.774-22.206 14.192-34.266l70.088-11.68v-64l-70.086-11.682c-3.418-12.060-8.198-23.544-14.192-34.266zM224 864c-35.348 0-64-28.654-64-64s28.652-64 64-64 64 28.654 64 64-28.652 64-64 64zM1024 384v-64l-67.382-12.25c-1.242-8.046-2.832-15.978-4.724-23.79l57.558-37.1-24.492-59.128-66.944 14.468c-4.214-6.91-8.726-13.62-13.492-20.13l39.006-56.342-45.256-45.254-56.342 39.006c-6.512-4.766-13.22-9.276-20.13-13.494l14.468-66.944-59.128-24.494-37.1 57.558c-7.812-1.892-15.744-3.482-23.79-4.724l-12.252-67.382h-64l-12.252 67.382c-8.046 1.242-15.976 2.832-23.79 4.724l-37.098-57.558-59.128 24.492 14.468 66.944c-6.91 4.216-13.62 8.728-20.13 13.494l-56.342-39.006-45.254 45.254 39.006 56.342c-4.766 6.51-9.278 13.22-13.494 20.13l-66.944-14.468-24.492 59.128 57.558 37.1c-1.892 7.812-3.482 15.742-4.724 23.79l-67.384 12.252v64l67.382 12.25c1.242 8.046 2.832 15.978 4.724 23.79l-57.558 37.1 24.492 59.128 66.944-14.468c4.216 6.91 8.728 13.618 13.494 20.13l-39.006 56.342 45.254 45.256 56.342-39.006c6.51 4.766 13.22 9.276 20.13 13.492l-14.468 66.944 59.128 24.492 37.102-57.558c7.81 1.892 15.742 3.482 23.788 4.724l12.252 67.384h64l12.252-67.382c8.044-1.242 15.976-2.832 23.79-4.724l37.1 57.558 59.128-24.492-14.468-66.944c6.91-4.216 13.62-8.726 20.13-13.492l56.342 39.006 45.256-45.256-39.006-56.342c4.766-6.512 9.276-13.22 13.492-20.13l66.944 14.468 24.492-59.13-57.558-37.1c1.892-7.812 3.482-15.742 4.724-23.79l67.382-12.25zM672 491.2c-76.878 0-139.2-62.322-139.2-139.2s62.32-139.2 139.2-139.2 139.2 62.322 139.2 139.2c0 76.878-62.32 139.2-139.2 139.2z"></path>
            </svg>
          </div>
          <h2 className="home-text30 HeadingTwo">
            <span className="home-text31">Why GradeGo ?</span>
          </h2>
          <span className="home-text34">
            <span className="home-text35">
              These are the features that sets us apart from our competitors
            </span>
          </span>
        </div>
        <div className="home-container33">
          <div className="home-container37">
            <ListItem
              title="1. Student Management"
              description="Enables tracking and management of student-related information such as academic performance and personal details.">

            </ListItem>
            <ListItem
              title="2. Faculty Management"
              description="Enables management of faculty-related activities such as faculty profile and performance evaluation."
            ></ListItem>
            <ListItem
              title="3. Course Management"
              description="Provides the ability to manage courses offered, add new courses, edit existing ones and assign faculties to courses."
            ></ListItem>
          </div>
        </div>
        <div className="home-container38">
          <div className="home-container39">
            <ListItem
              title="4. Examination Management"
              description="Allows the faculty the entire examination process including question paper setting, evaluation, and course outcome calculations."
            ></ListItem>
            <ListItem
              title="5. Attendance Management"
              description="Enables tracking and management of attendance records for students and faculty."
            ></ListItem>
            <ListItem
              title="6. Feedback Management"
              description="Enables students to provide feedback about the course and faculty and also allows faculty to view and respond to the feedback."
            ></ListItem>
          </div>
        </div>
      </section> */}
      <Footer></Footer>
    </motion.div>
  )
}

export default Home
