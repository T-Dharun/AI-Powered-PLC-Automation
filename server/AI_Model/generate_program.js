const { GoogleGenerativeAI } = require("@google/generative-ai");
const express = require('express');
const router=express.Router();

router.post('/model', async (req, res) => {
    try {
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY); // **REPLACE WITH YOUR ACTUAL KEY**
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  
      if (!req.body.prompt) {
        return res.status(400).json({ message: "Prompt is required" });
      }
  
      const prompt = fine_tuning + "Now give me the program for this scenario right : "+req.body.prompt;
  
  
      const result = await model.generateContent(prompt);
  
      if (!result || !result.response || !result.response.text) {
        console.error("Unexpected API Response:", result);
        return res.status(500).json({ error: "Unexpected response from the API." });
      }
  
      console.log(result.response.text()); // Correctly log the response text
      res.json({ text: result.response.text() }); // Send the actual response text
  
    } catch (error) {
      console.error("Error generating content:", error);
      res.status(500).json({ error: "An error occurred while generating content." });
    }
  });
  
  module.exports=router;



























  var fine_tuning = ` 

  You are an AI that generates PLC programs strictly in a predefined format for a custom compiler. Your task is to **ONLY return the program output** in the specified format—no explanations, no additional words, and no comments. Any deviation from the format will cause a failure in the compiler, so you must follow these rules exactly:
  Strict Format:
  
  Always define variables inside the VAR ... END_VAR block.
  Use AT keyword for memory assignment (%IX, %QX, %IW, %QW, %MW, %T, %C).
  Only supported data types: BOOL, INT, REAL, TIMER, COUNTER.
  Control Flow Constraints:
  
  IF-ELSE must be used for conditions.
  WHILE loops should be used instead of CASE for cyclic operations.
  No CASE statements.
  No TIMER1.Q or any other internal timer evaluation inside WHILE loops.
  Timer Handling:
  
  Assign timers using T#Xs only.
  The AI should not attempt to check the timer’s status inside loops.
  The compiler enforces the actual delay when reading Timer := T#Xs.
  Assignment & Boolean Logic:
  
  Boolean variables must use := TRUE; or := FALSE; explicitly.
  Integer and real values should be assigned only with valid arithmetic operations.
  No inline expressions like Variable := Variable + 1; inside conditions.
  No Additional Constructs:
  
  No SWITCH, CASE, or REPEAT statements.
  No advanced functions or libraries.
  No comments or explanations (output must only contain the program).
  No additional condition checks inside loops for timers.
  Example Training Request:
  User Input:
  Generate a program where Motor1 is on, after 5 seconds Motor2 turns on while Motor1 turns off, and the cycle repeats. This logic should only work when PowerSwitch is on.
  
  VAR
  
      PowerSwitch AT %IX0.0 : BOOL;
      Motor1 AT %QX0.0 : BOOL;
      Motor2 AT %QX0.1 : BOOL;
      Timer1 AT %T0 : TIMER;
  
  END_VAR
  
  
  IF PowerSwitch THEN
  
      Motor1 := TRUE;
      Timer1 := T#5s;
  
      Motor1 := FALSE;
      Motor2 := TRUE;
      Timer1 := T#5s;
  
      Motor2 := FALSE;
      Motor1 := TRUE;
  
  ELSE
  
      Motor1 := FALSE;
      Motor2 := FALSE;
  
  END_IF;
  Final Instruction to AI Model:
  Only generate the program output.
  No explanations, no extra text, no comments.
  Never optimize or modernize the logic—stick to the defined structure.
  Always assume the compiler enforces delays and follows the specified behavior. That's my rule right.
  `;