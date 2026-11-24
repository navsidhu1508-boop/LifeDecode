# LifeDecode 🔍

> **"Understand complicated things. Make smarter decisions."**

LifeDecode is a modern, responsive, AI-powered web application that turns complicated information — including legal contracts, medical lab panels, insurance policies, and financial loan agreements — into simple, crystal-clear plain language that anyone can understand.

---

## 🌟 Key Features

- **Triple Input System**:
  - **Paste Text**: Enter or paste any clause, contract, or diagnostic report.
  - **Upload PDF**: Native multimodal parsing of full PDF documents.
  - **Upload Image**: Drag-and-drop screenshots or smartphone photos (PNG, JPG, JPEG, WebP) with OCR extraction.
- **Multilingual Support**:
  - English
  - Hindi (हिन्दी)
  - Punjabi (ਪੰਜਾਬੀ)
- **Explanation Depth Styles**:
  - **Very Simple**: Friendly conversational analogies, zero jargon.
  - **Detailed**: Thorough clause-by-clause breakdown preserving every number, rate, and date.
  - **Step-by-Step**: Actionable chronological timeline of events and outcomes.
- **Five-Part Structured Analysis**:
  1. **Simple Explanation**: High-level core understanding.
  2. **Important Points**: Bulleted takeaways.
  3. **Difficult Words Glossary**: Terminology explained in plain words.
  4. **What You Should Know**: Hidden penalties, risks, deadlines, and caveats.
  5. **Suggested Next Steps**: Practical actions to take.
- **Interactive Follow-up Q&A**: Ask specific questions directly about the decoded document.
- **Export to PDF**: One-click download of a formatted PDF report.
- **Zero Document Retention**: Transient in-memory processing with no permanent storage or tracking.

---

## 🛠️ Technology Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Lucide React
- **Backend / Serverless**: Node.js Serverless API Functions (`api/decode.js`, `api/chat.js`, `api/contact.js`, `api/config-check.js`)
- **AI Processing**: Google Gemini API (`@google/generative-ai` with multimodal vision & document support)
- **PDF Generation**: `jspdf`
- **Deployment**: Vercel & GitHub compatible

---

## 🚀 Getting Started Locally

### 1. Prerequisites
- **Node.js** (v18 or newer)
- **npm** (v9 or newer)

### 2. Install Dependencies
In the project root folder, run:
```bash
npm install
```

### 3. Configure Your Gemini API Key
1. Get a free Google Gemini API key from **[Google AI Studio](https://aistudio.google.com/app/apikey)**.
2. In the project root, create a file named `.env`:
```bash
cp .env.example .env
```
3. Open `.env` and insert your API key:
```env
GEMINI_API_KEY=your_actual_gemini_api_key_here
```
*(Note: Never commit `.env` to Git. The `.gitignore` file already excludes `.env`.)*

### 4. Run the Development Server
```bash
npm run dev
```
Open your browser and navigate to:
```
http://localhost:3000
```
The local Vite development server automatically handles both the React frontend and the `/api/*` serverless functions.

### 5. Build for Production
To verify that the production build bundles cleanly:
```bash
npm run build
```

---

## 🌐 Deploying to a Permanent Public Internet URL (GitHub + Vercel)

Follow these exact steps to make LifeDecode accessible from your phone, laptop, and anyone else's device across the world with a permanent public URL (e.g., `https://lifedecode.vercel.app`):

### Step 1: Upload the Project to GitHub

1. If you haven't already initialized Git in the folder:
   ```bash
   git init
   git add .
   git commit -m "Initial commit of LifeDecode platform"
   ```
2. Go to **[GitHub.com](https://github.com)** and sign in.
3. Click the **+** (plus icon) in the top right and select **New repository**.
4. Name the repository (e.g. `lifedecode`), choose **Public** or **Private**, and click **Create repository**.
5. Link your local project to GitHub and push:
   ```bash
   git remote add origin https://github.com/<YOUR-GITHUB-USERNAME>/lifedecode.git
   git branch -M main
   git push -u origin main
   ```

### Step 2: Connect GitHub to Vercel

1. Go to **[Vercel.com](https://vercel.com)** and sign up or log in (you can sign in directly using your GitHub account).
2. On your Vercel Dashboard, click **Add New...** → **Project**.
3. Under **Import Git Repository**, find your `lifedecode` repository and click **Import**.

### Step 3: Configure Project on Vercel

In the Vercel project configuration screen:
1. **Framework Preset**: Select **Vite** (Vercel will detect it automatically).
2. **Root Directory**: `./` (leave default).
3. **Build Command**: `vite build` (leave default).
4. **Output Directory**: `dist` (leave default).
5. **Environment Variables** *(Crucial)*:
   - Click the **Environment Variables** accordion.
   - **Key**: `GEMINI_API_KEY`
   - **Value**: Paste your Google Gemini API key (from Google AI Studio).
   - Click **Add**.

### Step 4: Deploy

1. Click the **Deploy** button.
2. Vercel will install dependencies, compile the Vite React application, deploy the serverless functions in `/api`, and provision global CDN edge caching.
3. When the build finishes (usually 30–60 seconds), you will see confetti and a screenshot preview.

### Step 5: Obtain & Use Your Permanent Public URL

1. Vercel provides a permanent public URL, such as:
   ```
   https://lifedecode.vercel.app
   ```
   (or `https://lifedecode-<your-username>.vercel.app`).
2. You can immediately open this URL on:
   - Your laptop
   - Your smartphone
   - Send it to friends, family, or colleagues anywhere in the world.
3. **Internal Routing Support**: Direct links to internal routes (e.g. `https://your-url.vercel.app/decode`, `https://your-url.vercel.app/about`, `https://your-url.vercel.app/privacy`) will work seamlessly when refreshed, thanks to the pre-configured `vercel.json` rewrites.
4. **Custom Domain (Optional)**: If you purchase a domain name like `lifedecode.com`, you can attach it under Vercel **Settings → Domains** for free with automatic SSL certificates.

---

## 🔄 Redeploying Future Changes

Whenever you update your code in the future:
1. Make your changes and test locally (`npm run dev`).
2. Commit and push to GitHub:
   ```bash
   git add .
   git commit -m "Update feature or styling"
   git push origin main
   ```
3. Vercel automatically detects the push and triggers a zero-downtime deployment. Your public URL updates within seconds!

---

## 🔒 Security & Privacy Practices

- **Never Expose Secrets**: API keys are strictly kept on the server side in environment variables (`process.env.GEMINI_API_KEY`).
- **No LocalStorage Leaks**: Uploaded documents and decoded summaries are kept solely in React component state during the active session.
- **Disclaimers**: Contextual legal, financial, and medical disclaimers remind users that LifeDecode is an educational clarity tool and not a substitute for licensed professionals.

---

## 📄 License

MIT License. Designed with the potential to grow into a commercial plain-language clarity startup.
