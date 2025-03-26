// This code would be implemented on your server
// Example using Node.js with Express and the Anthropic SDK

const express = require('express');
const { Anthropic } = require('@anthropic-ai/sdk');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Initialize Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

app.post('/generate-biosketch', async (req, res) => {
  try {
    const { resume, personalStatement, scientificContributions } = req.body;
    
    if (!resume || !personalStatement || !scientificContributions) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const response = await anthropic.messages.create({
      model: "claude-3-7-sonnet-20250219",
      max_tokens: 20000,
      temperature: 1,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `You are an expert grant writer tasked with creating a professional biosketch for a team member. This biosketch will be used in grant applications, so it's crucial that it highlights the individual's expertise and relevance to the proposed project. Your task is to create a biosketch in the NIH format using the provided information.

I will provide you with three pieces of information:
1. A resume
2. A list of scientific contributions
3. A personal statement

Please analyze each piece of information carefully and use it to create a comprehensive yet concise biosketch. Follow these steps:

1. Analyze the resume:
   <document_analysis>
   - Extract key information about education and training
   - Identify relevant positions, scientific appointments, and honors
   - Note any other significant achievements or skills
   - Write down relevant quotes or information, numbered for easy reference
   </document_analysis>

2. Analyze the scientific contributions:
   <document_analysis>
   - Identify the most significant contributions, focusing on those most relevant to potential grant proposals
   - Note any patents, publications, or other notable achievements
   - Consider how these contributions demonstrate the individual's expertise and potential impact in the field
   - Write down relevant quotes or information, numbered for easy reference
   </document_analysis>

3. Analyze the personal statement:
   <document_analysis>
   - Identify key expertise and how it relates to potential grant proposals
   - Note any specific research interests or goals mentioned
   - Extract information about the individual's commitment to the field
   - Write down relevant quotes or information, numbered for easy reference
   </document_analysis>

4. Plan the biosketch:
   <biosketch_planning>
   - Outline how you will use the extracted information to create each section of the NIH biosketch:
     a. Name, eRA Commons Username, Position Title
     b. Education/Training (in reverse chronological order)
     c. Personal Statement (tailored to highlight relevance to potential grant proposals)
     d. Positions, Scientific Appointments, and Honors
     e. Contributions to Science (focus on the most significant and relevant contributions)
   - For each section, note which numbered items from the document analysis you will use
   </biosketch_planning>

5. Using the analyzed information and your plan, create a biosketch following the NIH format.

Remember to keep the biosketch concise yet comprehensive, highlighting the most relevant qualifications and achievements for potential grant proposals. The final biosketch should not exceed five pages.

Here is the resume:

<resume>
${resume}
</resume>

Here are the scientific contributions:

<scientific_contributions>
${scientificContributions}
</scientific_contributions>

Here is the personal statement:

<personal_statement>
${personalStatement}
</personal_statement>

Please provide the completed biosketch in the NIH format. Skip the document_analysis and biosketch_planning sections in your response - I only want the final NIH format biosketch.`
            }
          ]
        }
      ]
    });

    // Extract the biosketch content from the response
    const biosketchContent = response.content[0].text;
    
    // Return the biosketch
    res.json({ biosketch: biosketchContent });
  } catch (error) {
    console.error('Error generating biosketch:', error);
    res.status(500).json({ error: 'Failed to generate biosketch' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});