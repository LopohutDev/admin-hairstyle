// import React from "react";

import Carousel, { ResponsiveType } from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

const responsive: ResponsiveType = {
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 3,
    slidesToSlide: 2,
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 2,
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1,
  },
};

export type UserFeedback = {
  fullName?: string;
  feedback?: string;
  photo?: string;
  rating?: number;
};

export interface UserFeedbackProps {
  feedback?: (UserFeedback | undefined)[];
}

const StarRating = ({ rating = 0 }: { rating?: number }) => {
  const maxStars = 5;
  const filledStars = Math.round(rating); // Round to the nearest integer

  const renderStars = () => {
    const stars = [];

    for (let i = 1; i <= maxStars; i++) {
      const isFilled = i <= filledStars;

      stars.push(
        <span
          key={i}
          style={{
            color: isFilled ? "gold" : "lightgray",
            fontSize: "24px",
            cursor: "pointer",
          }}
        >
          ★
        </span>
      );
    }

    return stars;
  };

  return <div className="flex self-start">{renderStars()}</div>;
};

const FeedbackItem = ({ feedback, fullName, photo, rating }: UserFeedback) => {
  return (
    <div className="h-full px-3">
      <div className="relative h-full border border-gray-500 rounded-md">
        <div
          className="absolute w-20 h-20 bg-gray-800 bg-center bg-cover border border-gray-500 rounded-full -top-10 left-5"
          style={{ backgroundImage: `url(${photo})` }}
        >
          {" "}
        </div>
        <div className="flex flex-col justify-center h-full p-10 pt-16">
          <p className="mb-3 text-xl font-semibold">{fullName}</p>
          {`"${feedback}"`}
          <StarRating rating={rating} />
        </div>
      </div>
    </div>
  );
};

const UserFeedback = ({ feedback }: UserFeedbackProps) => {
  return (
    <div className="mt-10">
      <h2 className="text-xl font-medium tracking-wide">USER FEEDBACK</h2>
      <Carousel
        responsive={responsive}
        sliderClass="h-52"
        className="p-5 pt-10 mt-5"
      >
        {feedback &&
          feedback.length > 0 &&
          feedback.map((fb, i: number) => (
            <FeedbackItem
              key={i}
              feedback={fb?.feedback}
              fullName={fb?.fullName}
              photo={fb?.photo}
              rating={fb?.rating}
            />
          ))}
      </Carousel>
    </div>
  );
};

export default UserFeedback;
