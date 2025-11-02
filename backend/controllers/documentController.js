const axios = require("axios");
const pdfParse = require("pdf-parse");
const Document = require("../models/Document");
const cloudinary = require("../config/cloudinary");
const STATUS_CODES = require("../constants/statusCodes");
const MESSAGES = require("../constants/messages");
const { sendSuccess, sendError } = require("../utils/helpers");
const { isValidDocumentType } = require("../utils/validators");
const { chunkText } = require("../utils/helpers");

exports.uploadDocument = async (req, res) => {
  try {
    const file =
      (req.files && req.files.resume && req.files.resume[0]) ||
      (req.files && req.files.jd && req.files.jd[0]);

    if (!file) {
      return sendError(
        res,
        STATUS_CODES.BAD_REQUEST,
        MESSAGES.DOCUMENT.NO_FILE
      );
    }

    const type = file.fieldname === "resume" ? "resume" : "jd";

    if (!["resume", "jd"].includes(type)) {
      return sendError(res, STATUS_CODES.BAD_REQUEST, "Invalid document type");
    }

    const response = await axios.get(file.path, {
      responseType: "arraybuffer",
    });
    const pdfBuffer = Buffer.from(response.data);

    let pdfData;
    try {
      pdfData = await pdfParse(pdfBuffer);
    } catch (error) {
      console.error("PDF parse error:", error);
      await cloudinary.uploader.destroy(file.filename, {
        resource_type: "raw",
      });
      return sendError(
        res,
        STATUS_CODES.UNPROCESSABLE_ENTITY,
        MESSAGES.DOCUMENT.TEXT_EXTRACTION_FAILED
      );
    }

    const text = pdfData.text;
    if (!text || text.trim().length === 0) {
      await cloudinary.uploader.destroy(file.filename, {
        resource_type: "raw",
      });
      return sendError(
        res,
        STATUS_CODES.UNPROCESSABLE_ENTITY,
        MESSAGES.DOCUMENT.TEXT_EXTRACTION_FAILED
      );
    }

    const chunks = chunkText(text, 500);
    
    const oldDoc = await Document.findOne({ userId: req.userId, type }); //old docs are replaced with new ones
    if (oldDoc) {
      await cloudinary.uploader.destroy(oldDoc.cloudinaryPublicId, {
        resource_type: "raw",
      });
      await oldDoc.deleteOne();
    }

    const document = new Document({
      userId: req.userId,
      type,
      fileName: file.originalname,
      fileSize: file.size,
      cloudinaryUrl: file.path,
      cloudinaryPublicId: file.filename,
      chunks: chunks.map((text) => ({
        text,
        embedding: [],
      })),
    });

    await document.save();

    return sendSuccess(
      res,
      STATUS_CODES.CREATED,
      MESSAGES.DOCUMENT.UPLOAD_SUCCESS,
      {
        docId: document._id,
        fileName: document.fileName,
        type: document.type,
        cloudinaryUrl: document.cloudinaryUrl,
        chunksCount: chunks.length,
      }
    );
  } catch (error) {
    console.error("Upload error:", error);
    return sendError(
      res,
      STATUS_CODES.INTERNAL_SERVER_ERROR,
      MESSAGES.DOCUMENT.UPLOAD_FAILED
    );
  }
};

exports.getDocuments = async (req, res) => {
  try {
    const documents = await Document.find({ userId: req.userId })
      .select("type fileName fileSize cloudinaryUrl createdAt")
      .sort({ createdAt: -1 });

    return res.status(STATUS_CODES.OK).json({
      success: true,
      message: "Documents fetched successfully",
      documents,
    });
  } catch (error) {
    console.error("Fetch documents error:", error);
    return sendError(
      res,
      STATUS_CODES.INTERNAL_SERVER_ERROR,
      MESSAGES.DOCUMENT.FETCH_FAILED
    );
  }
};

exports.deleteDocument = async (req, res) => {
  try {
    const document = await Document.findOne({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!document) {
      return sendError(
        res,
        STATUS_CODES.NOT_FOUND,
        MESSAGES.DOCUMENT.NOT_FOUND
      );
    }

    await cloudinary.uploader.destroy(document.cloudinaryPublicId, {
      resource_type: "raw",
    });

    await document.deleteOne();

    return sendSuccess(res, STATUS_CODES.OK, MESSAGES.DOCUMENT.DELETE_SUCCESS);
  } catch (error) {
    console.error("Delete document error:", error);
    return sendError(
      res,
      STATUS_CODES.INTERNAL_SERVER_ERROR,
      MESSAGES.DOCUMENT.DELETE_FAILED
    );
  }
};
