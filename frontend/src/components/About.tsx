import { Helmet } from "react-helmet"

const About = () => {
  return (
    <section id="about" className="py-10 bg-black">
      <Helmet>
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat&display=swap"
          rel="stylesheet"
        />
      </Helmet>
      <div className="container mx-auto max-w-xl text-center text-white">
        <h2 className="text-3xl font-bold mb-4">About Blogster</h2>
        <p className="text-lg mb-4">
          Welcome to Blogster, a platform dedicated to providing insightful and
          engaging content on a wide range of topics. Our mission is to inspire
          and inform our readers, encouraging thoughtful discussions and
          promoting lifelong learning.
        </p>
        <p className="text-lg mb-4">
          At Blogster, we cover a diverse array of subjects, including
          technology, lifestyle, travel, health, and much more. Our team of
          passionate writers and experts are committed to delivering
          high-quality articles, tutorials, and thought-provoking pieces that
          resonate with our readers.
        </p>
        <p className="text-lg mb-4">
          Whether you're seeking practical tips, in-depth analysis, or simply a
          good read, you'll find it here. We strive to provide valuable
          insights, actionable advice, and fresh perspectives to help you stay
          informed, inspired, and engaged.
        </p>
        <p className="text-lg mb-4">
          We invite you to explore our blog, engage with our content, and be
          part of our growing community. Join the conversation by leaving
          comments, sharing your thoughts on social media, and subscribing to
          our newsletter for regular updates and exclusive content.
        </p>
        <p className="text-lg font-montserrat italic mb-4">
          Thank you for being a part of Blogster. We appreciate your support and
          look forward to delivering informative and enjoyable content that
          keeps you coming back for more.
        </p>
        <p className="text-lg font-bold mt-8">- The Blogster Team</p>
      </div>
    </section>
  )
}

export default About
