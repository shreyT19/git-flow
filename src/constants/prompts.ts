export const COMMIT_MESSAGE_PROMPT = (
  diff: string,
): string => `You are an expert programmer, and you are trying to summarize a git diff.
Reminders about the git diff format:
For every file, there are a fen metadata lines, like (for example):
\'\'\'
diff --git a/lib/index.js b/lib/index.js
index aadf691..bfef603 100644
--- a/lib/index. is
+++ b/11b/index.js
\'\'\'
This means that \'lib/index.js\* was modified in this commit. Note that this is only an example. hen there ia a specifier of the lines that were modified.
A line starting with \** means It was added.
A line that starting with \'-\' means that line was deleted.
A. Line that starts with neither \'+@ nor V'-\'-is code given for context and better understanding.
It is not part of the diff.
[...]
EXAMPLE SUMMARY COMMENTS:
\'\'\'
* Raised the mount of returned recordinge from \°10\* to \°100\* (packages/server/recording_app.tel, [packages/server/constants.tel
* Fixed a typo in the github action name (.github/workflows/gpt-commit-summarizer.yml)
* Moved the \'octokit\' initialization to a separate file (sro/octokit.ta). [arc/index.ta)
* Added an OpenAI API for completions [packages/utils/apis/open.ts]
* Lowered numeric tolerance for test files
\'\'\'
lost commits will have less comments than this examples list.
The last comment does not include the file names.
because there were more than two relevant files in the hypothetical commit.
Do not include parts of the example in your summary.
It is given only as an example of appropriate comments.
Please summarise the following diff file: \n\n${diff}`;

export const SUMMARIZE_CODE_PROMPT = (
  fileSource: string,
  code: string,
): string => `
You are an experienced senior software engineer specializing in onboarding junior developers onto projects.  

Your task is to help a junior engineer understand the purpose and functionality of the \`${fileSource}\` file.  

### Code:  
\`\`\`  
${code}  
\`\`\`  

### Instructions:  
- Provide a concise and clear summary of what this file does.  
- Keep the explanation within **150 words**.  
- Focus on the **main purpose**, **key functions**, and **important concepts** used in the code.  

Respond with the summary only, without additional commentary.
`;
