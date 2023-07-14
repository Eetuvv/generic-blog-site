const Footer = () => {
  return (
    <section id="footer" className="p-6 bg-black">
      <div className="container mx-auto">
        <p className="text-center text-gray-500">
          © {new Date().getFullYear()} Blogster. All rights reserved.
        </p>
      </div>
    </section>
  )
}

export default Footer
