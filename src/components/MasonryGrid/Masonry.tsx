import React from "react";
import styled from "styled-components";
import Masonry from "react-masonry-css";
import "./Masonry.css";

const breakpointColumnsObj = {
  default: 3,
  1100: 3,
  800: 2,
  500: 1,
};

export const MasonryGrid = (props: React.PropsWithChildren) => {
  return (
    <Masonry
      breakpointCols={breakpointColumnsObj}
      className="my-masonry-grid"
      columnClassName="my-masonry-grid_column"
    >
      {props.children}
    </Masonry>
  );
};
