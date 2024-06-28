import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
const MetaMaskDownloader = ({
  setLoginRequested,
}: {
  setLoginRequested: any;
}) => {
  return (
    <div className="bg-background/80 w-full fixed h-full backdrop-blur-sm z-50 flex justify-center items-center">
      <Card className="backdrop-blur-sm bg-muted-foreground/20 relative">
        <div className="p-4">
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold">Metamask is not detected!</h1>
            <p className="text-sm mt-2 max-w-sm text-muted-foreground">
              Click on the download button below to install &nbsp;
              <span className="font-semibold">Metamask</span> to keep going. 🚀
            </p>

            <div>
              <div className="mt-8 flex flex-col justify-center gap-4">
                <a href="https://metamask.io/download" target="_blank">
                  <Button className="bg-blue-600 px-12 py-3 text-sm font-medium text-white hover:bg-purple-600 hover:text-white focus:outline-none focus:ring active:text-opacity-75 sm:w-full">
                    Download &nbsp;
                    <span className="font-semibold">Metamask!</span> 🌟
                  </Button>
                </a>
                <Button
                  onClick={() => setLoginRequested(false)}
                  className="bg-blue-600 px-12 py-3 text-sm font-medium text-white hover:bg-purple-600 hover:text-white focus:outline-none focus:ring active:text-opacity-75 sm:w-full"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default MetaMaskDownloader;
