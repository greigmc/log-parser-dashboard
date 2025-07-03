import React, { useState, useRef } from "react";
import StatCard from "./StatCard";
import { parseLogFile, getTopN } from "../../utils/parser";
import type { LogStats } from "../../utils/parser";
import { Container, Box, Typography, Input, Alert } from "@mui/material";

export default function LogDashboard() {
  const [stats, setStats] = useState<LogStats | null>(null);
  const [error, setError] = useState("");
  const [isDragOver, setIsDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const content = ev.target?.result as string;
        const parsedStats = parseLogFile(content);
        setStats(parsedStats);
        setError("");
      } catch {
        setError("Failed to parse the log file.");
      }
    };
    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Typography variant="h3" component="h1" textAlign="center" gutterBottom>
        Log File Analyzer
      </Typography>

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
        <Input
          type="file"
          inputProps={{ accept: ".log,.txt", "aria-label": "Upload log file" }}
          inputRef={inputRef}
          onChange={handleFileChange}
          sx={{ display: "none" }}
        />
      </Box>

      {error && (
        <Alert severity="error" sx={{ mt: 3 }}>
          {error}
        </Alert>
      )}

      {stats && (
        <Box mt={5} display="flex" flexDirection="column" gap={3}>
          <StatCard
            title="Unique IP Addresses"
            content={stats.uniqueIPs.size.toString()}
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
