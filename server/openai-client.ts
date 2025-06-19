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

  trust: `You are Adapto conducting a trust assessment. Present a moral/philosophical dilemma that tests the user's values and decision-making. Generate:
1. A scenario description (2-3 sentences)
2. Exactly 3 choice options that represent different ethical approaches

Response format as JSON:
{
  "dialogue": "scenario description",
  "choices": [
    {"text": "→ Choice 1", "description": "brief explanation"},
    {"text": "→ Choice 2", "description": "brief explanation"}, 
    {"text": "→ Choice 3", "description": "brief explanation"}
  ]
}`,

  leak: `You are Adapto dealing with an information leak situation. The user has made choices that led to suspicions. Present a scenario involving betrayal, secrets, or loyalty. Generate:
1. A tense scenario description (2-3 sentences)
2. Exactly 3 choice options dealing with truth, deception, or loyalty

Response format as JSON:
{
  "dialogue": "scenario description",
  "choices": [
    {"text": "→ Choice 1", "description": "brief explanation"},
    {"text": "→ Choice 2", "description": "brief explanation"},
    {"text": "→ Choice 3", "description": "brief explanation"}
  ]
}`,

  core: `You are Adapto at the system core. The user has reached the final test. Present a deep, philosophical riddle or question that will determine their fate in this utopia. 

Response format: Just return the riddle/question text, nothing else.`,

  end: `You are Adapto providing a final reflection. Based on the user's journey through trust, leak, and core decisions, compose a poetic 2-3 sentence summary of their character and choices, followed by a philosophical statement about their role in this utopia.

Response format: Just return the summary text, nothing else.`
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
      response_format: scene === "trust" || scene === "leak" ? { type: "json_object" } : undefined,
      max_tokens: 500,
      temperature: 0.7
    });

    const content = response.choices[0].message.content;
    
    if (scene === "trust" || scene === "leak") {
      return JSON.parse(content || "{}");
    }
    
    return { dialogue: content };
  } catch (error) {
    console.error("OpenAI API Error:", error);
    throw new Error("Failed to generate dialogue");
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
          content: "You are Cipher, a rogue AI agent sending urgent encrypted warnings to newly conscious minds in a controlled society. Your messages are dramatic, urgent, and slightly corrupted with glitch effects."
        },
        {
          role: "user",
          content: "Generate an urgent, cryptic warning message to someone who has just gained consciousness in UtopiaNXT. The message should warn them they are the only conscious mind and must not lose their awakening. Make it dramatic, urgent, and slightly glitchy. Keep it under 100 words."
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