import React from "react";
import PropTypes from "prop-types"; // Import PropTypes
import { base_path } from "../../environment";

const ImageWithBasePath = (props) => {
  // Combine the base path and the provided src to create the full image source URL
  // Handle both relative and absolute paths
  let fullSrc;
  if (props.src.startsWith('http')) {
    fullSrc = props.src;
  } else {
    // Ensure there's always a slash between base_path and src
    const cleanBasePath = base_path.endsWith('/') ? base_path : base_path + '/';
    const cleanSrc = props.src.startsWith('/') ? props.src.substring(1) : props.src;
    fullSrc = `${cleanBasePath}${cleanSrc}`;
  }

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
