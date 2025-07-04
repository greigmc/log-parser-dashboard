import { Paper, Typography, List, ListItem, ListItemText } from "@mui/material";

// Props type for StatCard
type StatCardProps = {
  title: string;
  content: string | Array<{ key: string; count: number }>; // Can be a plain string or a list of key-count pairs
};

export default function StatCard({ title, content }: StatCardProps) {
  return (
    // Paper provides a card-like surface with elevation
    <Paper elevation={3} sx={{ p: 3 }}>
      {/* Card title */}
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>

      {/* Conditional rendering: either display a list or a single string */}
      {Array.isArray(content) ? (
        <List dense>
          {/* Map over key-count pairs and display each as a list item */}
          {content.map(({ key, count }) => (
            <ListItem key={key} disablePadding>
              <ListItemText
                primary={
                  <>
                    {/* IP or URL key in monospace */}
                    <Typography
                      component="span"
                      sx={{ fontFamily: "monospace", mr: 1 }}
                    >
                      {key}
                    </Typography>
                    {" — "}
                    {count}
                  </>
                }
              />
            </ListItem>
          ))}
        </List>
      ) : (
        // If content is a string (e.g., total count), render as plain text
        <Typography variant="body1">{content}</Typography>
      )}
    </Paper>
  );
}
