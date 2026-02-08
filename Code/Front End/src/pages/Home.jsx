import { Container } from "react-bootstrap";
import BookSlider from "./../components/common/book-slider/BookSlider";
import Landing from "./../components/common/landing/Landing";
import QuotesSection from "../components/common/quotes/QuotesSection";
import ServicesSection from "./../components/common/servicesSection/ServicesSection";
import { useFetchBooks } from "../hooks/useFetchBooks";

export default function Home() {
  const { books } = useFetchBooks(1, 12);

  return (
    <div>
      <Landing />
      <Container>
        <BookSlider books={books} />
        <ServicesSection />
      </Container>
      <QuotesSection />
    </div>
  );
}
