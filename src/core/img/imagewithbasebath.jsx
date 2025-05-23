import React from "react";
import PropTypes from "prop-types"; // Import PropTypes
import { base_path } from "../../environment";

const ImageWithBasePath = (props) => {
  // Combine the base path and the provided src to create the full image source URL
  // Handle both relative and absolute paths
  const fullSrc = props.src.startsWith('http')
    ? props.src
    : `${base_path}${props.src}`;

  // For debugging - remove in production
  // console.log('Image path:', fullSrc);

  return (
    <img
      className={props.className}
      src={fullSrc}
      height={props.height}
      alt={props.alt}
      width={props.width}
      id={props.id}
      onError={() => {
        console.error(`Failed to load image: ${fullSrc}`);
        // Optionally set a fallback image
        // e.target.src = `${base_path}assets/img/placeholder.png`;
      }}
    />
  );
};

// Add PropTypes validation
ImageWithBasePath.propTypes = {
  className: PropTypes.string,
  src: PropTypes.string.isRequired, // Make 'src' required
  alt: PropTypes.string,
  height: PropTypes.number,
  width: PropTypes.number,
  id: PropTypes.string,
};

export default ImageWithBasePath;
