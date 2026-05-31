import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Seo } from "@/components/Seo";

export function NotFound() {
  return (
    <div className="container-tight flex min-h-[80vh] flex-col items-center justify-center pt-20 text-center">
      <Seo
        title="Page not found | The Linen Solutions"
        description="This page has slipped away."
        path="/404"
        noindex
      />
      <p className="font-serif text-7xl text-linen-300">404</p>
      <h1 className="mt-4 font-serif text-3xl text-foreground md:text-4xl">
        This page has slipped away
      </h1>
      <p className="mt-3 max-w-md text-muted-foreground">
        The page you're looking for doesn't exist or may have moved. Let's get you
        back to something beautiful.
      </p>
      <div className="mt-8 flex gap-3">
        <Button asChild variant="accent">
          <Link to="/">Back home</Link>
        </Button>
        <Button asChild variant="outline">
          <Link to="/shop">View Our Collection</Link>
        </Button>
      </div>
    </div>
  );
}
