import React from 'react'

function About() {
    return (
        <div id="about" className="h-screen text-center px-4 py-16 max-w-3xl mx-auto">
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
            <div className="mt-8 w-full aspect-video relative">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1590041794748-2d8eb73a571c?q=80&w=3456&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')] bg-cover bg-center mask-cover mask-[url('/scribble.png')]"></div>
            </div>
        </div>
    )
}

export default About
