# Dynamic QR Code

A simple dynamic QR code project using Node.js, Express and SQLite.

## Requirements

- Node.js installed
- Internet connection for installing packages

## Install

Open a terminal in this folder:

```bash
npm install
```

## Run

```bash
npm start
```

Open:

http://localhost:3000

## Create a QR

Enter:

- QR ID: `college`
- Destination: `https://google.com`

The QR points to:

```text
http://localhost:3000/q/college
```

## Change the destination

Open:

http://localhost:3000/admin.html

Enter:

- QR ID: `college`
- New destination: `https://youtube.com`

The same QR will now redirect to YouTube.

## Important

For QR codes to work from other phones outside your computer/network, deploy the application to a public HTTPS server. The included admin endpoint is intentionally simple and should be protected with authentication before public deployment.
