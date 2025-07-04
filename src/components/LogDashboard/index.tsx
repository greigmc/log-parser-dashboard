import React, { useState, useRef } from "react";
import StatCard from "./StatCard";
import { parseLogFile, getTopN } from "../../utils/parser";
import type { LogStats } from "../../utils/parser";
import { Container, Box, Typography, Input, Alert } from "@mui/material";

export default function LogDashboard() {
  // State to store parsed log statistics
  const [stats, setStats] = useState<LogStats | null>(null);

  // State to store any error messages
  const [error, setError] = useState("");

  // State to track if a file is being dragged over the drop zone
  const [isDragOver, setIsDragOver] = useState(false);

  // State to track uploaded file size (in bytes)
  const [fileSize, setFileSize] = useState<number | null>(null);

  // Ref to trigger file input click programmatically
  const inputRef = useRef<HTMLInputElement>(null);

  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes

  // Parse and handle the uploaded log file
  const handleFile = (file: File) => {
    if (file.size > MAX_FILE_SIZE) {
      setError("File is too large. Maximum allowed size is 5MB.");
      setStats(null);
      setFileSize(null);
      return;
    }

    setFileSize(file.size);
    setError("");

    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const content = ev.target?.result as string;
        const parsedStats = parseLogFile(content);
        setStats(parsedStats);
      } catch {
        setError("Failed to parse the log file.");
        setStats(null);
      }
    };
    reader.readAsText(file);
  };

  // Handle file drop (drag and drop upload)
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  // Update state when a file is dragged over the drop zone
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  // Reset drag-over state when dragging leaves the drop zone
  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  // Trigger file input click when the drop area is clicked
  const handleClick = () => {
    inputRef.current?.click();
  };

  // Handle file selected via traditional input
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      {/* Page Heading */}
      <Typography variant="h3" component="h1" textAlign="center" gutterBottom>
        Log File Analyzer
      </Typography>

      {/* File Upload Box (click or drag-and-drop) */}
      <Box
        onClick={handleClick}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        sx={{
          border: "2px dashed",
          borderColor: isDragOver ? "#1976d2" : "#ccc",
          borderRadius: 2,
          p: 4,
          textAlign: "center",
          cursor: "pointer",
          transition: "border-color 0.3s",
          backgroundColor: isDragOver ? "#f0f8ff" : "inherit",
        }}
      >
        <Typography variant="body1" gutterBottom>
          Drag and drop a log file here or click to upload
        </Typography>

        {/* Hidden file input */}
        <Input
          type="file"
          inputProps={{ accept: ".log,.txt", "aria-label": "Upload log file" }}
          inputRef={inputRef}
          onChange={handleFileChange}
          sx={{ display: "none" }}
        />
      </Box>

      {/* Show file size if available */}
      {fileSize !== null && (
        <Typography variant="body2" mt={1} textAlign="center">
          File size: {(fileSize / 1024 / 1024).toFixed(2)} MB
        </Typography>
      )}

      {/* Error message display */}
      {error && (
        <Alert severity="error" sx={{ mt: 3 }}>
          {error}
        </Alert>
      )}

      {/* Display statistics if available */}
      {stats && (
        <Box mt={5} display="flex" flexDirection="column" gap={3}>
          {/* <StatCard
            title="All Unique IP Addresses"
            content={[...stats.uniqueIPs].map((ip) => ({ key: ip, count: 1 }))}
          /> */}

          <StatCard
            title="All Unique IP Addresses"
            content={[{ key: "Unique IPs", count: stats.uniqueIPs.size }]}
          />

          <StatCard
            title="Top 3 Visited URLs"
            content={getTopN(stats.urlCounts, 3)}
          />
          <StatCard
            title="Top 3 Active IP Addresses"
            content={getTopN(stats.ipCounts, 3)}
          />
        </Box>
      )}
    </Container>
  );
}
