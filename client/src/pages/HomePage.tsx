import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { roomApi } from "../services/api";
import { CreateRoomData, JoinRoomData } from "../types";
import toast from "react-hot-toast";
import { Plus, LogIn, Share2 } from "lucide-react";

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [isCreating, setIsCreating] = useState(false);
  const [isJoining, setIsJoining] = useState(false);

  const [createForm, setCreateForm] = useState<CreateRoomData>({
    name: "",
    password: "",
  });

  const [joinForm, setJoinForm] = useState<JoinRoomData>({
    roomId: "",
    password: "",
  });

  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault();

    if (createForm.name.trim().length === 0) {
      toast.error("Room name is required");
      return;
    }
    if (createForm.password.length < 4) {
      toast.error("Password must be at least 4 characters");
      return;
    }
    setIsCreating(true);
    try {
      const response = await roomApi.createRoom(createForm);
      if (response.success) {
        localStorage.setItem("sharaein_token", response.data.token);
        localStorage.setItem(
          "sharaein_room",
          JSON.stringify({
            id: response.data.roomId,
            name: response.data.name,
          })
        );
        toast.success(`Room "${response.data.name}" created successfully!`);
        navigate(`/room/${response.data.roomId}`);
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to create room";
      if (error.response?.data?.errors) {
        const firstError = error.response.data.errors[0];
        toast.error(firstError.message || errorMessage);
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setIsCreating(false);
    }
  };

  const handleJoinRoom = async (e: React.FormEvent) => {
    e.preventDefault();

    if (joinForm.roomId.length !== 6) {
      toast.error("Room ID must be 6 characters");
      return;
    }
    if (joinForm.password.length < 4) {
      toast.error("Password must be at least 4 characters");
      return;
    }
    setIsJoining(true);
    try {
      const response = await roomApi.joinRoom(joinForm);
      if (response.success) {
        localStorage.setItem("sharaein_token", response.data.token);
        localStorage.setItem(
          "sharaein_room",
          JSON.stringify({
            id: response.data.roomId,
            name: response.data.name,
          })
        );
        toast.success(`Joined room "${response.data.name}" successfully!`);
        navigate(`/room/${response.data.roomId}`);
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to join room";
      if (error.response?.data?.errors) {
        const firstError = error.response.data.errors[0];
        toast.error(firstError.message || errorMessage);
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setIsJoining(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Share2 className="h-12 w-12 text-primary-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-900">SHARAEIN</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Share files securely in real-time with password-protected rooms.
            Create a room or join existing one to start sharing files instantly.
          </p>
        </div>

        {/* Forms */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Create Room */}
          <div className="card">
            <div className="flex items-center mb-6">
              <Plus className="h-6 w-6 text-primary-600 mr-2" />
              <h2 className="text-2xl font-semibold text-gray-900">
                Create Room
              </h2>
            </div>
            <form onSubmit={handleCreateRoom} className="space-y-4">
              <div>
                <label
                  htmlFor="create-name"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Room Name
                </label>
                <input
                  id="create-name"
                  type="text"
                  value={createForm.name}
                  onChange={(e) =>
                    setCreateForm({ ...createForm, name: e.target.value })
                  }
                  className="input-field"
                  placeholder="Enter room name"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="create-password"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Password
                </label>
                <input
                  id="create-password"
                  type="password"
                  value={createForm.password}
                  onChange={(e) =>
                    setCreateForm({ ...createForm, password: e.target.value })
                  }
                  className="input-field"
                  placeholder="Enter password (min. 4 characters)"
                  required
                  minLength={4}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Minimum 4 characters required
                </p>
              </div>
              <button
                type="submit"
                disabled={isCreating}
                className="btn-primary w-full disabled:opacity-50"
              >
                {isCreating ? "Creating..." : "Create Room"}
              </button>
            </form>
          </div>

          {/* Join Room */}
          <div className="card">
            <div className="flex items-center mb-6">
              <LogIn className="h-6 w-6 text-primary-600 mr-2" />
              <h2 className="text-2xl font-semibold text-gray-900">
                Join Room
              </h2>
            </div>
            <form onSubmit={handleJoinRoom} className="space-y-4">
              <div>
                <label
                  htmlFor="join-id"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Room ID
                </label>
                <input
                  id="join-id"
                  type="text"
                  value={joinForm.roomId}
                  onChange={(e) =>
                    setJoinForm({
                      ...joinForm,
                      roomId: e.target.value.toUpperCase(),
                    })
                  }
                  className="input-field"
                  placeholder="Enter 6-digit room ID"
                  maxLength={6}
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="join-password"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Password
                </label>
                <input
                  id="join-password"
                  type="password"
                  value={joinForm.password}
                  onChange={(e) =>
                    setJoinForm({ ...joinForm, password: e.target.value })
                  }
                  className="input-field"
                  placeholder="Enter password (min. 4 characters)"
                  required
                  minLength={4}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Minimum 4 characters required
                </p>
              </div>
              <button
                type="submit"
                disabled={isJoining}
                className="btn-primary w-full disabled:opacity-50"
              >
                {isJoining ? "Joining..." : "Join Room"}
              </button>
            </form>
          </div>
        </div>

        {/* Features */}
        <div className="mt-16 grid md:grid-cols-3 gap-6">
          <div className="text-center p-6">
            <div className="bg-primary-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Share2 className="h-8 w-8 text-primary-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Real-time Sharing
            </h3>
            <p className="text-gray-600">
              Share files instantly with all room members without page refresh
            </p>
          </div>
          <div className="text-center p-6">
            <div className="bg-primary-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Plus className="h-8 w-8 text-primary-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Secure Rooms
            </h3>
            <p className="text-gray-600">
              Password-protected rooms ensure only authorized users can access
            </p>
          </div>
          <div className="text-center p-6">
            <div className="bg-primary-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <LogIn className="h-8 w-8 text-primary-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Easy Access
            </h3>
            <p className="text-gray-600">
              Simple room IDs make it easy to share access with others
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
