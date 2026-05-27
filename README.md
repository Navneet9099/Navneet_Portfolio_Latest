# Navneet Kesarwani Editorial Portfolio v2.0 — Redesigned Dion Pieters Style 🚀✨

A premium, high-end editorial-style portfolio showcasing the journey, projects, and skills of a Full Stack Developer & DevOps Enthusiast. Redesigned with a focus on bold typography, micro-interactions, dark/light themes, and interactive animations.

👉 **Live Local URL**: [http://localhost:3000/](http://localhost:3000/)

---

## 🎨 Design Philosophy & Features

Inspired by the editorial grid aesthetic of Dion Pieters:
*   **Immersive Preloader**: A smooth, custom Synapser-inspired preloader counting up from `00` to `100` before revealing the portfolio.
*   **Synapse Interactive Canvas**: A responsive, custom HTML5 canvas in the background that generates organic network nodes connecting to floating keyword tags, complete with a mouse-pull parallax effect.
*   **Dual Color Modes (Dark/Light)**: Clean, high-end paper aesthetics. Warm off-white background in Light Mode, and a warm luxurious matte charcoal background in Dark Mode, with a custom 360° spinning switch transition.
*   **Accordion Works List**: Dynamic, clean accordion layout for project details, featuring smooth expandable rows, tag decks, and interactive slide animations.
*   **Magnetic Hover Pull**: Micro-animations on core buttons and CTAs that subtly pull toward the user's cursor for enhanced physical presence.
*   **Smooth Scroll Navigation**: Seamless anchor scrolling with sticky header transitions.

---

## 🛠️ Technology Stack

*   **Frontend**: Pure HTML5, Vanilla CSS3 (custom CSS variables & HSL-tailored layout tokens), and Vanilla Javascript (ES6+).
*   **Server**: Zero-dependency Node.js HTTP server configured with correct MIME type responses and automatic PDF attachment downloads.
*   **Icons**: Devicon (Devicon CDN integration) and SVG vectors.
*   **Typography**: Playfair Display, DM Sans, and JetBrains Mono from Google Fonts.

---

## 📁 Project Structure

```text
├── assets/
│   ├── css/
│   │   ├── main.css          # Primary design system, typography, dark mode & layout styles
│   │   └── responsive.css    # Comprehensive mobile and tablet media query overrides
│   ├── js/
│   │   ├── main.js           # Core layout scripts, sticky nav, preloader & canvas logic
│   │   ├── counters.js       # requestAnimationFrame progressive statistics count-up
│   │   └── form.js           # AJAX Formspree contact form handler with toast success notifications
│   └── Navneet_Kesarwani_Resume_6.pdf # Direct-download PDF resume asset
├── .perfect_backup/          # Secure frozen-state local backup folder
├── .gitignore
├── index.html                # Semantically structured single-page layout (SEO Optimized)
├── package.json              # Script runners for start and dev environments
└── server.js                 # Zero-dependency local Node server
```

---

## 🚀 Getting Started Locally

### Prerequisites
*   Node.js (v14 or above recommended)

### Setup & Run
1.  **Clone the Repository**:
    ```bash
    git clone https://github.com/Navneet9099/Navneet_Portfolio_Latest.git
    cd Navneet_Portfolio_Latest
    ```

2.  **Start the Local Server**:
    Using `npm` (configured in `package.json`):
    ```bash
    npm run dev
    ```
    Or run with Node directly:
    ```bash
    node server.js
    ```

3.  **Access the Application**:
    Open **[http://localhost:3000](http://localhost:3000)** in your browser.

---

## 🔒 Custom Contact Form Integration
The contact form uses **Formspree** for frictionless, serverless email deliveries. 

To wire up your live contact form:
1.  Sign up at [Formspree](https://formspree.io/) and create a new form.
2.  Open `index.html`.
3.  Locate the contact form line (around line 784):
    ```html
    <form id="contact-form" action="https://formspree.io/f/YOUR_ACTUAL_FORM_ID" method="POST" ...>
    ```
4.  Replace `YOUR_ACTUAL_FORM_ID` with your unique Formspree Form ID.
5.  Save and deploy! The form will automatically switch from local mockup mode to live API submissions with elegant success/error toasts.

---

## 📜 License
This project is licensed under the ISC License. Created by [Navneet Kesarwani](https://github.com/Navneet9099).
