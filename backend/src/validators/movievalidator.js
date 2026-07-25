import {body,validationResult} from 'express-validator'


const movieRules = [
    body("title")
        .notEmpty()
        .trim()
        .isString()
        .withMessage("Title is required and must be a string"),

    body("genre")
        .notEmpty()
        .trim()
        .isString()
        .withMessage("Genre is required and must be a string"),

    body("year")
        .notEmpty()
        .isInt({ min: 1888 })
        .withMessage("Year is required and must be a valid year"),

    body("rating")
        .notEmpty()
        .isFloat({ min: 0, max: 10 })
        .withMessage("Rating must be between 0 and 10"),

    body("director")
        .notEmpty()
        .trim()
        .isString()
        .withMessage("Director is required and must be a string"),

    body("synopsis")
        .notEmpty()
        .trim()
        .isString()
        .withMessage("Synopsis is required and must be a string"),

    body("poster")
        .notEmpty()
        .isURL()
        .withMessage("Poster must be a valid URL"),
];

const validate = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array(),
        });
    }

    next();
};

export { movieRules, validate };