const APP_NAME = process.env.APP_NAME || "PBI Dashboard";
const DEVELOPER_NAME = process.env.DEVELOPER_NAME || "PBI";
const SUPPORT_EMAIL =
  process.env.SUPPORT_EMAIL || "support@pbi.web.id";

const deletionPolicy = {
  appName: APP_NAME,
  developerName: DEVELOPER_NAME,
  title: `Delete your ${APP_NAME} account`,
  requestMethods: [
    {
      method: "In app",
      steps: [
        "Login to the PBI Dashboard application.",
        "Open Profile or Account settings.",
        "Choose Delete Account.",
        "Confirm the deletion request.",
      ],
    },
    {
      method: "Email",
      steps: [
        `Send an email to ${SUPPORT_EMAIL}.`,
        "Use the subject: Delete PBI Dashboard account.",
        "Include the email address registered to your account.",
        "Our team will verify the request before processing deletion.",
      ],
    },
    {
      method: "API",
      steps: [
        "Login to get a valid access token.",
        "Send DELETE /v1/auth/account with Authorization: Bearer <token>.",
        "The account linked to the token will be deleted.",
      ],
    },
  ],
  deletedData: [
    "Account profile data, including name, email address, phone number, avatar, role, status, and password hash.",
    "Uploaded profile avatar files when available.",
  ],
  retainedData: [
    "Transaction, payment, audit, activity, support, security, or legal records may be retained when needed for fraud prevention, dispute handling, accounting, security, or legal obligations.",
    "Content that has already been anonymized, aggregated, or cannot reasonably identify you may be retained.",
  ],
  retentionPeriod: {
    accountDeletion: "Account deletion requests are processed within 30 days.",
    additionalRetention:
      "Retained operational, transaction, audit, and legal records may be kept for up to 90 days after account deletion unless a longer period is required by law.",
  },
  contact: {
    email: SUPPORT_EMAIL,
  },
};

exports.getPolicy = (req, res) => {
  res.json(deletionPolicy);
};

exports.getPolicyPage = (req, res) => {
  res.type("html").send(`<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${deletionPolicy.title}</title>
    <style>
      body {
        margin: 0;
        font-family: Arial, sans-serif;
        line-height: 1.6;
        color: #1f2937;
        background: #f8fafc;
      }
      main {
        max-width: 840px;
        margin: 0 auto;
        padding: 40px 20px;
      }
      section {
        margin-top: 28px;
      }
      h1, h2 {
        color: #111827;
        line-height: 1.25;
      }
      h1 {
        font-size: 32px;
        margin-bottom: 8px;
      }
      h2 {
        font-size: 22px;
        margin-bottom: 10px;
      }
      ol, ul {
        padding-left: 24px;
      }
      .meta {
        color: #4b5563;
      }
    </style>
  </head>
  <body>
    <main>
      <h1>${deletionPolicy.title}</h1>
      <p class="meta">Application: ${APP_NAME}<br>Developer: ${DEVELOPER_NAME}</p>

      <section>
        <h2>How to request account deletion</h2>
        <ol>
          <li>Login to the ${APP_NAME} application.</li>
          <li>Open Profile or Account settings.</li>
          <li>Choose Delete Account and confirm your request.</li>
          <li>If you cannot access the app, email <a href="mailto:${SUPPORT_EMAIL}">${SUPPORT_EMAIL}</a> with the subject "Delete PBI Dashboard account" and include your registered email address.</li>
        </ol>
      </section>

      <section>
        <h2>Data deleted</h2>
        <ul>
          ${deletionPolicy.deletedData.map((item) => `<li>${item}</li>`).join("")}
        </ul>
      </section>

      <section>
        <h2>Data retained</h2>
        <ul>
          ${deletionPolicy.retainedData.map((item) => `<li>${item}</li>`).join("")}
        </ul>
      </section>

      <section>
        <h2>Retention period</h2>
        <p>${deletionPolicy.retentionPeriod.accountDeletion}</p>
        <p>${deletionPolicy.retentionPeriod.additionalRetention}</p>
      </section>
    </main>
  </body>
</html>`);
};
