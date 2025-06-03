# 📝 Confession Box – Anonymous Confessions, Limitless Fun! 🤫

Welcome to the **Confession Box** – a playful space where you can spill your secrets, share your stories, and unleash your wildest thoughts… all completely anonymously! Whether you want to vent, joke, make people smile, or just see what confessions others are making.

---

## 🌟 What is Confession Box?

Confession Box is a web app where anyone can submit their confessions, secrets, or stories **without revealing their identity**. Share your thoughts, crushes, embarrassing stories, or even a compliment for someone—all anonymously. No sign-up, no worries, just pure fun!

---

## 🚀 Features

- **100% Anonymous:** No login, no email, just your thoughts.
- **Fun UI:** Delightful gradients, floating emojis, and animated hearts.
- **Public or Private:** Choose if your confession is public, or keep it private.
- **Hints & Hashtags:** Add context or make it spicy with hashtags and fun hints.
- **Smart Rate Limiting:** Only 5 confessions per IP per day, so no spamming!
- **Behavioral & Device Stats:** Collects cool (but non-identifiable) info like connection type, browser, and more.
- **Mobile Friendly:** Gorgeous on your phone, tablet, or desktop.
- **Owner Tag:** Proudly display your confession page name/handle.

---

## 🎉 Live Demo

> _Host it locally or deploy and see the magic!_

---

## 🛠️ How to Run Locally

1. **Clone the repo:**
   ```bash
   git clone https://github.com/Ayushhhhhhh78/confession.git
   cd confession-box
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:** (prefer to skip this part or you can do creating you own token)
   - Create a `.env` file in the root.
   - Add your [ipinfo.io](https://ipinfo.io/) API token:
     ```
     LOCATION_TOKEN=your_ipinfo_token_here
     ```

4. **Start MongoDB:**  
   Make sure MongoDB is running on your machine (default: `mongodb://localhost:27017/confess`).

5. **Run the server:**
   ```bash
   npm start
   ```
   The app will be live at [http://localhost:5000](http://localhost:5000)

---

## 💻 Project Structure

```
/public            # Static assets (CSS, favicon, etc)
views/form.ejs     # The confession form page
app.js             # Main server code (Express + Mongoose)
README.md          # This file!
```

---

## 🤹‍♂️ Tech Stack

- **Backend:** Node.js, Express, MongoDB (Mongoose)
- **Frontend:** EJS, HTML, CSS (modern, responsive, animated)
- **APIs:** ipinfo.io (for fun geolocation/IP stats)
- **Other:** request-ip, express-useragent

---

## 🤪 Why Use This?

- Start a fun confession trend in your school/college/office.
- Host a crushes or secrets page for your friend group.
- Run a meme/vent site for your community.
- Just play around with web tech and have some laughs!

---

## 🙈 Confession Rules

- **Don't share your real identity (unless you want to, but why?!)**
- **No hate, bullying, or illegal stuff.**
- Have fun & respect others!

---

---

## 🦄 Want to Customize?

- Change the page handle in the frontend for your own gossip group.
- Tweak the CSS for even more crazy fun.
- Add moderation or an admin panel if you want to display confessions publicly.
- Deploy on [Render](https://render.com/), [Vercel](https://vercel.com/), or your favorite host.

---

## 🏷️ Credits

- Emojis: [Twemoji](https://twemoji.twitter.com/)
- UI Inspiration: The entire internet & confessions culture
- Built by [Aayush](https://github.com/Ayushhhhhhh78)

---

## 🥳 Now what?

Go ahead—launch it, confess something wild, and share the link with your friends.
Let’s make secrets fun again! 🚀

---

> _“The best confessions are the ones that make you laugh, think, or just say… ‘same!’”_
