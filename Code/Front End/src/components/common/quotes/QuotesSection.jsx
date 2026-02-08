import quotes from "./quotes";
import "./styles.css";

const quote = quotes[Math.floor(Math.random() * quotes.length)];

const QuotesSection = () => {
  console.log(quote);

  return (
    <section className="quotes" data-aos="fade-up">
      <div className="quoteCard">
        <q className="quoteText">{quote.quote}</q>
        <p className="author">- {quote.author}</p>
      </div>
    </section>
  );
};

export default QuotesSection;
