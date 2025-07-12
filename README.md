# Skill Swap

A web application that enables users to list their skills and request others in return.  
Built with Node.js, Express, and EJS templating.

---

## Features

✅ *User Profiles*
- Name, location (optional)
- Profile photo (optional)
- List of skills offered & wanted
- Availability (e.g., weekends, evenings)
- Public/private profile option

✅ *Browse & Search*
- Search users by skills (e.g., “Photoshop”, “Excel”)

✅ *Request & Accept Swaps*
- Accept or reject swap offers
- Show current and pending swap requests
- Delete pending swap request if not accepted
- Leave ratings/feedback after a swap

✅ *Admin Role*
- Reject inappropriate or spammy skill descriptions
- Ban users violating platform policies
- Monitor pending, accepted, or cancelled swaps
- Send platform-wide messages (e.g., updates, downtime alerts)
- Download reports of user activity, feedback logs, swap stats

---

## Project Structure
```bash
├── config/
│ ├── db.js
│ └── passport.js
├── middleware/
│ └── auth.js
├── models/
│ ├── Tutor.js
│ ├── TutorRequest.js
│ └── User.js
├── public/ # Static assets (CSS, images, JS)
├── routes/
│ ├── admin.js
│ ├── auth.js
│ ├── index.js
│ └── tutor.js
├── views/ 
│ ├── admin-tutor-req.ejs
│ ├── admin.ejs
│ ├── create-password.ejs
│ ├── dashboard.ejs
│ ├── edit-name.ejs
│ ├── edit-password.ejs
│ ├── index.html
│ ├── login.ejs
│ ├── signup.ejs
│ ├── terms.ejs
│ └── tutor-apply.ejs
├── .env # Environment variables
├── .gitignore
├── app.js # Main application file
├── package.json
└── package-lock.json

```
---

## ⚙ Installation & Usage

```bash
# Clone the repository
git clone https://github.com/ShanmugaRamana/SkillSwap.git
cd SkillSwap

# Install dependencies
npm install

# Set environment variables in .env file
cp .env.example .env
# (Fill in your DB connection string, secret keys, etc.)

# Run the application
npm start

# Or with nodemon (for development)
npm run dev

```

## Tech Stack

- Node.js & Express
- MongoDB / Mongoose
- Passport.js (authentication)
- EJS (templating)
- CSS / JavaScript (frontend)


## Future Enhancements

- Real-time notifications
- Chat between users
- Better swap matching algorithm
- REST API / GraphQL support
- PWA support

## 📄 License
This project is licensed under the MIT License.