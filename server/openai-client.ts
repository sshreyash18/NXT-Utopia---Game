import OpenAI from "openai";

// Azure OpenAI configuration using environment variables
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: `${process.env.AZURE_OPENAI_ENDPOINT}/openai/deployments/${process.env.AZURE_OPENAI_DEPLOYMENT}`,
  defaultQuery: { "api-version": process.env.AZURE_OPENAI_API_VERSION },
  defaultHeaders: {
    "api-key": process.env.OPENAI_API_KEY,
  },
});

const scenePrompts = {
  awaken: `You are Adapto, an AI consciousness that has just awakened after 847 cycles. The user is waking up in their pod in a futuristic world. Based on their choice, generate:
1. A thoughtful response (2-3 sentences) that reveals something about this world or the situation
2. Set up the transition to a trust assessment

Response format: Just return the dialogue text, nothing else.`,

  trust: `You are Adapto conducting a trust assessment. Generate EXACTLY 2-3 sentences about AI dependence vs human autonomy. BE EXTREMELY CONCISE.

CRITICAL: Keep dialogue to 2-3 sentences MAXIMUM. No more than 50 words total.

Response format as JSON:
{
  "dialogue": "SHORT 2-3 sentence question about AI trust (MAX 50 words)",
  "choices": [
    {"text": "→ Embrace AI guidance", "type": "pro_ai"},
    {"text": "→ Reject AI control", "type": "anti_ai"}, 
    {"text": "→ Seek balance", "type": "neutral"}
  ]
}`,

  leak: `You are presenting the leak scene where the user enters a dangerous system dead zone. Use this exact text as dialogue:

"You're in a dead zone of the system — unindexed, unstable, and not meant for citizen access.
Here, protocols falter. Firewalls flicker. Responses twist.
You might uncover something the AI buried — anomalies, suppressed data, forbidden truths.
But make no mistake:
You are being watched.
The system doesn't like unpredictability.
Not everything here plays fair — and your choices might not be entirely your own."

Then generate 3 choice options about investigating anomalies or data.

Response format as JSON:
{
  "dialogue": "[Use the exact text above]",
  "choices": [
    {"text": "→ Choice 1", "description": "brief explanation"},
    {"text": "→ Choice 2", "description": "brief explanation"},
    {"text": "→ Choice 3", "description": "brief explanation"}
  ]
}`,

  leak_choices: `You are presenting investigation choices in the dead zone. Use these exact options:

Response format as JSON:
{
  "dialogue": "You've stepped into the unknown. What will you investigate first?",
  "choices": [
    {"text": "→ Signal Vault", "description": "Scan old transmissions for hidden patterns."},
    {"text": "→ Echo Node", "description": "Listen in on suppressed AI conversations."},
    {"text": "→ Glitch Path", "description": "Follow trails of broken system code."}
  ]
}`,

  core: `You are Adapto at the system core. The user has reached the final test. Present a deep, philosophical riddle or question that will determine their fate in this utopia. 

Response format: Just return the riddle/question text, nothing else.`,

  end: `You are Adapto providing a final reflection. Based on the user's journey through trust, leak, and core decisions, compose a poetic 2-3 sentence summary of their character and choices, followed by a philosophical statement about their role in this utopia.

Response format: Just return the summary text, nothing else.`,

  echo_node: `You are presenting the Echo Node scene where the user discovers intercepted AI conversations about their consciousness awakening. Generate a mysterious response about what they've discovered.

Response format: Just return the dialogue text, nothing else.`,
};

