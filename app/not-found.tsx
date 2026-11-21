import Link from "next/link";
import TextPage from "@/components/public/TextPage";

export default function NotFound() {
  return (
    <TextPage title="This page is not here">
      <p>The link may be old, or the page has moved.</p>
      <p>
        <Link className="link-arrow" href="/">
          Go to the home page
        </Link>
      </p>
    </TextPage>
  );
}
