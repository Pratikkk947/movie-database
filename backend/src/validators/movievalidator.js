/**
 * ===========================================
 * Movie Validator
 * ===========================================
 * Validates the request body before adding
 * a new movie.
 * ===========================================
 */

const validateMovie = (req, res, next) => {
    const { title, genre, year, director, synopsis } = req.body;
  
    // Check required fields
    if (!title || !genre || !year || !director || !synopsis) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields.",
      });
    }
  
    next();
  };
  
  export default validateMovie;