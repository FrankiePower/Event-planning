import { Facebook, Instagram, Linkedin, Menu, MessageCircle } from 'lucide-react'

const Social = () => {
    return (
        <>
            <div className="flex space-x-5">
                <a className="">
                    <Linkedin size={16} className='text-gray-300' />
                </a>
                <a className="">
                    <Instagram size={16} className='text-gray-300' />
                </a>
                <a className="">
                    <Facebook size={16} className='text-gray-300' />
                </a>
                <a className="">
                    <MessageCircle size={16} className='text-gray-300' />
                </a>
            </div>
        </>
    )
}

export default Social