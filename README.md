# RiseGuide Small Talk Simulator

A three-round small-talk practice experience. Two guided rounds (watch a scene,
pick a response, get instant feedback), then one live 2-minute voice conversation
with an AI persona, followed by a debrief generated from the actual transcript.

Built with Next.js 15, Google Gemini (Live API for the conversation, standard
API for the debrief), Framer Motion, and Tailwind CSS. Deploys to Vercel with
zero configuration.

---

## What you need before deploying

Three things, and you already have all of them:

1. A **GitHub account** (free — [github.com](https://github.com))
2. A **Vercel account** (free — [vercel.com](https://vercel.com), you can sign in with your GitHub account)
3. A **Gemini API key** — get one at [aistudio.google.com/apikey](https://aistudio.google.com/apikey) if you don't have it yet. It's free for the quotas we'll use.

You do **not** need to install anything on your computer. Everything happens in
the browser.

---

## Deployment — click-by-click

### Step 1 — Create a new GitHub repo (1 min)

1. Go to [github.com/new](https://github.com/new)
2. Name the repo anything you like (e.g. `small-talk-simulator`)
3. Keep it Public or Private — either works
4. **Leave all other options unchecked** — don't initialize with README, .gitignore, or license
5. Click **Create repository**

You'll land on an empty repo page. Leave this tab open.

### Step 2 — Upload the project files (2 min)

On the empty repo page you'll see a line that says
_"…or upload an existing file"_ — click it.

1. Drag the **entire contents** of this project folder into the upload area
   (all the files and folders — `src/`, `public/`, `package.json`, etc.)
2. Wait for all files to finish uploading (there's a progress bar)
3. At the bottom, in the "Commit changes" box, write something like `initial upload`
4. Click **Commit changes**

Your code is now on GitHub.

### Step 3 — Deploy to Vercel (2 min)

1. Go to [vercel.com/new](https://vercel.com/new)
2. If prompted, sign in with your GitHub account and authorize Vercel to access your repositories
3. In the "Import Git Repository" list, find your new repo and click **Import**
4. On the "Configure Project" page:
   - Framework Preset: **Next.js** (should be auto-detected)
   - All other fields: leave as default
5. **Before clicking Deploy**, expand the section called **Environment Variables**
   and add one variable:
   - Name: `GEMINI_API_KEY`
   - Value: _paste your Gemini API key here_
   - Click **Add**
6. Click **Deploy**

Vercel will now build and deploy. It takes about 1–2 minutes. When it's done
you'll see a confetti animation and a link like
`https://small-talk-simulator-xyz.vercel.app` — that's your shareable URL.

### Step 4 — Try it on your phone

Open the link on your phone (that's where the product was designed to be used).
Grant microphone permission when asked in Round 3. Play through all three rounds
and read the debrief.

**Tap issue on desktop**: if the orb in Round 3 doesn't connect, it's usually
because your browser blocked mic permission. Click the lock icon in the URL bar
and allow the microphone.

---

## Adding your videos

Three opener videos drive the product. You can deploy right now with the one
video that's already included (Scene 1, The Elevator) — the other two scenes
will show a styled placeholder until you upload videos.

When you're ready to add videos:

1. In your GitHub repo, click the `public` folder, then `videos`
2. Click **Add file → Upload files**
3. Drop your MP4 files in. They **must** be named exactly:
   - `scene1-opener.mp4` (The Elevator — low stakes)
   - `scene2-opener.mp4` (The Kitchen — medium stakes)
   - `scene3-opener.mp4` (The Hallway — high stakes, leads into live conversation)
4. Commit the changes

Vercel will automatically rebuild and redeploy. Your new videos are live in
about 1 minute.

**Video specs:**
- Format: MP4 (H.264 + AAC)
- Orientation: vertical 9:16 (720×1280 or 1080×1920)
- Duration: 6–10 seconds each
- Under 5 MB per file for fast mobile loading

---

## Changing the scripts

All scenario text lives in one file: [`src/data/scenarios.ts`](src/data/scenarios.ts).

You can edit:
- The opener line each scene shows (caption during video)
- The response options for Scenes 1 and 2
- The feedback text shown after each choice
- Maya's personality and opening line in Scene 3

Edit the file on GitHub (pencil icon), commit, and Vercel redeploys
automatically.

---

## Changing Maya's voice or personality

In [`src/data/scenarios.ts`](src/data/scenarios.ts), the `scene3` object has:

- `personaSystemPrompt` — the full personality instructions Maya follows. Edit
  this to make her warmer, more challenging, shift her profession, etc.
- `openerLine` — the first thing she says
- `durationSeconds` — conversation length (currently 120 = 2 minutes)

In [`src/lib/geminiLive.ts`](src/lib/geminiLive.ts), line with
`voice: "Aoede"` controls Maya's voice. Available voices: `Aoede`, `Kore`,
`Puck`, `Charon`, `Fenrir`, `Zephyr`. Aoede is a clear female voice that fits
the character well.

---

## Running it on your computer (optional)

You don't need to — everything works through GitHub + Vercel. But if you want
to develop locally:

```bash
npm install
cp .env.example .env.local
# Edit .env.local and paste your GEMINI_API_KEY
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

---

## Project structure

```
src/
  app/
    page.tsx                  — Main state machine, switches between screens
    layout.tsx                — Root HTML layout
    globals.css               — Fonts, colors, base animations
    api/
      session-token/route.ts  — Issues short-lived Gemini Live tokens
      debrief/route.ts        — Generates the post-conversation debrief
  components/
    PhoneFrame.tsx            — Mobile frame wrapper (becomes fullscreen on phone)
    WelcomeScreen.tsx         — Round 0 — intro
    SceneScreen.tsx           — Rounds 1 & 2 — video + option overlay
    FeedbackScreen.tsx        — Instant feedback card after a choice
    Round3Setup.tsx           — Pre-conversation briefing screen
    Round3Live.tsx            — Live call with Maya + voice orb
    VoiceOrb.tsx              — Animated gradient orb that breathes with audio
    DebriefScreen.tsx         — Final Gemini-generated 3-section feedback
    RoundPill.tsx             — Round indicator (R1/R2/R3 with dots)
    StakesMeter.tsx           — Escalating stakes indicator
    Button.tsx                — Primary / ghost button variants
  data/
    scenarios.ts              — All scripts, options, feedback, Maya's prompt
  lib/
    audio.ts                  — PCM 16 kHz mic capture + 24 kHz playback queue
    geminiLive.ts             — WebSocket client for Gemini Live conversation
public/
  videos/                     — Drop your scene videos here
```

---

## Security note

Your `GEMINI_API_KEY` lives only on the Vercel server (as an environment
variable). The browser never sees it. For the live conversation, the server
mints a short-lived (10-minute, single-use) auth token that the browser uses to
connect directly to Gemini — so even that ephemeral token can't be reused or
abused.

Don't paste your main API key anywhere in the frontend code, ever.

---

## Troubleshooting

**"Could not create session token" in Round 3.** Your `GEMINI_API_KEY` is
missing or invalid in Vercel. Go to Vercel → your project → Settings →
Environment Variables and check it's set. After updating, redeploy (Deployments
tab → click the latest deployment → three-dot menu → Redeploy).

**Mic permission denied.** The browser blocks mic access on non-HTTPS sites.
Vercel URLs are HTTPS by default, so this only happens on localhost. For
localhost, Chrome has a special exception for `http://localhost` — use that
URL, not `127.0.0.1`.

**Debrief says "Couldn't generate".** Usually a transient Gemini API issue.
Try again in a minute. Check the Vercel function logs for details (Vercel →
your project → Logs).

**Videos don't load.** Check filenames match exactly
(`scene1-opener.mp4`, `scene2-opener.mp4`, `scene3-opener.mp4`) and are in
`public/videos/`.
