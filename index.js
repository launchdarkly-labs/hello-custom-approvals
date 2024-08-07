const express = require("express");
const { v4: uuidv4 } = require("uuid");
const Jabber = require("jabber").default;

require("dotenv").config();
const jabber = new Jabber();
const app = express();

const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Custom approvals service is up and running.");
});

app.get("/approvals", (req, res) => {
  res.send(`Hello approval request: ${req.query.approvalID}`);
});

const idToDetailsMap = {};

app.use(express.json());

// Middleware to check the API key
app.use((req, res, next) => {
  console.log(`Got a ${req.method} request to ${req.path}`);
  console.log("Request body:\n", req.body);

  const authorizationHeader = req.headers["authorization"];
  const secret = authorizationHeader?.split("Bearer ")[1];
  if (secret !== process.env.SECRET_KEY) {
    console.log("secret", secret);
    console.log("Invalid API key. Return a 401");
    res.status(401).json({
      error: "Unauthorized",
    });
    return;
  }
  next();
});

app.post("/api/approvals", (req, res) => {
  const approvalId = uuidv4();
  idToDetailsMap[approvalId] = req.body.details;
  const responseBody = {
    id: approvalId,
    result: {
      status: "pending",
      displayStatus: "Pending",
    },
  };
  console.log("Responding with:\n", responseBody);
  res.status(201).json(responseBody);
});

app.get("/api/approvals/:id/status", (req, res) => {
  const randomStatus = jabber.createWord(6, true);
  const result = {
    status: randomStatus,
    displayStatus: randomStatus,
  };

  const details = idToDetailsMap[req.params.id];
  randomValue = Math.random();
  if (details?.toLowerCase().includes("please") || randomValue < 0.33) {
    result.status = "approved";
    result.displayStatus = "Approved";
  }

  if (details?.toLowerCase().includes("!")) {
    result.status = "declined";
    result.displayStatus = "Don't be so rude!";
  }

  const responseBody = {
    result,
  };
  console.log("Responding with:\n", responseBody);
  res.status(200).json(responseBody);
});

app.patch("/api/approvals/:id/cancel", (req, res) => {
  // Add logic to do something after the approval request has been deleted in LaunchDarkly.
  res.status(204).send();
});

app.patch("/api/approvals/:id/applied", (req, res) => {
  // Add logic to do something after the approval request has been applied in LaunchDarkly.
  res
    .status(200)
    .send({ result: { status: "approved", displayStatus: "Approved" } });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
