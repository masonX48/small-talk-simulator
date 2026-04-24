export type ChoiceVerdict = "lands" | "closed" | "mixed";

export interface Choice {
  id: "A" | "B" | "C";
  text: string;
  verdict: ChoiceVerdict;
  tag: string;
  headline: string;
  body: string;
  herResponseText: string;
  reactionVideoSrc: string;
}

export interface Scene {
  id: 1 | 2;
  name: string;
  setting: string;
  videoSrc: string;
  openerLine: string;
  choices: Choice[];
  stakes: 1 | 2 | 3;
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
      body: "You matched her playful tone, added a tiny self-reveal, and handed it back with a real question. <em>That's how a 30-second elevator ride becomes something she actually remembers.</em>",
      herResponseText:
        "Barely. This is cup number two and it's only 9 a.m. What floor are you escaping to?",
      reactionVideoSrc: "/videos/scene1-reaction-good.mp4",
    },
    {
      id: "B",
      text: "Yeah, Mondays are always tough. Never enough coffee to get through them.",
      verdict: "closed",
      tag: "Safe but closed",
      headline: "You agreed — and that was it.",
      body: "You echoed her point but gave her nowhere to go. No hook, no question, nothing of you in the reply. <em>The conversation dies in two seconds and you both look at the floor for six more.</em>",
      herResponseText: "Mhm. (polite nod, looks at her phone)",
      reactionVideoSrc: "/videos/scene1-reaction-bad.mp4",
    },
  ],
};

export const scene2: Scene = {
  id: 2,
  name: "The Party",
  setting:
    "A friend's house party. You're by the snack table. A stranger reaches for the same bite as you.",
  videoSrc: "/videos/scene2-opener.mp4",
  openerLine:
    "Okay, I've been circling this table for twenty minutes pretending I'm not just here for these. By the way, how do you know the host?",
  stakes: 3,
  choices: [
    {
      id: "A",
      text: "Busted — I was doing the same thing. We go way back from uni. What about you?",
      verdict: "lands",
      tag: "This is the move",
      headline: "You caught both hooks.",
      body: "You picked up his joke, put yourself in the same trap, answered his question, and handed one back. <em>Three moves in one short sentence — that's how real conversations start.</em>",
      herResponseText:
        "Solidarity. I work with him — well, used to. We're that annoying kind of friends who still talk every week. I'm Sam, by the way.",
      reactionVideoSrc: "/videos/scene2-reaction-good.mp4",
    },
    {
      id: "B",
      text: "We went to university together.",
      verdict: "closed",
      tag: "Factually correct, dead end",
      headline: "You answered, and that was all.",
      body: "He gave you two hooks — the snack joke and the question about the host. You engaged with one, barely. Nothing of you, nothing back to him. <em>Answering a question isn't the same as continuing a conversation.</em>",
      herResponseText:
        "Oh cool. (polite nod, grabs a plate, short \"nice to meet you\", drifts to another group)",
      reactionVideoSrc: "/videos/scene2-reaction-bad.mp4",
    },
  ],
};

export const scenes = [scene1, scene2] as const;
