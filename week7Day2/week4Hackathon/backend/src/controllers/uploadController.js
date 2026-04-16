const cloudinary = require("../config/cloudinary");
const Movie = require("../models/movieModel");
const { constants } = require("../middlewares/constants");
const { Readable } = require("stream");
const crypto = require("crypto");

// Upload movie with trailer
const uploadMovie = async (req, res, next) => {
  try {
    const { title, description, duration, genres, director, cast, year, contentType, rating } = req.body;

    // Validate required fields
    if (!title) {
      res.status(constants.VALIDATION_ERROR);
      throw new Error("Title is required");
    }

    if (!req.files || !req.files.image) {
      res.status(constants.VALIDATION_ERROR);
      throw new Error("Poster image is required");
    }

    let imageUrl = null;
    let trailerUrl = null;
    let bannerUrl = null;

    // Upload poster image to Cloudinary
    try {
      const imageFile = req.files.image[0];
      const stream = Readable.from(imageFile.buffer);

      const uploadResult = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            resource_type: "image",
            folder: "streamvibe/posters",
            quality: "auto",
            width: 300,
            height: 450,
            crop: "fill",
          },
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          }
        );

        stream.pipe(uploadStream);
      });

      imageUrl = uploadResult.secure_url;
    } catch (uploadError) {
      res.status(constants.SERVER_ERROR);
      throw new Error(`Failed to upload poster image: ${uploadError.message}`);
    }

    // Upload trailer to Cloudinary if file is provided
    if (req.files && req.files.trailer) {
      try {
        const trailerFile = req.files.trailer[0];
        const stream = Readable.from(trailerFile.buffer);

        const uploadResult = await new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            {
              resource_type: "video",
              folder: "streamvibe/trailers",
              quality: "auto",
            },
            (error, result) => {
              if (error) {
                reject(error);
              } else {
                resolve(result);
              }
            }
          );

          stream.pipe(uploadStream);
        });

        trailerUrl = uploadResult.secure_url;
      } catch (uploadError) {
        res.status(constants.SERVER_ERROR);
        throw new Error(`Failed to upload trailer: ${uploadError.message}`);
      }
    }

    // Upload banner to Cloudinary if file is provided
    if (req.files && req.files.banner) {
      try {
        const bannerFile = req.files.banner[0];
        const stream = Readable.from(bannerFile.buffer);

        const uploadResult = await new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            {
              resource_type: "image",
              folder: "streamvibe/banners",
              quality: "auto",
              width: 1920,
              height: 1080,
              crop: "fill",
            },
            (error, result) => {
              if (error) {
                reject(error);
              } else {
                resolve(result);
              }
            }
          );

          stream.pipe(uploadStream);
        });

        bannerUrl = uploadResult.secure_url;
      } catch (uploadError) {
        res.status(constants.SERVER_ERROR);
        throw new Error(`Failed to upload banner: ${uploadError.message}`);
      }
    }

    // Parse genres and cast from comma-separated strings
    const parseArray = (value) => {
      if (typeof value === 'string' && value.trim()) {
        return value.split(',').map(v => v.trim()).filter(v => v);
      }
      return Array.isArray(value) ? value.filter(v => v) : [];
    };

    console.log("🎬 Raw cast from form:", cast);
    const castArray = parseArray(cast);
    const genresArray = parseArray(genres);
    console.log("🎬 Parsed cast array:", castArray);
    console.log("🎬 Parsed genres array:", genresArray);

    // Create movie document
    const newMovie = new Movie({
      title,
      description: description || "A captivating story filled with drama, action, and emotions.",
      image: imageUrl,
      trailerUrl,
      bannerUrl,
      duration: duration || "2h 30min",
      genres: genresArray.length > 0 ? genresArray : ["Drama"],
      director: director || "Unknown",
      cast: castArray,
      year: year || new Date().getFullYear(),
      contentType: contentType || "movie",
      rating: rating || "4.5",
      createdBy: req.user.id,
    });

    await newMovie.save();

    res.status(201).json({
      success: true,
      data: newMovie,
      message: "Movie/Show uploaded successfully",
    });
  } catch (err) {
    next(err);
  }
};

