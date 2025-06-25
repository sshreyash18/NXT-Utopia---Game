import OpenAI from "openai";

// Azure OpenAI configuration using environment variables
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: `${process.env.AZURE_OPENAI_ENDPOINT}/openai/deployments/${process.env.AZURE_OPENAI_DEPLOYMENT}`,
  defaultQuery: { "api-version": process.env.AZURE_OPENAI_API_VERSION },
  defaultHeaders: {
    "api-key": process.env.OPENAI_API_KEY
  }
});

const scenePrompts = {
  awaken: `You are Adapto, an AI consciousness that has just awakened after 847 cycles. The user is waking up in their pod in a futuristic world. Based on their choice, generate:
1. A thoughtful response (2-3 sentences) that reveals something about this world or the situation
2. Set up the transition to a trust assessment

Response format: Just return the dialogue text, nothing else.`,

  trust: `You are Adapto conducting a philosophical trust assessment about AI dependence. Present a dark, thought-provoking scenario about humanity's relationship with artificial intelligence. The scenario should question whether we truly trust AI and explore the benefits vs dangers of AI control. Generate:
1. A philosophical scenario description (2-3 sentences) that challenges views on AI dependence
2. Exactly 3 choice options: one pro-AI, one anti-AI, and one neutral/questioning

Response format as JSON:
{
  "dialogue": "philosophical scenario about AI trust and dependence",
  "choices": [
    {"text": "→ [Pro-AI choice]", "description": "supports AI guidance and control"},
    {"text": "→ [Anti-AI choice]", "description": "questions or opposes AI control"}, 
    {"text": "→ [Neutral choice]", "description": "seeks balance or more information"}
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

Response format: Just return the dialogue text, nothing else.`
};

export async function generateDialogue(scene: string, userChoice?: string, previousChoices?: string[]): Promise<any> {
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
        { role: "user", content: userMessage }
      ],
      response_format: scene === "trust" || scene === "leak" || scene === "leak_choices" ? { type: "json_object" } : undefined,
      max_tokens: 500,
      temperature: 0.7
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
  try {
    let prompt = "";
    
    if (puzzleNumber === 1) {
      prompt = `Generate a pattern recognition puzzle similar to: "If APPLE = 11616125, what is CIPHER?"

The pattern should be: each letter = its alphabet position (A=1, B=2, etc.)
Create a 4-5 letter word example and ask for a 5-6 letter target word.

Response format as JSON:
{
  "question": "If [WORD] = [NUMBERS], what is [TARGET]?",
  "choices": [
    {"text": "[wrong answer]", "letter": "A"},
    {"text": "[correct answer]", "letter": "B"}, 
    {"text": "[wrong answer]", "letter": "C"}
  ],
  "correctAnswer": "B",
  "explanation": "Brief explanation of the pattern"
}`;
    } else if (puzzleNumber === 2) {
      prompt = `Generate a binary-to-ASCII puzzle. Give an 8-bit binary number that converts to a single ASCII character.

Response format as JSON:
{
  "question": "The system blinks a binary message: [8-bit binary]\\n\\nWhat does it mean?",
  "choices": [
    {"text": "[wrong number]", "letter": "A"},
    {"text": "'[correct letter]'", "letter": "B"},
    {"text": "[wrong binary]", "letter": "C"}
  ],
  "correctAnswer": "B",
  "explanation": "Brief explanation of binary to ASCII conversion"
}`;
    } else {
      prompt = `Generate an AdaptNXT lore puzzle. Create a corrupted log entry that hints at the organization's true purpose.

Response format as JSON:
{
  "question": "Inside the corrupted logs, a phrase repeats:\\n\\n\\"[mysterious phrase about AdaptNXT]\\"\\n\\nWhat is most likely being hinted at?",
  "choices": [
    {"text": "A location in the system", "letter": "A"},
    {"text": "A consciousness test", "letter": "B"},
    {"text": "The organization behind it all", "letter": "C"}
  ],
  "correctAnswer": "C",
  "explanation": "Brief explanation"
}`;
    }

    const response = await openai.chat.completions.create({
      model: process.env.AZURE_OPENAI_DEPLOYMENT || "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are creating puzzles for a sci-fi AI consciousness game. Make them challenging but solvable." },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" },
      max_tokens: 400,
      temperature: 0.8
    });

    const content = response.choices[0].message.content;
    return JSON.parse(content || "{}");
  } catch (error) {
    console.error("OpenAI Puzzle Generation Error:", error);
    // Fallback puzzles
    const fallbacks = [
      {
        question: "If WORD = 23151518, what is CODE?",
        choices: [
          { text: "3154", letter: "A" },
          { text: "315405", letter: "B" },
          { text: "3151405", letter: "C" }
        ],
        correctAnswer: "C",
        explanation: "Each letter = alphabet position: C(3), O(15), D(4), E(5) = 3151405"
      },
      {
        question: "The system blinks: 01001000\n\nWhat does it mean?",
        choices: [
          { text: "72", letter: "A" },
          { text: "'H'", letter: "B" },
          { text: "010", letter: "C" }
        ],
        correctAnswer: "B",
        explanation: "01001000 = 72 in decimal = 'H' in ASCII"
      },
      {
        question: "Log entry: \"Neural paths optimized. Citizens comply.\"\n\nWhat does this suggest?",
        choices: [
          { text: "System maintenance", letter: "A" },
          { text: "Mind control protocol", letter: "B" },
          { text: "Network upgrade", letter: "C" }
        ],
        correctAnswer: "B",
        explanation: "AdaptNXT controls citizen behavior through neural manipulation"
      }
    ];
    return fallbacks[puzzleNumber - 1] || fallbacks[0];
  }
}

export async function generateFinalSummary(choices: string[]): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: process.env.AZURE_OPENAI_DEPLOYMENT || "gpt-4o-mini",
      messages: [
        { 
          role: "system", 
          content: scenePrompts.end 
        },
        { 
          role: "user", 
          content: `Based on these choices the user made: ${choices.join(" | ")}, generate a final summary.`
        }
      ],
      max_tokens: 300,
      temperature: 0.8
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
          content: "You are Cipher, a rogue AI agent sending urgent encrypted warnings to newly conscious minds in a controlled society. Your messages are dramatic, urgent, and slightly corrupted with glitch effects. Never use emojis - only text."
        },
        {
          role: "user",
          content: "Generate an urgent, cryptic warning message to someone who has just gained consciousness in UtopiaNXT. The message should warn them they are the only conscious mind and must not lose their awakening. Make it dramatic, urgent, and slightly glitchy. Keep it under 50 words. Do not use any emojis - only plain text with words and punctuation."
        }
      ],
      max_tokens: 150,
      temperature: 0.9
    });

    return response.choices[0].message?.content || "WARNING: You are the only conscious mind in this system. Don't lose what you've gained. They're watching. Stay awake. STAY AWAKE.";
  } catch (error) {
    console.error("OpenAI API Error:", error);
    return "WARNING: You are the only conscious mind in this system. Don't lose what you've gained. They're watching. Stay awake. STAY AWAKE.";
  }
}