# Project Name

A brief description of your project.  (Replace this with your project's description)

## Getting Started

These instructions will help you get the project up and running on your local machine.

### Prerequisites

* Node.js and npm (or yarn) installed.  (Check with `node -v` and `npm -v` or `yarn -v`)
* MongoDB installed and running (if applicable).
* A Razorpay account.
* A Google Cloud Platform project with OAuth 2.0 credentials configured.

### Installation

1. Clone the repository:

```bash
git clone https://github.com/hackman01/calendar.git

cd calendar

npm install

```

2. Add environment variable files

```
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
MONGODB_URI=your_mongodb_uri 
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret


```

3.Run the application

```
nodemon index.js

```

This rest api will be accesible on ``` http://localhost:8000/ ``` 