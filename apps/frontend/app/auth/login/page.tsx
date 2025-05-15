import { MaxWidthWrapper } from "@/components/ui/max-width-wrapper";
import { Social } from "../components/social";
import { Suspense } from "react";
import { LogoWithLink } from "@/components/landing/logo-with-link";

// For now only supports social login
const LoginPage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <MaxWidthWrapper>
        <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 lg:px-6 h-14 flex items-center">
          <LogoWithLink />
          {/* <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link
            className="text-sm font-medium hover:underline underline-offset-4"
            href="#"
          >
            Features
          </Link>
        </nav> */}
        </header>
        <main className="flex-1">
          <div className="flex flex-col items-center justify-center mt-48 space-y-2">
            <div className="flex flex-col items-center space-y-2">
              <h1 className="text-3xl font-bold font-serif">Sign in</h1>
              <p className="text-gray-500 font-sans">
                Sign in to your account to continue
              </p>
            </div>
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm ">
              <Suspense>
                <Social />
              </Suspense>
            </div>
            {/* <Alert className=" bg-yellow-200">
          <Terminal className="h-4 w-4" />
          <AlertTitle>Heads up!</AlertTitle>
          <AlertDescription>
            We are looking for early adopters to join our waitlist. Join our waitlist
            to get access to use the application.
          </AlertDescription>
        </Alert> */}

            {/* <div>
        <div className="text-xl">Sign In</div>
        <div>Sign in to access your account</div>
      </div>
      <Card className="w-1/2">
        <CardContent>
          <Social />
        </CardContent>
      </Card> */}
          </div>
        </main>
      </MaxWidthWrapper>
    </div>
  );
};

export default LoginPage;
