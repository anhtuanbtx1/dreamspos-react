// For development environment
const publicUrl = process.env.PUBLIC_URL || "/";
export const base_path = publicUrl.endsWith('/') ? publicUrl : publicUrl + '/';

// For production with a subdirectory (uncomment and modify as needed)
// export const base_path = "/react/";