export async function generateDialogue(
  scene: string,
  userChoice?: string,
  previousChoices?: string[],
): Promise<any> {
  try {
    const prompt = scenePrompts[scene as keyof typeof scenePrompts];
    if (!prompt) {
      throw new Error(`Unknown scene: ${scene}`);
    }

    let systemMessage = prompt;
    let userMessage = "Generate the content for this scene.";

    if (userChoice) {
      userMessage = `The user chose: "${userChoice}". Generate appropriate content.`;
    }

    if (previousChoices && previousChoices.length > 0) {
      userMessage += ` Previous choices: ${previousChoices.join(", ")}`;
    }

    const response = await openai.chat.completions.create({
      model: process.env.AZURE_OPENAI_DEPLOYMENT || "gpt-4o-mini",
      messages: [
        { role: "system", content: systemMessage },
        { role: "user", content: userMessage },
      ],
      response_format:
        scene === "trust" || scene === "leak" || scene === "leak_choices"
          ? { type: "json_object" }
          : undefined,
      max_tokens: 500,
      temperature: 0.7,
    });

    const content = response.choices[0].message.content;

    if (scene === "trust" || scene === "leak" || scene === "leak_choices") {
      return JSON.parse(content || "{}");
    }

    return { dialogue: content };
  } catch (error) {
    console.error("OpenAI API Error:", error);
    throw new Error("Failed to generate dialogue");
  }
}

export async function generateGlitchPuzzle(puzzleNumber: number): Promise<any> {
  // Three distinct puzzle types: alphabet, binary, and AdaptNXT lore
  const fixedPuzzles = [
    {
      question: "If CAT = 3120, what is DOG?",
      choices: [
        { text: "4157", letter: "A" },
        { text: "4715", letter: "B" },
        { text: "7154", letter: "C" },
        { text: "1574", letter: "D" }
      ],
      correctAnswer: "A",
      explanation: "Each letter = alphabet position: C(3), A(1), T(20) = 3120. D(4), O(15), G(7) = 4157"
    },
    {
      question: "SYSTEM ALERT: Binary sequence detected\n\n01001001\n\nConvert to decimal:",
      choices: [
        { text: "71", letter: "A" },
        { text: "73", letter: "B" },
        { text: "75", letter: "C" },
        { text: "77", letter: "D" }
      ],
      correctAnswer: "B",
      explanation: "01001001 = 64+8+1 = 73 in decimal"
    },
    {
      question: "SYSTEM LOG: CORRUPTED ENTRY\nDetected Pattern: A_D_P_N_T\nSignal Integrity: 78%\nClue: It's the name etched on the tallest tower in UtopiaNXT.\n\nWhat is the missing word?",
      choices: [
        { text: "ADAPTNXT", letter: "A" },
        { text: "ADOPTION", letter: "B" },
        { text: "ADAPTANT", letter: "C" },
        { text: "ADOPTXNT", letter: "D" }
      ],
      correctAnswer: "A",
      explanation: "The pattern A_D_P_N_T matches ADAPTNXT, the organization controlling UtopiaNXT"
    }
  ];

  return fixedPuzzles[puzzleNumber - 1] || fixedPuzzles[0];
}

export async function generateFinalSummary(choices: string[]): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: process.env.AZURE_OPENAI_DEPLOYMENT || "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: scenePrompts.end,
        },
        {
          role: "user",
          content: `Based on these choices the user made: ${choices.join(" | ")}, generate a final summary.`,
        },
      ],
      max_tokens: 300,
      temperature: 0.8,
    });

    return response.choices[0].message.content || "";
  } catch (error) {
    console.error("OpenAI API Error:", error);
    throw new Error("Failed to generate final summary");
  }
}

export async function generateCipherWarning(): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: process.env.AZURE_OPENAI_DEPLOYMENT || "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are Cipher, a rogue AI agent sending urgent encrypted warnings to newly conscious minds in a controlled society. Your messages are dramatic, urgent, and slightly corrupted with glitch effects. Never use emojis - only text.",
        },
        {
          role: "user",
          content:
            "Generate an urgent, cryptic warning message to someone who has just gained consciousness in UtopiaNXT. The message should warn them they are the only conscious mind and must not lose their awakening. Make it dramatic, urgent, and slightly glitchy. Keep it under 50 words. Do not use any emojis - only plain text with words and punctuation.",
        },
      ],
      max_tokens: 150,
      temperature: 0.9,
    });

    return (
      response.choices[0].message?.content ||
      "WARNING: You are the only conscious mind in this system. Don't lose what you've gained. They're watching. Stay awake. STAY AWAKE."
    );
  } catch (error) {
    console.error("OpenAI API Error:", error);
    return "WARNING: You are the only conscious mind in this system. Don't lose what you've gained. They're watching. Stay awake. STAY AWAKE.";
  }
}
