import React from 'react'
import LogoDigi from '../public/Digilab.svg'
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
                    #digilabui #DigitalizeEverything
                </p>
            </aside>
            <nav className="flex flex-col gap-4">
                <h6 className="font-bold text-neutral-600">SOCIAL</h6>
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
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 64 64" className='fill-current'>
                            <g fill="#ffffff" transform='translate(-5, -10) scale(1.3)'>
                                <path
                                    d="M31.82031,12c-18.382,0 -19.82031,1.43931 -19.82031,19.82031v0.35938c0,18.381 1.43831,19.82031 19.82031,19.82031h0.35938c18.382,0 19.82031,-1.43931 19.82031,-19.82031v-0.17969c0,-18.548 -1.452,-20 -20,-20zM43.99414,18c1.105,-0.003 2.00286,0.88914 2.00586,1.99414c0.003,1.105 -0.88914,2.00286 -1.99414,2.00586c-1.105,0.003 -2.00286,-0.88914 -2.00586,-1.99414c-0.003,-1.105 0.88914,-2.00286 1.99414,-2.00586zM31.97656,22c5.522,-0.013 10.01044,4.45456 10.02344,9.97656c0.013,5.522 -4.45456,10.01044 -9.97656,10.02344c-5.522,0.013 -10.01044,-4.45456 -10.02344,-9.97656c-0.013,-5.522 4.45456,-10.01044 9.97656,-10.02344zM31.98633,26c-3.314,0.008 -5.99433,2.70163 -5.98633,6.01563c0.008,3.313 2.70067,5.99238 6.01367,5.98438c3.314,-0.008 5.99433,-2.70067 5.98633,-6.01367c-0.008,-3.314 -2.70067,-5.99433 -6.01367,-5.98633z"></path>
                            </g>
                        </svg>
                    </a>
                </div>
            </nav>
        </div>
    )
}

export default Footer