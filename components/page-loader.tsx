import { MonetWorkLogo } from "./icons/monet-work-logo"

const PageLoader = () => {
    return  <div className="bg-black/80 backdrop-blur-sm min-h-screen flex justify-center items-center fixed top-0 left-0 w-full h-full z-50">
    <div className="flex flex-col">
      <MonetWorkLogo className="w-64 h-64 animate-slow-blink" />
    </div>
  </div>
}

export default PageLoader;