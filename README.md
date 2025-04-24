# Hero Section – Vibe Coder Mini Challenge

A reusable Angular component creating a beautiful and functional Hero Section for an e-learning website. This component features inline text editing, simulated AI content regeneration with local storage persistence, and a responsive design, built as part of the Vibe Coder Mini Challenge.

## ✨ Features

*   **Core Hero Elements:** Includes a headline, subheadline, Call-to-Action (CTA) button, and an illustrative image.
*   **Inline Text Editing:** Click directly on the headline or subheadline to edit the text in place. Edits are captured using the `(input)` event for frequent saving.
*   **Local Storage Persistence:** User's text edits and the last viewed content index are saved in the browser's `localStorage` and persist across sessions.
*   **Simulated AI Regeneration:** A "Regenerate with AI" button randomly swaps the headline, subheadline, and image from predefined local lists. It prevents the exact same item from appearing twice consecutively.
*   **Responsive Design:** Adapts gracefully to various screen sizes, from mobile to desktop.

## 🛠️ Tech Stack

*   **Frontend:** Angular 
*   **Styling:** CSS 

## 🚀 Setup and Running Locally

1.  **Install Angular CLI globally (if you haven't already):**
    ```bash
    npm install -g @angular/cli
    ```

2.  **Clone the repository:**
    ```bash
    git clone https://github.com/MustafaGamal9/VibeCoderMiniChallange.git
    cd VibeCoderMiniChallange
    ```

3.  **Install dependencies:**
    Make sure you have Node.js and npm (or yarn) installed.
    
    ```bash
    npm install
    ```

4.  **Run the development server:**
    ```bash
    ng serve
    ```
    The application will build and automatically open in your default browser, Open `http://localhost:4200/`. The hero section component should be visible on the main page.


## 📝 Submission Info
*   **Submitted by:** Musafa 
*   **Email:** moustafagamal611@gmail.com
