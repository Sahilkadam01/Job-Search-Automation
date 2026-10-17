import { useRef, useState } from "react";
import {
  FileText,
  Upload,
  FileCheck2,
  ShieldCheck,
  X,
  Sparkles,
  LoaderCircle,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

import { uploadResume } from "../services/api";

export default function Resume() {
  const fileInputRef = useRef(null);

  const [selectedFile, setSelectedFile] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);

  // Validate and select a PDF resume.
  const handleFile = (file) => {
    if (uploading) return;

    setError("");
    setUploadResult(null);

    if (!file) return;

    const isPdf =
      file.type === "application/pdf" ||
      file.name.toLowerCase().endsWith(".pdf");

    if (!isPdf) {
      setSelectedFile(null);
      setError("Please select a PDF resume.");
      return;
    }

    if (file.size === 0) {
      setSelectedFile(null);
      setError("The selected file is empty. Please choose another PDF.");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setSelectedFile(null);
      setError("Your resume must be smaller than 10 MB.");
      return;
    }

    setSelectedFile(file);
  };

  // Handle drag-and-drop.
  const handleDrop = (event) => {
    event.preventDefault();
    setDragging(false);

    handleFile(event.dataTransfer.files?.[0]);
  };

  // Upload the selected resume to the FastAPI backend.
  const handleUpload = async () => {
    if (!selectedFile || uploading) return;

    setUploading(true);
    setError("");
    setUploadResult(null);

    try {
      const result = await uploadResume(selectedFile);

      setUploadResult({
        success: true,
        message:
          result?.message ||
          (result?.filename
            ? `Uploaded: ${result.filename}`
            : "Your resume was uploaded successfully."),
      });
    } catch (err) {
      const detail = err.response?.data?.detail;

      let message =
        "Resume upload failed. Please try again.";

      if (typeof detail === "string") {
        message = detail;
      } else if (Array.isArray(detail)) {
        message = detail
          .map((item) => item.msg || "Invalid request")
          .join(", ");
      } else if (!err.response && err.code === "ECONNABORTED") {
        message =
          "The upload timed out. Check your backend and try again.";
      } else if (!err.response) {
        message =
          "Cannot connect to the backend. Make sure your FastAPI server is running.";
      } else if (err.message) {
        message = err.message;
      }

      setError(message);
    } finally {
      setUploading(false);
    }
  };

  // Remove the selected file.
  const removeFile = () => {
    if (uploading) return;

    setSelectedFile(null);
    setError("");
    setUploadResult(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(0)} KB`;
    }

    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <div className="mx-auto max-w-5xl space-y-7">
      {/* Page heading */}
      <header>
        <div className="flex items-center gap-2 text-sm font-medium text-violet-700">
          <Sparkles size={16} />
          AI Career Assistant
        </div>

        <h1 className="mt-3 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          My Resume
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
          Upload your resume to prepare your candidate profile
          for personalized job discovery and resume matching.
        </p>
      </header>

      {/* Upload card */}
      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
        <div className="flex items-start gap-4">
          <div className="rounded-2xl bg-violet-100 p-3 text-violet-700">
            <FileText size={25} />
          </div>

          <div>
            <h2 className="font-bold text-slate-900">
              Upload your resume
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              PDF format only, up to 10 MB.
            </p>
          </div>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,application/pdf"
          className="hidden"
          disabled={uploading}
          onChange={(event) => {
            handleFile(event.target.files?.[0]);
            event.target.value = "";
          }}
        />

        {/* Drag-and-drop area */}
        <div
          onDragOver={(event) => {
            event.preventDefault();
            if (!uploading) setDragging(true);
          }}
          onDragLeave={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget)) {
              setDragging(false);
            }
          }}
          onDrop={handleDrop}
          onClick={() => {
            if (!uploading) {
              fileInputRef.current?.click();
            }
          }}
          onKeyDown={(event) => {
            if (
              !uploading &&
              (event.key === "Enter" || event.key === " ")
            ) {
              event.preventDefault();
              fileInputRef.current?.click();
            }
          }}
          role="button"
          tabIndex={uploading ? -1 : 0}
          aria-label="Choose a PDF resume or drag and drop a file"
          className={`mt-7 flex min-h-64 flex-col items-center justify-center rounded-2xl border-2 border-dashed px-5 py-10 text-center transition ${
            uploading
              ? "cursor-not-allowed opacity-60"
              : dragging
                ? "cursor-pointer border-violet-500 bg-violet-50"
                : "cursor-pointer border-slate-300 bg-slate-50/70 hover:border-violet-400 hover:bg-violet-50/50"
          }`}
        >
          <div className="rounded-2xl bg-white p-4 text-violet-700 shadow-sm">
            <Upload size={28} />
          </div>

          <p className="mt-5 font-semibold text-slate-800">
            Drop your resume here or{" "}
            <span className="text-violet-700">browse files</span>
          </p>

          <p className="mt-2 text-sm text-slate-500">
            Choose a PDF file from your computer
          </p>
        </div>

        {/* Error message */}
        {error && (
          <div
            role="alert"
            className="mt-4 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4"
          >
            <AlertCircle
              size={20}
              className="mt-0.5 shrink-0 text-red-600"
            />

            <p className="text-sm leading-6 text-red-700">
              {error}
            </p>
          </div>
        )}

        {/* Selected file */}
        {selectedFile && (
          <div className="mt-5 flex items-center gap-3 rounded-2xl border border-violet-200 bg-violet-50/60 p-4">
            <div className="rounded-xl bg-white p-3 text-violet-700">
              <FileCheck2 size={22} />
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-slate-800">
                {selectedFile.name}
              </p>

              <p className="mt-1 text-xs text-slate-500">
                {formatFileSize(selectedFile.size)}
                {" · "}
                {uploadResult?.success
                  ? "Uploaded"
                  : "Ready for upload"}
              </p>
            </div>

            <button
              type="button"
              aria-label="Remove selected resume"
              disabled={uploading}
              onClick={removeFile}
              className="rounded-lg p-2 text-slate-500 transition hover:bg-white hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <X size={18} />
            </button>
          </div>
        )}

        {/* Upload button */}
        {selectedFile && (
          <button
            type="button"
            onClick={handleUpload}
            disabled={uploading || uploadResult?.success}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
          >
            {uploading ? (
              <>
                <LoaderCircle size={18} className="animate-spin" />
                Uploading resume...
              </>
            ) : uploadResult?.success ? (
              <>
                <CheckCircle2 size={18} />
                Resume uploaded
              </>
            ) : (
              <>
                <Upload size={18} />
                Upload resume
              </>
            )}
          </button>
        )}

        {/* Success message */}
        {uploadResult?.success && (
          <div
            role="status"
            className="mt-4 flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4"
          >
            <CheckCircle2
              size={20}
              className="mt-0.5 shrink-0 text-emerald-700"
            />

            <div>
              <p className="text-sm font-semibold text-emerald-800">
                Resume uploaded successfully
              </p>

              <p className="mt-1 break-words text-sm text-emerald-700">
                {uploadResult.message}
              </p>
            </div>
          </div>
        )}

        {/* Privacy information */}
        <div className="mt-6 flex items-start gap-3 rounded-xl bg-emerald-50 p-4">
          <ShieldCheck
            size={20}
            className="mt-0.5 shrink-0 text-emerald-700"
          />

          <p className="text-xs leading-5 text-emerald-800">
            Your resume is sent to your configured backend only
            when you click Upload resume. Upload success confirms
            the backend accepted the request; it does not by itself
            confirm that job matching has completed.
          </p>
        </div>
      </section>

      {/* Next steps */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
        <h2 className="font-bold text-slate-900">
          What happens next?
        </h2>

        <div className="mt-5 grid gap-5 sm:grid-cols-3">
          {[
            {
              number: "01",
              title: "Upload resume",
              description:
                "Choose your latest resume in PDF format.",
            },
            {
              number: "02",
              title: "Extract profile",
              description:
                "Prepare candidate information from your document.",
            },
            {
              number: "03",
              title: "Find relevant jobs",
              description:
                "Use your profile to support personalized job matching.",
            },
          ].map((step) => (
            <div key={step.number} className="flex gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-xs font-bold text-violet-700">
                {step.number}
              </span>

              <div>
                <h3 className="text-sm font-semibold text-slate-800">
                  {step.title}
                </h3>

                <p className="mt-1 text-xs leading-5 text-slate-500">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}