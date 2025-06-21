import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AppFile } from "../types";
import { roomApi, fileApi } from "../services/api";
import { useSocket } from "../hooks/useSocket";
import { FileList } from "../components/FileList";
import { FileUpload } from "../components/FileUpload";
import toast from "react-hot-toast";
import { Share2, Copy, LogOut } from "lucide-react";

export const RoomPage: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const [files, setFiles] = useState<AppFile[]>([]);
  const [roomInfo, setRoomInfo] = useState<{ id: string; name: string } | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);

  const handleNewFile = useCallback((file: AppFile) => {
    setFiles((prev) => [file, ...prev]);
    toast.success(`New file uploaded: ${file.filename}`);
  }, []);

  const handleFileDeleted = useCallback((fileId: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== fileId));
    toast.success("File deleted successfully");
  }, []);

  const handleUserJoined = useCallback(
    (data: { message: string; timestamp: string }) => {
      toast.success(data.message);
    },
    []
  );

  const handleUserLeft = useCallback(
    (data: { message: string; timestamp: string }) => {
      toast(data.message, { icon: "👋" });
    },
    []
  );

  const { isConnected } = useSocket({
    roomId,
    onNewFile: handleNewFile,
    onFileDeleted: handleFileDeleted,
    onUserJoined: handleUserJoined,
    onUserLeft: handleUserLeft,
  });

  useEffect(() => {
    const loadRoomData = async () => {
      if (!roomId) {
        navigate("/");
        return;
      }
      try {
        const storedRoom = localStorage.getItem("sharaein_room");
        if (storedRoom) {
          const room = JSON.parse(storedRoom);
          if (room.id === roomId) {
            setRoomInfo(room);
          }
        }
        const response = await roomApi.getRoomFiles(roomId);
        if (response.success && response.data) {
          setFiles(response.data);
        }
      } catch (error: any) {
        console.error("Error loading room data:", error);
        toast.error("Failed to load room data");
        if (error.response?.status === 401 || error.response?.status === 404) {
          navigate("/");
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadRoomData();
  }, [roomId, navigate]);

  const handleFileUpload = async (file: File) => {
    if (!roomId) return;
    try {
      const response = await fileApi.uploadFile(roomId, file);
      if (response.success && response.data) {
        toast.success("File uploaded successfully!");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to upload file");
    }
  };

  const handleFileDelete = async (fileId: string) => {
    try {
      await fileApi.deleteFile(fileId);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to delete file");
    }
  };

  const handleCopyRoomId = () => {
    if (roomId) {
      navigator.clipboard.writeText(roomId);
      toast.success("Room ID copied to clipboard!");
    }
  };

  const handleLeaveRoom = () => {
    localStorage.removeItem("sharaein_token");
    localStorage.removeItem("sharaein_room");
    navigate("/");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading room...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Share2 className="h-8 w-8 text-primary-600 mr-3" />
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  {roomInfo?.name || "Room"}
                </h1>
                <div className="flex items-center text-sm text-gray-500">
                  <span>ID: {roomId}</span>
                  <button
                    onClick={handleCopyRoomId}
                    className="ml-2 p-1 text-gray-400 hover:text-gray-600"
                    title="Copy Room ID"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center text-sm text-gray-500">
                <div
                  className={`w-2 h-2 rounded-full mr-2 ${
                    isConnected ? "bg-green-500" : "bg-red-500"
                  }`}
                ></div>
                {isConnected ? "Connected" : "Disconnected"}
              </div>
              <button
                onClick={handleLeaveRoom}
                className="flex items-center text-sm text-gray-600 hover:text-gray-900"
              >
                <LogOut className="h-4 w-4 mr-1" />
                Leave
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* File Upload */}
          <div className="lg:col-span-1">
            <FileUpload onUpload={handleFileUpload} />
          </div>

          {/* File List */}
          <div className="lg:col-span-2">
            <FileList
              files={files}
              onDelete={handleFileDelete}
              isLoading={isLoading}
            />
          </div>
        </div>
      </main>
    </div>
  );
};
