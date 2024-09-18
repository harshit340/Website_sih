"use client"

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Flex } from "antd";
import { cn } from "@/lib/utils";
// import { TrashIcon, PlusCircleIcon } from "lucide-react";

interface File {
  id: number;
  name: string;
  type: string;
  lastModified: number;
  size: number;
}

const FileDisplay: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<number[]>([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    setFiles([
      { id: 1, name: "report.docx", type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document", lastModified: Date.now() - 100000, size: 1024 * 500 },
      { id: 2, name: "presentation.pptx", type: "application/vnd.openxmlformats-officedocument.presentationml.presentation", lastModified: Date.now() - 200000, size: 1024 * 1500 },
      { id: 3, name: "data_analysis.pdf", type: "application/pdf", lastModified: Date.now() - 300000, size: 1024 * 800 },
      { id: 4, name: "project_logo.png", type: "image/png", lastModified: Date.now() - 400000, size: 1024 * 250 },
      { id: 5, name: "meeting_notes.txt", type: "text/plain", lastModified: Date.now() - 500000, size: 1024 * 50 },
    ]);
  }, []);

  const toggleFileSelection = (id: number) => {
    setSelectedFiles(prev => 
      prev.includes(id) ? prev.filter(fileId => fileId !== id) : [...prev, id]
    );
  };

  const handleDelete = async (id: number) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      setFiles(files.filter(file => file.id !== id));
      setSelectedFiles(selectedFiles.filter(fileId => fileId !== id));
    } catch (error) {
      console.error("Error deleting file:", error);
    }
  };

  const handleDeleteSelected = async () => {
    try {
      await Promise.all(selectedFiles.map(() => new Promise(resolve => setTimeout(resolve, 500))));
      setFiles(files.filter(file => !selectedFiles.includes(file.id)));
      setSelectedFiles([]);
    } catch (error) {
      console.error("Error deleting selected files:", error);
    }
  };

  const handleAddFile = () => {
    const newFile: File = {
      id: Date.now(),
      name: `New File ${files.length + 1}.txt`,
      type: "text/plain",
      lastModified: Date.now(),
      size: 1024 * Math.floor(Math.random() * 100),
    };
    setFiles([...files, newFile]);
  };

  if (!isClient) {
    return null; // or a loading spinner
  }

  return (
    <div className="min-h-screen w-full dark:bg-black bg-black dark:bg-grid-black/[0.2] bg-grid-white/[0.2] relative flex items-center justify-center p-4">
      <div className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-black bg-black [mask-image:radial-gradient(ellipse_at_center,transparent_20%,white)]"></div>

      <Flex vertical justify="center" className="relative z-10 w-full max-w-4xl p-4 sm:p-8">
        <h1 className="text-white text-center text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">Uploaded Files</h1>
        
        <div className="mb-6 flex flex-wrap justify-between gap-2">
          <button
            onClick={() => setSelectedFiles(files.map(f => f.id))}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors duration-300"
          >
            Upload Files
          </button>
          <button
            onClick={handleDeleteSelected}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors duration-300 flex items-center"
            disabled={selectedFiles.length === 0}
          >
            {/* <TrashIcon className="w-5 h-5 mr-2" /> */}
            Delete Selected ({selectedFiles.length})
          </button>
        </div>
        
        <div className="w-full space-y-4">
          <AnimatePresence>
            {files.map((file) => (
              <motion.div
                key={file.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className={cn(
                  "bg-white bg-opacity-10 backdrop-blur-lg border border-gray-700",
                  "rounded-lg p-3 sm:p-4 shadow-lg hover:shadow-xl transition-all duration-300",
                  selectedFiles.includes(file.id) ? "ring-2 ring-indigo-500" : ""
                )}
                onClick={() => toggleFileSelection(file.id)}
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-semibold text-lg">
                        {file.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="text-base sm:text-lg font-medium text-white">{file.name}</p>
                      <p className="text-xs sm:text-sm text-gray-400">{file.type}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 w-full sm:w-auto justify-between sm:justify-start">
                    <div className="text-right">
                      <p className="text-xs sm:text-sm text-gray-400">
                        {new Date(file.lastModified).toLocaleDateString()}
                      </p>
                      <p className="text-xs sm:text-sm font-medium text-indigo-400">
                        {(file.size / 1024).toFixed(2)} KB
                      </p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(file.id);
                      }}
                      className="text-red-500 hover:text-red-600 transition-colors duration-300"
                      aria-label="Delete file"
                    >
                      {/* <TrashIcon className="w-5 h-5" /> */}
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </Flex>
    </div>
  );
};

export default FileDisplay;