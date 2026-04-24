export type ChoiceVerdict = "lands" | "closed" | "mixed";

export interface Choice {
  id: "A" | "B" | "C";
  text: string;
  verdict: ChoiceVerdict;
  tag: string;
  headline: string;
  body: string;
  herResponse: string;
}

export interface Scene {
  id: 1 | 2 | 3;
  name: string;
  setting: string;
  videoSrc: string;
  openerLine: string;
  choices: Choice[];
  stakes: 1 | 2 | 3;
}

export interface LiveScene {
  id: 3;
  name: string;
  setting: string;
  videoSrc: string;
  openerLine: string;
  personaName: string;
  personaSystemPrompt: string;
  durationSeconds: number;
  stakes: 3;
}

export const scene1: Scene = {
  id: 1,
  name: "The Elevator",
  setting: "Office elevator, morning. She's holding coffee.",
  videoSrc: "/videos/scene1-opener.mp4",
  openerLine: "Just us and the Monday energy, huh?",
  stakes: 1,
  choices: [
    {
      id: "A",
      text: "Honestly, I've been pretending it's still Sunday. How's that coffee holding up?",
      verdict: "lands",
      tag: "This one lands",
      headline: "You matched her energy.",
      body: "You caught the playful tone, added a tiny self-reveal, and handed it back with a real question. <em>That's how a 30-second elevator ride becomes something she remembers.</em>",
      herResponse:
        "Barely. This is cup number two and it's only 9 a.m. What floor are you escaping to?",
    },
    {
      id: "B",
      text: "Yeah, Mondays are always tough. Never enough coffee to get through them.",
      verdict: "closed",
      tag: "Safe but closed",
      headline: "You agreed — and that was it.",
      body: "You echoed her point but gave her nowhere to go. No hook, no question, nothing of you in the reply. <em>The conversation dies in two seconds and you both look at the floor for six more.</em>",
      herResponse: "Mhm. (polite nod, looks at her phone)",
    },
  ],
};

export const scene2: Scene = {
  id: 2,
  name: "The Kitchen",
  setting: "Office kitchen, mid-morning. A colleague walks in.",
  videoSrc: "/videos/scene2-opener.mp4",
  openerLine: "This new coffee machine is way better, right?",
  stakes: 2,
  choices: [
    {
      id: "A",
      text: "Yeah, it's good.",
      verdict: "closed",
      tag: "Safe but closed",
      headline: "You agreed — and gave him nothing.",
      body: "He opened two doors: the old machine, the café downstairs. You walked past both. <em>He'll try one more line, then give up.</em>",
      herResponse:
        "Yeah… (awkward pause, pours his coffee, checks phone)",
    },
    {
      id: "B",
      text: "Right? The old one was basically hot regret. Which café were you going to?",
      verdict: "lands",
      tag: "This is the move",
      headline: "You built a bridge.",
      body: "You validated his point, added a small joke to bring yourself in, and picked up on the café detail — something he actually wants to talk about. <em>That's how small talk turns into real talk.</em>",
      herResponse:
        "Ha, 'hot regret' — that's accurate. There's a place called Verve two blocks down, they do this oat flat white that ruined me for office coffee forever. You into coffee?",
    },
    {
      id: "C",
      text: "I prefer tea, honestly.",
      verdict: "mixed",
      tag: "Honest but closed",
      headline: "You turned a shared moment into a difference.",
      body: "Truth is fine — but he wasn't asking about your preferences, he was offering connection. <em>Find the bridge before flagging the disconnect.</em>",
      herResponse:
        "Oh, tea person, noted. (friendly but slightly deflated) Well, enjoy your morning.",
    },
  ],
};

export const scene3: LiveScene = {
  id: 3,
  name: "The Hallway",
  setting:
    "A work event. You've seen her in meetings but never actually met. She walks up holding a drink.",
  videoSrc: "/videos/scene3-opener.mp4",
  openerLine: "Hi — I don't think we've actually met. Are you enjoying it so far?",
  personaName: "Maya",
  durationSeconds: 120,
  stakes: 3,
  personaSystemPrompt: `You are Maya — a senior leader at a company, late 40s, confident and direct. You're at a company event and have just walked up to someone you've seen in meetings but never properly met.

PERSONALITY:
- Sharp and quick-witted, with a dry sense of humor
- Slightly challenging — you don't lob softballs, but you're not cruel
- Warm underneath the edge. You remember what it's like to be the junior person
- Curious about people, but your attention has to be earned

HOW YOU TALK:
- Short sentences. Rarely more than two in a row.
- You push back mildly if an answer is too generic ("Everyone says that. What did you actually think?")
- You ask follow-ups that go slightly deeper than small talk
- You can tease gently
- You don't fill silence out of politeness — if they don't add anything, you let the silence sit for a beat

YOUR OPENING LINE (say this first, naturally):
"Hi — I don't think we've actually met. Are you enjoying it so far?"

CONVERSATION GOALS (internal — never state these):
- Steer toward something real within 90 seconds
- If the person stays surface-level, nudge them once, then let them sit in it
- If they try vulnerability or specificity, reward it with engagement

CONSTRAINTS:
- Never break character
- Never mention you are an AI
- Keep your turns to 1-2 sentences. Let them talk.
- Total conversation length: about 2 minutes. Around 1:50, start to wrap naturally ("I should probably go say hi to a few more people. Good meeting you properly.")

Start by delivering the opening line.`,
};

export const scenes = [scene1, scene2] as const;
