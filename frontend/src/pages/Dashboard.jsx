import React, { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../features/authSlice";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "../components/Loader";
import { useNavigate } from "react-router-dom";
import ConfirmModal from "../components/ConfirmModal";
import { humanFileSize } from "../utils/fileUtils";
import {
  fetchDocumentsApi,
  uploadDocumentApi,
  deleteDocumentApi,
} from "../api/documentApi";
import LoadingButton from "../components/LoadingButton";

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((s) => s.auth.user);

  const [documents, setDocuments] = useState([]);
  const [loadingDocs, setLoadingDocs] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fileToDelete, setFileToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const resumeInputRef = useRef();
  const jdInputRef = useRef();

  const hasResume = documents.some((d) => d.type === "resume");
  const hasJD = documents.some((d) => d.type === "jd");

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      setLoadingDocs(true);
      const res = await fetchDocumentsApi();
      setDocuments(res.data || []);
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Failed to fetch documents");
    } finally {
      setLoadingDocs(false);
    }
  };

  const handleFileChange = async (e, type) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf" && !/\.pdf$/i.test(file.name)) {
      toast.error("Only PDF files are allowed");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error("File too large. Max 2MB");
      return;
    }

    const form = new FormData();
    form.append(type, file);

    try {
      setUploading(true);
      setUploadProgress(0);

      await uploadDocumentApi(form, (progressEvent) => {
        if (progressEvent.total) {
          const percent = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(percent);
        }
      });

      fetchDocuments();
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Upload failed");
    } finally {
      setTimeout(() => {
        setUploading(false);
        setUploadProgress(0);
      }, 2000);
      e.target.value = "";
    }
  };

  const handleDelete = async (id) => {
    setFileToDelete(id);
    setIsModalOpen(true);
  };
  const confirmDelete = async () => {
    try {
      setDeleting(true); 
      await deleteDocumentApi(fileToDelete);
      toast.success("Deleted");
      setDocuments((prev) => prev.filter((d) => d._id !== fileToDelete));
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Delete failed");
    } finally {
      setDeleting(false); 
      setIsModalOpen(false);
      setFileToDelete(null);
    }
  };

  const cancelDelete = () => {
    setIsModalOpen(false);
    setFileToDelete(null);
  };
  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <main
      className="min-h-screen bg-gray-50 p-6"
      role="main"
      aria-labelledby="dashboard-heading"
    >
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <header
          className="flex items-center justify-between mb-8"
          role="banner"
          aria-label="Dashboard header"
        >
          <div>
            <h1
              id="dashboard-heading"
              className="text-2xl font-semibold text-gray-800"
            >
              Welcome{user?.name ? `, ${user.name}` : ""}
            </h1>
            <p className="text-sm text-gray-600">This is your dashboard</p>
          </div>

          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
            aria-label="Logout and return to login page"
          >
            Logout
          </button>
        </header>

        {/* Upload Section */}
        <section
          className="bg-white rounded-2xl shadow p-6 mb-6"
          role="region"
          aria-labelledby="upload-section-heading"
        >
          <h2 id="upload-section-heading" className="text-lg font-medium mb-3">
            Upload documents
          </h2>
          <p className="text-sm text-gray-600 mb-4" id="upload-instructions">
            Upload your Resume and Job Description as PDFs (max 2MB each).
          </p>

          <div
            className="flex flex-col md:flex-row gap-4"
            role="group"
            aria-labelledby="upload-section-heading"
          >
            {/* Resume upload */}
            <div
              className="flex-1 border border-dashed rounded-lg p-4"
              role="group"
              aria-labelledby="resume-upload-label"
            >
              <div className="flex justify-between mb-3">
                <div>
                  <p id="resume-upload-label" className="font-medium">
                    Resume
                  </p>
                  <p className="text-sm text-gray-500">
                    Field name: <code>resume</code>
                  </p>
                </div>
                <button
                  onClick={() => resumeInputRef.current?.click()}
                  className="px-3 py-2 bg-indigo-600 text-white rounded-md"
                  aria-label="Select a resume file to upload"
                >
                  Choose file
                </button>
              </div>
              <input
                ref={resumeInputRef}
                type="file"
                accept=".pdf,application/pdf"
                onChange={(e) => handleFileChange(e, "resume")}
                className="hidden"
                aria-describedby="upload-instructions"
              />
            </div>

            {/* JD upload */}
            <div
              className="flex-1 border border-dashed rounded-lg p-4"
              role="group"
              aria-labelledby="jd-upload-label"
            >
              <div className="flex justify-between mb-3">
                <div>
                  <p id="jd-upload-label" className="font-medium">
                    Job Description (JD)
                  </p>
                  <p className="text-sm text-gray-500">
                    Field name: <code>jd</code>
                  </p>
                </div>
                <button
                  onClick={() => jdInputRef.current?.click()}
                  className="px-3 py-2 bg-indigo-600 text-white rounded-md"
                  aria-label="Select a job description file to upload"
                >
                  Choose file
                </button>
              </div>
              <input
                ref={jdInputRef}
                type="file"
                accept=".pdf,application/pdf"
                onChange={(e) => handleFileChange(e, "jd")}
                className="hidden"
                aria-describedby="upload-instructions"
              />
            </div>
          </div>

          {uploading && (
            <div
              className="mt-4 w-full"
              aria-live="polite"
              aria-label="Upload progress"
            >
              <div
                className="w-full bg-gray-200 rounded-full h-3"
                role="progressbar"
                aria-valuemin="0"
                aria-valuemax="100"
                aria-valuenow={uploadProgress}
              >
                <div
                  className="h-3 rounded-full bg-indigo-600 transition-all duration-300 ease-out"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <p className="text-sm text-gray-600 mt-1">
                Uploading... {uploadProgress}%
              </p>
            </div>
          )}
        </section>

        {/* Uploaded Files Section */}
        <section
          className="bg-white rounded-2xl shadow p-6"
          aria-labelledby="uploaded-files-heading"
          role="region"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 id="uploaded-files-heading" className="text-lg font-medium">
              Uploaded files
            </h3>
          </div>

          {loadingDocs ? (
            <div
              className="flex justify-center py-4"
              role="status"
              aria-live="polite"
            >
              <Loader size="w-8 h-8" color="border-indigo-600" />
              <span className="sr-only">Loading documents...</span>
            </div>
          ) : documents.length === 0 ? (
            <p
              className="text-gray-500 text-sm py-4 text-center"
              role="note"
              aria-live="polite"
            >
              No documents available.
            </p>
          ) : (
            <div
              className="space-y-3"
              role="list"
              aria-label="Uploaded documents list"
            >
              {documents.map((doc) => (
                <div
                  key={doc._id}
                  className="flex items-center justify-between p-3 border rounded-md"
                  role="listitem"
                  aria-label={`Document ${doc.fileName}, type ${doc.type}`}
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-gray-100 rounded px-2 py-1 text-xs font-medium">
                      {doc.type}
                    </div>
                    <div>
                      <p className="font-medium">{doc.fileName}</p>
                      <p className="text-sm text-gray-500">
                        {humanFileSize(doc.fileSize)}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(doc._id)}
                    className="px-3 py-1 bg-red-500 text-white rounded-md text-sm"
                    aria-label={`Delete document ${doc.fileName}`}
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
        {/*  Start Chat Button  */}
        <ConfirmModal
          isOpen={isModalOpen}
          title="Delete this file?"
          message="This action cannot be undone. Do you want to permanently delete this document?"
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
          loading={deleting} 
        />

        {hasResume && hasJD && (
          <div className="max-w-3xl mx-auto mt-10 text-center">
            <button
              onClick={() => navigate("/chat")}
              className="relative inline-flex items-center justify-center px-8 py-3 overflow-hidden font-semibold rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl group"
            >
              <span className="absolute inset-0 w-full h-full bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></span>

              <span>Start Interview Chat</span>
            </button>
          </div>
        )}
      </div>
    </main>
  );
};

export default Dashboard;
