import React from 'react'
import LogoDigi from '../public/Digilab.png'
import Image from 'next/image'

function Footer() {
    return (
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-neutral text-neutral-content p-10 gap-10 sm:gap-40 md:gap-70 lg:gap-120">
            <aside className="flex flex-col items-start">
            <Image
                src={LogoDigi}
                alt="Digital Laboratory Logo"
                width={50}
                height={50}
                className="fill-current"
            />
            <p className="mt-4">
                Digital Laboratory
                <br />
                #DigitalizeEverything
            </p>
        </aside>
            <nav className="flex flex-col gap-4">
                <h6 className="font-bold text-neutral-600">SOCIALS</h6>
                <div className="grid grid-flow-col gap-4">
                    <a href="https://twitter.com/digilabui" target="_blank" rel="noopener noreferrer">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            className="fill-current">
                            <path
                                d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"></path>
                        </svg>
                    </a>
                    <a href="https://www.youtube.com/@digitallaboratorydteftui811" target="_blank" rel="noopener noreferrer">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            className="fill-current">
                            <path
                                d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"></path>
                        </svg>
                    </a>
                    <a href="https://instagram.com/digilabui" target="_blank" rel="noopener noreferrer">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 48 48"
                            className="fill-current"
                        >
                            <g>
                                <path fill="none" d="M0,0h48v48H0V0z"/>
                                <path d="M36,4H12c-4.4,0-8,3.6-8,8v24c0,4.4,3.6,8,8,8h24c4.4,0,8-3.6,8-8V12C44,7.6,40.4,4,36,4z M24,34c-5.5,0-10-4.5-10-10
                                    s4.5-10,10-10s10,4.5,10,10S29.5,34,24,34z M35,15c-1.1,0-2-0.9-2-2c0-1.1,0.9-2,2-2s2,0.9,2,2C37,14.1,36.1,15,35,15z"/>
                            </g>
                        </svg>
                    </a>
                </div>
            </nav>
        </div>
    )
}

export default Footer