import { Paper, Typography, List, ListItem, ListItemText } from "@mui/material";

type StatCardProps = {
  title: string;
  content: string | Array<{ key: string; count: number }>;
};

export default function StatCard({ title, content }: StatCardProps) {
  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>

      {Array.isArray(content) ? (
        <List dense>
          {content.map(({ key, count }) => (
            <ListItem key={key} disablePadding>
              <ListItemText
                primary={
                  <>
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
        <Typography variant="body1">{content}</Typography>
      )}
    </Paper>
  );
}
