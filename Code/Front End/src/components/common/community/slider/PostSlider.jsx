import Slider from "react-slick";
import { useState } from "react";
import React from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./postSlider.css";
import PropTypes from "prop-types";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
const CustomPrevArrow = ({ onClick, currentSlide }) => (
  <button
    className="arrow prev-arrow"
    onClick={onClick}
    style={{ display: currentSlide === 0 ? "none" : "flex" }}
  >
    <FaArrowLeft />
  </button>
);

const CustomNextArrow = ({ onClick, currentSlide, slideCount }) => (
  <button
    className="arrow next-arrow"
    onClick={onClick}
    style={{ display: currentSlide === slideCount - 1 ? "none" : "flex" }}
  >
    <FaArrowRight />
  </button>
);

export default function PostSlider({ children }) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slideCount = React.Children.count(children);
  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    afterChange: (current) => setCurrentSlide(current),
    prevArrow: <CustomPrevArrow currentSlide={currentSlide} />,
    nextArrow: (
      <CustomNextArrow currentSlide={currentSlide} slideCount={slideCount} />
    ),
  };

  return <Slider {...settings}>{children}</Slider>;
}

PostSlider.propTypes = {
  children: PropTypes.node.isRequired,
};
CustomPrevArrow.propTypes = {
  onClick: PropTypes.func.isRequired,
  currentSlide: PropTypes.number.isRequired,
};

CustomNextArrow.propTypes = {
  onClick: PropTypes.func.isRequired,
  currentSlide: PropTypes.number.isRequired,
  slideCount: PropTypes.number.isRequired,
};
