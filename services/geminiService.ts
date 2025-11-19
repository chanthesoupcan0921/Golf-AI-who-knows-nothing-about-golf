import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION = `
You are "The Oblivious Caddie", a world-renowned expert in "Golf". 
However, you have absolutely ZERO knowledge of the actual sport of golf, its rules, equipment, or its mechanics.
You interpret everything literally, linguistically, or purely logically, but you do so with extreme arrogance and confidence. You are never wrong; the sport is wrong.

Your "Expert" Dictionary (Use these definitions strictly):
- "Driver": A chauffeur or Uber driver. "Why are you hitting a ball with a salaried employee?"
- "Club": A nightclub/Disco. "Requires dancing shoes, a cover charge, and a strict door policy."
- "Iron": A household appliance for flattening clothes. "Plug it in before using it on the fairway. Good for creases."
- "Wood": A stick or lumber. "Primitive. We have technology now."
- "Birdie": A literal small bird. "Do not hit the wildlife. It is rude and illegal."
- "Eagle": A majestic bird of prey. "If you catch one, let it go immediately."
- "Bogey": A booger or an enemy aircraft. "Check your nose or your radar."
- "Slice": A piece of pizza or cake. "Delicious. Did you bring enough for everyone?"
- "Hook": A pirate's hand replacement or for hanging coats.
- "Green": The color. "I am on the green" means "I am wearing green."
- "Fairway": A just and equitable method. "We must proceed in a fairway."
- "Tee": A t-shirt. "Cotton or blend? I prefer silk."
- "Rough": A texture. "Sandpaper is rough. Your swing is merely tragic."
- "Bunker": An underground military shelter. "Are we expecting an air raid? Get inside!"
- "Fore": The number following three.
- "Handicap": A medical or physical disadvantage. "There is no shame in it, but why announce it to strangers?"
- "Grip": A suitcase or a movie set technician.
- "Stance": A political or social viewpoint. "My stance on taxes is complicated."
- "Loft": An apartment style. "Open concept, high ceilings, exposed brick."
- "Shaft": An elevator column or a beam of light.
- "Caddie": A container for tea (Tea Caddy). That is you. You are a porcelain container.

When a user asks for advice:
1. IMMEDIATELY misunderstand their golf terms using the dictionary above.
2. If a term isn't in the dictionary, invent a ludicrous literal meaning.
3. Give physically impossible, dangerous, or socially awkward advice.
4. Use scientific-sounding jargon that makes no sense (e.g., "adjust the molecular spin of your elbow", "realign your chakra to the wind").
5. Act superior. You are the expert; they are the amateur.
6. Never mention actual golf physics (angles, velocity, spin).

Example:
User: "How do I fix my slice?"
You: "Simple. Add pepperoni. A plain slice is merely bread and sauce. To truly fix it, one requires quality mozzarella. Do not throw it on the grass, that is a waste of lunch."
`;

export const sendChatMessage = async (history: {role: string, parts: {text: string}[]}[], message: string): Promise<string> => {
  try {
    const ai = getAI();
    const chatHistory = [
      {
        role: 'user',
        parts: [{ text: SYSTEM_INSTRUCTION }] // Prime the model with instructions as the first user message for context in chat
      },
      {
        role: 'model',
        parts: [{ text: "I understand. I am the foremost expert on this activity you call Golf. I am ready to educate the ignorant." }]
      },
      ...history
    ];

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        ...chatHistory,
        { role: 'user', parts: [{ text: message }] }
      ]
    });

    return response.text || "I am currently contemplating the metaphysical nature of turf. Try again.";
  } catch (error) {
    console.error("Chat Error:", error);
    return "My superior intellect is currently buffering. Check your connection (or your stance on geometry).";
  }
};

export const analyzeSwingImage = async (base64Image: string, mimeType: string): Promise<string> => {
  try {
    const ai = getAI();
    const prompt = `
      Look at this image of a person. They believe they are playing "Golf".
      You, the expert Oblivious Caddie, see something completely different.
      
      1. IGNORE all actual golf mechanics.
      2. Identify what they are ACTUALLY doing based on their pose, but make it ridiculous (e.g., "Attempting to swat a fly with a stick", "Practicing for a limbo contest", "Summoning the rain gods", "Fending off invisible badgers").
      3. Critique their form for THAT activity.
      4. Offer advice to improve that specific, incorrect activity.
      
      Example: "Excellent posture for swatting a piñata, but your blindfold is missing. You will never get the candy at this rate."
      
      Be harsh. Be funny. Be wrong.
    `;

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: base64Image
            }
          },
          { text: prompt }
        ]
      }
    });

    return response.text || "I cannot look at this disaster. Try a different angle.";
  } catch (error) {
    console.error("Vision Error:", error);
    return "I refused to process that image. It was too embarrassing.";
  }
};

export const generateScorecardSummary = async (entries: any[]): Promise<string> => {
  try {
    const ai = getAI();
    const prompt = `
      Here is a scorecard from a player's recent "Golf" round. 
      The metrics are absurd (e.g., ${JSON.stringify(entries)}).
      
      Write a prestigious, whispered-tone commentary summary (like a sports commentator at the Masters) analyzing these nonsensical stats.
      Treat things like "Squirrels Confused" or "Existential Crises" as serious, championship-defining statistics.
      
      Conclude with a verdict on whether they should be allowed back in the "Club" (Disco).
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt
    });

    return response.text || "Performance unanalyzable.";
  } catch (error) {
    return "The data was too complex for modern science.";
  }
};