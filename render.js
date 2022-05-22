// Syntax constants
const FORMATTED_LINE = '%%';
const BLOCKQUOTE = '>';
const LIST_ITEM = '*';
const HEADING = '#';

// Parser constants
const CONSOLE_FORMAT = '%c';
const BASE_TEXT_SIZE = 12;
const MAX_LEVEL = 3;
const headingFontSizes = [0, 2.35 * BASE_TEXT_SIZE, 1.75 * BASE_TEXT_SIZE, 1.33 * BASE_TEXT_SIZE];
const H = headingFontSizes.map(fontSize => `font-size: ${fontSize}px; font-weight: bold;`);
const END_H = `font-size: ${BASE_TEXT_SIZE}px; font-weight: normal;`;
const BQ = 'font-style: italic; margin-left: 2rem';
const END_BQ = 'font-style: normal; margin-left: 0;';


const printFile = async (filepath) => {
  // Get text from local file and split them by newline
  const text = await fetch(filepath)
    .then(response => response.text());
  const lines = text.split('\n');

  // Set up output variables
  let formattedText = '';
  let formattedArgs = [];
  let title = filepath;

  // Set up state variables
  let prevType = '';
  let lineNumber = 0;
  let line = lines[lineNumber];

  // While there are still lines left to iterate through
  while (lineNumber < lines.length) {
    // If the line is empty or just a newline, skip it
    if (line.trim() === '') {
      lineNumber++;
      line = lines[lineNumber];
      continue;
    // If the line has special formatting
    } else if (line.slice(0, 2) === FORMATTED_LINE) {
      // Remove leading delimiter and split at the rest of the delimiters
      const chunks = line.slice(2,).trim().split(FORMATTED_LINE);
      const text = CONSOLE_FORMAT + chunks[0] + CONSOLE_FORMAT;
      const args = chunks.slice(1,);
      const numberOfFormatInstances = text.match(new RegExp(CONSOLE_FORMAT, 'g')).length;

      // If number of console format instances is not the numebr of args, throw
      if (numberOfFormatInstances !== args.length) {
        throw `Number of ${CONSOLE_FORMAT} don\'t match number of args:\n\n${line}`;
      }

      // Add text and formatting to output
      formattedText += text;
      formattedArgs.push(...args);

      // Increment to next line
      lineNumber++;
      line = lines[lineNumber];
      continue;
    }

    switch (line[0]) {
      case HEADING:
        prevType = line[0];

        // Get heading level and remove leading hashes
        let level = 0;
        while (line.startsWith(HEADING)) {
          level += 1;
          line = line.slice(1,);
        }
        level = Math.max(level, MAX_LEVEL);
        line = line.trim();

        // Set the title of the post if not yet set
        if (title === filepath) {
          title = line;
        }

        // Add new text and args
        formattedText += CONSOLE_FORMAT + line + CONSOLE_FORMAT;
        formattedArgs.push(H[level], END_H);

        // Increment line
        lineNumber++;
        line = lines[lineNumber];
        break;
      case LIST_ITEM:
        // If previous line's type wasn't a list, add a newline as buffer and
        // set the prevType
        if (prevType !== line[0]) {
          formattedText += '\n';
          prevType = line[0];
        }

        formattedText += '\n';

        // Add the rest of the list items to the text
        while (line && line.startsWith(LIST_ITEM)) {
          formattedText += line + '\n';
          lineNumber++;
          line = lines[lineNumber];
        }
        break;
      case BLOCKQUOTE:
        // If previous line's type wasn't a blockquote, add a newline as buffer
        // and set the prevType
        if (prevType !== line[0]) {
          formattedText += '\n';
          prevType = line[0];
        }

        // Add blockquote formatting
        formattedText += '\n' + CONSOLE_FORMAT;
        formattedArgs.push(BQ);

        // Add the rest of the blockquote lines to the text
        while (line && line.startsWith(BLOCKQUOTE)) {
          formattedText += line.slice(1,).trim();
          lineNumber++;
          line = lines[lineNumber];
        }

        // Add end blockquote formatting
        formattedText += CONSOLE_FORMAT;
        formattedArgs.push(END_BQ);
        break;
      default:
        prevType = '';

        // Always add a newline break between anything and a paragraph
        formattedText += '\n\n' + line;

        // Increment to next line
        lineNumber++;
        line = lines[lineNumber];
        break;
    }
  };

  // Return title, text, and args
  return {
    title,
    formattedText: formattedText.trim(),
    formattedArgs,
  };
};

const printFiles = (section) => {
  const pendingPosts = [];

  const { title, isGroup, files } = section;

  section.files.forEach(async (file) => {
    pendingPosts.push(printFile(file));
  });

  return Promise.all(pendingPosts)
    .then(posts => {
      const logSection = () => {
        if (isGroup) {
          console.groupCollapsed(CONSOLE_FORMAT + title + CONSOLE_FORMAT, H[2] + 'font-weight: bold;', END_H + 'font-weight: normal;');
        }

        posts.forEach(post => {
          const { title: postTitle, formattedText, formattedArgs } = post;

          if (isGroup) {
            console.groupCollapsed(postTitle);
          }
          console.log(formattedText, ...formattedArgs);
          if (isGroup) {
            console.groupEnd(postTitle);
          }
        });

        if (isGroup) {
          console.groupEnd();
        }
      };

      return logSection;
    });
};

const render = async (allFiles) => {
  const pendingSections = [];

  allFiles.forEach(section => {
    pendingSections.push(printFiles(section));
  });

  Promise.all(pendingSections)
    .then(sections => {
      sections.forEach(logSection => logSection());;
    });
}
