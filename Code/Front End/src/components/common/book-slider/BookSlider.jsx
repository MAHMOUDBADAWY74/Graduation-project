import "../../../styles/global.css";
import BookCard from "../card/BookCard";
import { Link } from "react-router-dom";
import { FaArrowRight, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import Slider from "react-slick";
import PropTypes from "prop-types"; // <-- import prop-types
import "./styles.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function NextArrow(props) {
  const { className, style, onClick } = props;
  return (
    <button
      className={"custom-slick-arrow next " + className}
      style={{ ...style }}
      onClick={onClick}
      aria-label="Next"
    >
      <FaChevronRight />
    </button>
  );
}

NextArrow.propTypes = {
  className: PropTypes.string,
  style: PropTypes.object,
  onClick: PropTypes.func,
};

function PrevArrow(props) {
  const { className, style, onClick } = props;
  return (
    <button
      className={"custom-slick-arrow prev " + className}
      style={{ ...style }}
      onClick={onClick}
      aria-label="Previous"
    >
      <FaChevronLeft />
    </button>
  );
}

PrevArrow.propTypes = {
  className: PropTypes.string,
  style: PropTypes.object,
  onClick: PropTypes.func,
};

const settings = {
  dots: true,
  infinite: true,
  speed: 600,
  slidesToShow: 3,
  slidesToScroll: 1,
  arrows: true,
  autoplay: true,
  autoplaySpeed: 3500,
  centerMode: true,
  centerPadding: "0px",
  nextArrow: <NextArrow />,
  prevArrow: <PrevArrow />,
  responsive: [
    {
      breakpoint: 1200,
      settings: {
        slidesToShow: 2,
        centerMode: false,
      },
    },
    {
      breakpoint: 900,
      settings: {
        slidesToShow: 1,
        centerMode: false,
      },
    },
  ],
  appendDots: (dots) => (
    <div style={{ marginTop: "18px" }}>
      <ul style={{ margin: 0 }}>{dots}</ul>
    </div>
  ),
};

export default function BookSlider({ books }) {
  return (
    <div className="py-5 position-relative book-slider-root">
      <Slider {...settings} className="book-slick-slider">
        {books.map((item) => (
          <div className="slider-slide enhanced-slide" key={item.id}>
            <div className="enhanced-card">
              <BookCard item={item} />
            </div>
          </div>
        ))}
      </Slider>
      <div className="container-arrow-right button-view">
        <Link to={"/books"}>View All </Link>
        <FaArrowRight className="arrow-right" />
      </div>
    </div>
  );
}

BookSlider.propTypes = {
  books: PropTypes.array.isRequired,
};
