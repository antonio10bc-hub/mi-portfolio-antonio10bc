import NotFoundView from "@/components/NotFoundView";

export const metadata = { title: "404", robots: { index: false } };

export default function NotFound() {
  return <NotFoundView />;
}
