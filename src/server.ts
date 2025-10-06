import { Server } from "http";
import app from "./app";
import { envVars } from "./app/config/env";
import { prisma } from "./app/config/db";

let server: Server;

async function connectToDB() {
  try {
    await prisma.$connect();
    console.log("DB Connection successfully")
  } catch (error) {
    console.log("DB connection failed")
    process.exit(1);
  }
}

const startServer = async () => {
  try {
    await connectToDB();
    server = app.listen(envVars.PORT, () => {
      console.log(`Server is listening to Port ${envVars.PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
};

(async () => {
  await startServer();
})();

// unhandled rejection error
process.on("unhandledRejection", (err) => {
  console.log("Unhandled Rejection detected... server shutting down..", err);

  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }

  process.exit(1);
});

// uncaught rejection error
process.on("uncaughtException", (err) => {
  console.log("Uncaught Exception detected... server shutting down..", err);

  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }

  process.exit(1);
});

// signal termination sigterm
process.on("SIGTERM", () => {
  console.log("SIGTERM signal received... server shutting down..");

  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }

  process.exit(1);
});