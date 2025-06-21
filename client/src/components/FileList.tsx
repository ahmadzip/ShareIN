import React from "react";
import { AppFile } from "../types";
import { fileApi } from "../services/api";
import {
  Download,
  Trash2,
  FileText,
  Image,
  Video,
  Music,
  Archive,
} from "lucide-react";

interface FileListProps {
  files: AppFile[];
  onDelete: (fileId: string) => void;
  isLoading: boolean;
}

export const FileList: React.FC<FileListProps> = ({
  files,
  onDelete,
  isLoading,
}) => {
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getFileIcon = (mimetype: string) => {
    if (mimetype.startsWith("image/"))
      return <Image className="h-5 w-5 text-blue-500" />;
    if (mimetype.startsWith("video/"))
      return <Video className="h-5 w-5 text-purple-500" />;
    if (mimetype.startsWith("audio/"))
      return <Music className="h-5 w-5 text-green-500" />;
    if (
      mimetype.includes("zip") ||
      mimetype.includes("rar") ||
      mimetype.includes("tar")
    ) {
      return <Archive className="h-5 w-5 text-orange-500" />;
    }
    return <FileText className="h-5 w-5 text-gray-500" />;
  };

  const handleDownload = (file: AppFile) => {
    const downloadUrl = fileApi.getDownloadUrl(file.id);
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = file.filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  if (isLoading) {
    return (
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Files</h2>
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-16 bg-gray-200 rounded-lg"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Files</h2>
        <span className="text-sm text-gray-500">{files.length} file(s)</span>
      </div>

      {files.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No files shared yet</p>
          <p className="text-sm text-gray-400 mt-1">
            Upload a file to get started
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {files.map((file) => (
            <div
              key={file.id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center space-x-3 flex-1 min-w-0">
                {getFileIcon(file.mimetype)}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {file.filename}
                  </p>
                  <div className="flex items-center space-x-2 text-xs text-gray-500">
                    <span>{formatFileSize(file.size)}</span>
                    <span>•</span>
                    <span>{formatDate(file.createdAt)}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleDownload(file)}
                  className="p-2 text-gray-400 hover:text-primary-600 transition-colors"
                  title="Download file"
                >
                  <Download className="h-4 w-4" />
                </button>
                <button
                  onClick={() => onDelete(file.id)}
                  className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                  title="Delete file"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
