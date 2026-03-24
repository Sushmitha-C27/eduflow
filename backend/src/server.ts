import { app } from "./app";
import { PORT } from "./config/env";

app.listen(PORT, () => {
  console.log(`EduFlow API listening on http://localhost:${PORT}`);
});