// Generate Cloudinary upload signature for direct frontend uploads
const getCloudinarySignature = async (req, res, next) => {
  try {
    const { type } = req.body; // 'poster', 'trailer', or 'banner'
    
    if (!type || !['poster', 'trailer', 'banner'].includes(type)) {
      res.status(constants.VALIDATION_ERROR);
      throw new Error("Valid type required: poster, trailer, or banner");
    }

    const timestamp = Math.floor(Date.now() / 1000);
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    const folder = `streamvibe/${type === 'poster' ? 'posters' : type === 'trailer' ? 'trailers' : 'banners'}`;

    // Prepare params for signature (ONLY folder and timestamp for unsigned uploads)
    const paramsForSignature = {
      folder,
      timestamp,
    };

    // Create signature from ONLY folder and timestamp
    const signatureString = Object.keys(paramsForSignature)
      .sort()
      .map(key => `${key}=${paramsForSignature[key]}`)
      .join('&');

    const signature = crypto
      .createHash('sha256')
      .update(signatureString + apiSecret)
      .digest('hex');

    // Prepare all params to send to frontend (includes transformations but NOT in signature)
    const uploadParams = {
      api_key: apiKey,
      timestamp,
      folder,
      resource_type: type === 'trailer' ? 'video' : 'image',
      quality: 'auto',
    };

    // Add image transformations
    if (type === 'poster') {
      uploadParams.width = 300;
      uploadParams.height = 450;
      uploadParams.crop = 'fill';
    } else if (type === 'banner') {
      uploadParams.width = 1920;
      uploadParams.height = 1080;
      uploadParams.crop = 'fill';
    }

    res.status(200).json({
      success: true,
      data: {
        signature,
        timestamp,
        cloudName,
        apiKey,
        params: uploadParams,
      },
      message: "Signature generated successfully",
    });
  } catch (err) {
    next(err);
  }
};

// Save movie with pre-uploaded Cloudinary URLs (no files)
const saveMovieWithUrls = async (req, res, next) => {
  try {
    const {
      title,
      description,
      duration,
      genres,
      director,
      cast,
      year,
      contentType,
      rating,
      imageUrl, // From Cloudinary
      trailerUrl, // From Cloudinary
      bannerUrl, // From Cloudinary
    } = req.body;

    // Validate required fields
    if (!title) {
      res.status(constants.VALIDATION_ERROR);
      throw new Error("Title is required");
    }

    if (!imageUrl) {
      res.status(constants.VALIDATION_ERROR);
      throw new Error("Poster image URL is required");
    }

    // Parse genres and cast from comma-separated strings
    const parseArray = (value) => {
      if (typeof value === 'string' && value.trim()) {
        return value.split(',').map(v => v.trim()).filter(v => v);
      }
      return Array.isArray(value) ? value.filter(v => v) : [];
    };

    const castArray = parseArray(cast);
    const genresArray = parseArray(genres);

    // Create movie document
    const newMovie = new Movie({
      title,
      description: description || "A captivating story filled with drama, action, and emotions.",
      image: imageUrl,
      trailerUrl: trailerUrl || null,
      bannerUrl: bannerUrl || null,
      duration: duration || "2h 30min",
      genres: genresArray.length > 0 ? genresArray : ["Drama"],
      director: director || "Unknown",
      cast: castArray,
      year: year || new Date().getFullYear(),
      contentType: contentType || "movie",
      rating: rating || "4.5",
      createdBy: req.user.id,
    });

    await newMovie.save();
    console.log("✅ Movie saved with Cloudinary URLs:", title);

    res.status(201).json({
      success: true,
      data: newMovie,
      message: "Movie/Show created successfully",
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  uploadMovie,
  getCloudinarySignature,
  saveMovieWithUrls,
};
