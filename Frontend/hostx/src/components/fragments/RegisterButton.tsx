import Link from 'next/link'

const RegisterButton = () => {
  return (
    <>
        <Link
            className="rounded-full hover:border border-solid border-white/[.145] transitioncolors flex items-center justify-center bg-stone-800 text-stone-200 hover:scale-105 transition-all duration-300 text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:min-w-44"
            href="/"
            target="_blank"
            rel="noopener noreferrer"
        >
            Register For Event
        </Link>
    </>
  )
}

export default RegisterButton