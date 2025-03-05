import express, { type Request, Response, NextFunction } from "express";
import session from "express-session";
import { registerRoutes } from "./routes";
import { setupVite, log } from "./vite";
import { sheetsService } from "./sheets"; // Added import for Google Sheets service

// Extend Express Session type
declare module "express-session" {
  interface SessionData {
    userId: number | undefined;
  }
}

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Add session middleware
app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  })
);

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

// Add auth check middleware
app.get("/api/auth/me", (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ message: "Not authenticated" });
  }
  res.json({ id: req.session.userId });
});

(async () => {
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const port = 5000;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`serving on port ${port}`);
  });
})();

//Added this part.  Needs a corresponding sheets.ts file.
//This is a placeholder, and you will need to replace it with your actual implementation.
//This section also requires environment variables to be configured properly.
//Please consult Google Sheets API documentation for details.

//sheets.ts
// export const sheetsService = {
//   async setupSheets() {
//     // Your Google Sheets setup logic here.  This will likely involve authenticating
//     // with the Google API and establishing a connection to your spreadsheet.
//   },
//   async getData(sheetName, range){
//     //Your logic to retrieve data from the Google Sheets here
//   },
//   async setData(sheetName, range, data){
//     //Your logic to write data to the Google Sheets here
//   }
// }