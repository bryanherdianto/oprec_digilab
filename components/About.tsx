import React from 'react'

function About() {
    return (
        <div id="about" className="min-h-screen text-center px-4 py-16 max-w-3xl mx-auto">
            <p className="text-md font-mono font-medium mb-2 text-transparent bg-clip-text bg-gradient-to-r from-white to-black">
                Why join Digilab?
            </p>
            <h2 className="text-4xl sm:text-5xl font-extrabold text-white mb-4">
                Trusted by students.<br />
                Powered by innovation and tech.
            </h2>
            <p className="text-neutral-600 text-base sm:text-lg">
                Digital Laboratory is a multidisciplinary lab that brings together areas from Digital Systems to Programming,
                empowering students with hands-on experience and collaborative learning to shape the future of technology.
            </p>
            <div className="mt-8 w-full aspect-video">
                <div className="h-full w-full bg-[url('/about_digilab.jpg')] bg-cover bg-center mask-contain mask-[url('/scribble.png')]"></div>
            </div>
        </div>
    )
}

export default About
