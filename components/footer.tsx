const currrentYear = new Date().getFullYear();

const Footer = () => {
    return <footer className="flex justify-center items-center py-16">
        <p className="text-center text-black dark:text-white">© {currrentYear} Monet Points. Made with ❤️</p>
    </footer>
}

export default Footer;