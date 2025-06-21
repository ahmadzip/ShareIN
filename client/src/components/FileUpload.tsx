import React, { useState, useCallback } from "react";
import { Upload, X, FileText } from "lucide-react";

interface FileUploadProps {
  onUpload: (file: File) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onUpload }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      setSelectedFile(files[0]);
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setSelectedFile(files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    try {
      await onUpload(selectedFile);
      setSelectedFile(null);
      const fileInput = document.getElementById(
        "file-input"
      ) as HTMLInputElement;
      if (fileInput) fileInput.value = "";
    } catch (error) {
      console.error("Upload error:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleCancel = () => {
    setSelectedFile(null);
    const fileInput = document.getElementById("file-input") as HTMLInputElement;
    if (fileInput) fileInput.value = "";
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="card">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Upload File</h2>

      {!selectedFile ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            isDragOver
              ? "border-primary-500 bg-primary-50"
              : "border-gray-300 hover:border-gray-400"
          }`}
        >
          <Upload
            className={`h-12 w-12 mx-auto mb-4 ${
              isDragOver ? "text-primary-600" : "text-gray-400"
            }`}
          />
          <p className="text-lg font-medium text-gray-900 mb-2">
            Drop your file here
          </p>
          <p className="text-sm text-gray-500 mb-4">or click to browse files</p>
          <input
            id="file-input"
            type="file"
            onChange={handleFileSelect}
            className="hidden"
          />
          <label
            htmlFor="file-input"
            className="btn-primary cursor-pointer inline-block"
          >
            Choose File
          </label>
          <p className="text-xs text-gray-400 mt-4">
            Maximum file size: 500MB • All file types supported
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center p-4 bg-gray-50 rounded-lg">
            <FileText className="h-8 w-8 text-gray-400 mr-3" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {selectedFile.name}
              </p>
              <p className="text-xs text-gray-500">
                {formatFileSize(selectedFile.size)}
              </p>
            </div>
            <button
              onClick={handleCancel}
              className="p-1 text-gray-400 hover:text-gray-600"
              disabled={isUploading}
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={handleUpload}
              disabled={isUploading}
              className="btn-primary flex-1 disabled:opacity-50"
            >
              {isUploading ? "Uploading..." : "Upload File"}
            </button>
            <button
              onClick={handleCancel}
              disabled={isUploading}
              className="btn-secondary"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
