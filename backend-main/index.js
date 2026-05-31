require("dns")
  .setDefaultResultOrder(
    "ipv4first"
  );
require("dotenv").config();

const express =
  require("express");

const connectDB =
  require("./config/db");

const cors =
  require("cors");


const bodyParser =
  require("body-parser");

const http =
  require("http");

const { Server } =
  require("socket.io");

const yargs =
  require("yargs");

const { hideBin } =
  require("yargs/helpers");

const mainRouter =
  require("./routes/main.router");

const errorMiddleware =
  require("./middleware/errorMiddleware");

/* =========================
   GIT CONTROLLERS
========================= */

const {
  initRepo
} = require("./controllers/init");

const {
  addRepo
} = require("./controllers/add");

const {
  commitRepo
} = require("./controllers/commit");

const {
  pushRepo
} = require("./controllers/push");

const {
  pullRepo
} = require("./controllers/pull");

const {
  revertRepo
} = require("./controllers/revert");




/* =========================
   EXPRESS APP
========================= */

const app = express();

const PORT =
  process.env.PORT || 3002;

/* =========================
   MIDDLEWARES
========================= */

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://github-clone-three-tan.vercel.app/auth"
    ]
  })
);

app.use(bodyParser.json());

app.use(express.json());

app.use(express.urlencoded({
  extended: true
}));

/* =========================
   ROUTES
========================= */

app.use("/api", mainRouter);

app.get("/", (req, res) => {

  res.send(
    "GitHub Clone API Running"
  );

});

/* =========================
   ERROR HANDLER
========================= */

app.use(errorMiddleware);

/* =========================
   SOCKET SERVER
========================= */

const httpServer =
  http.createServer(app);

const io = new Server(
  httpServer,
  {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  }
);

io.on(
  "connection",
  (socket) => {

    console.log(
      "Socket Connected"
    );

    socket.on(
      "joinRoom",
      (userID) => {

        socket.join(userID);

        console.log(
          `User Joined: ${userID}`
        );

      }
    );

  }
);

/* =========================
   SERVER START
========================= */

async function startServer() {

  await connectDB();

  httpServer.listen(
    PORT,
    () => {

      console.log(
        `Server running on PORT ${PORT}`
      );

    }
  );

}

/* =========================
   YARGS COMMANDS
========================= */

yargs(hideBin(process.argv))

  .command(
    "start",
    "Start server",
    {},
    startServer
  )

  .command(
    "init",
    "Initialize repository",
    {},
    initRepo
  )

  .command(

    "add <file>",

    "Add file",

    (yargs) => {

      yargs.positional(
        "file",
        {
          describe:
            "File to stage",
          type: "string"
        }
      );

    },

    (argv) => {

      addRepo(argv.file);

    }
  )

  .command(

    "commit <message>",

    "Commit files",

    (yargs) => {

      yargs.positional(
        "message",
        {
          describe:
            "Commit message",
          type: "string"
        }
      );

    },

    (argv) => {

      commitRepo(
        argv.message
      );

    }
  )

  .command(
    "push",
    "Push commits",
    {},
    pushRepo
  )

  .command(
    "pull",
    "Pull commits",
    {},
    pullRepo
  )

  .command(

    "revert <commitID>",

    "Revert commit",

    (yargs) => {

      yargs.positional(
        "commitID",
        {
          describe:
            "Commit ID",
          type: "string"
        }
      );

    },

    (argv) => {

      revertRepo(
        argv.commitID
      );

    }
  )

  .demandCommand(1)

  .help()

  .argv;
