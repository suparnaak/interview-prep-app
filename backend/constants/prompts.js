// constants/prompts.js
/**
 * Reusable prompt templates for:
 *  - generating exactly 3 initial interview questions from a JD
 *  - evaluating a user's answer against a question and resume chunks
 *  - producing a single follow-up question that probes weaknesses
 *
 * Each template returns JSON-only responses (so parsing is deterministic).
 * The resumeChunks parameter is expected to be an array of objects:
 *   [{ chunkId: 1, text: "..." }, { chunkId: 2, text: "..." }, ...]
 *
 * KEEP PROMPTS CONCISE to avoid token blowup. Trim resume/JD to most-relevant text before calling.
 */

const PROMPTS = {
  /**
   * Generate exactly 3 interview questions from a Job Description (JD).
   * Returns JSON: { "questions": ["q1","q2","q3"] }
   *
   * @param {string} jdText - plain text of the job description (trim to relevant part)
   */
  initialQuestionsFromJD: (jdText) => {
    return `You are an expert technical interviewer crafting role-specific interview questions.
Read the Job Description below and produce EXACTLY 3 distinct interview questions tailored to this role.
Keep each question concise (1 sentence) and focused on assessing ability relevant to the JD.

Job Description:
"""${jdText}"""

OUTPUT ONLY valid JSON with this shape:
{"questions":[ "question 1", "question 2", "question 3" ]}

Do not include any explanation, commentary, or extra fields.`;
  },

  /**
   * Evaluate a user's answer to a specific question using resume chunks.
   * Returns JSON:
   * {
   *   "score": 1-10,
   *   "feedback": "short feedback (max 100 words)",
   *   "strengths": ["..."],
   *   "improvements": ["..."],
   *   "citations": [{ "chunkId": 1, "text": "..." }, ... up to 3]
   * }
   *
   * @param {string} question - the interview question asked
   * @param {string} userAnswer - user's answer to evaluate
   * @param {Array<{chunkId:number,text:string}>} resumeChunks - top-N resume chunks (pass top 2-5)
   */
  evaluateAnswerWithResume: (question, userAnswer, resumeChunks = []) => {
    // join chunks in a safe, trimmed way
    const chunkText = (resumeChunks || [])
      .slice(0, 6)
      .map(c => `[#${c.chunkId}] ${c.text}`)
      .join("\n\n");

    return `You are an expert interviewer and evaluator. Evaluate the USER ANSWER below for the QUESTION using ONLY the information in the RESUME CHUNKS provided. Be objective and concise.

QUESTION:
"""${question}"""

USER ANSWER:
"""${userAnswer}"""

RESUME CHUNKS (use these to check claims; do NOT hallucinate beyond these):
${chunkText || 'No resume chunks provided.'}

INSTRUCTIONS (strict):
1) Provide a numeric score from 1 to 10 where 10 = excellent. Put this value in the "score" field.
2) Provide a feedback paragraph of at most 100 words in "feedback".
3) List up to 3 short "strengths" (1-7 words each).
4) List up to 3 short "improvements" (actionable suggestions, 1-12 words each).
5) Include up to 3 "citations" referencing resume chunk ids that support your evaluation. Each citation must include chunkId and a 1-2 sentence snippet taken verbatim from that chunk. Do NOT invent chunk ids.
6) RETURN JSON ONLY, with EXACT keys: score, feedback, strengths, improvements, citations.

Example output shape:
{
  "score": 7,
  "feedback": "Short feedback here, max 100 words.",
  "strengths": ["Relevant tooling experience", "Clear structure"],
  "improvements": ["Provide metrics", "Give a concrete example"],
  "citations": [{ "chunkId": 2, "text": "Worked on X for 3 years." }]
}

Do NOT include any additional commentary or explanation outside the JSON.`;
  },

  /**
   * Produce a single follow-up question that probes deeper on weaknesses revealed by the user's answer.
   * Returns JSON: { "followUp": "..." }
   *
   * @param {string} question - original question
   * @param {string} userAnswer - user's previous answer
   * @param {Array<{chunkId:number,text:string}>} resumeChunks - optional resume context
   */
  followUpQuestion: (question, userAnswer, resumeChunks = []) => {
    const chunkSummary = (resumeChunks || [])
      .slice(0, 4)
      .map(c => `[#${c.chunkId}] ${c.text}`)
      .join("\n\n");

    return `You are an interviewer preparing a single follow-up question to probe a candidate's weaknesses.
Use the original QUESTION and USER ANSWER below. Optionally consult RESUME CHUNKS.

QUESTION:
"""${question}"""

USER ANSWER:
"""${userAnswer}"""

RESUME CHUNKS (optional):
${chunkSummary || 'None'}

INSTRUCTIONS:
1) Produce EXACTLY ONE concise follow-up question (one sentence).
2) The follow-up should target a gap, ambiguity, or weakness in the user's answer.
3) Prefer questions that ask for a concrete example, metric, or clarification.
4) RETURN JSON ONLY: { "followUp": "your question" } and nothing else.`;
  }
};

module.exports = PROMPTS;
