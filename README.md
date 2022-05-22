# Website in the Console

This was an experiment to build a basic Web 1.0-style website within the console. So far, the most useful things I've used are the [`console.group`](https://developer.mozilla.org/en-US/docs/Web/API/console/group)/[`groupCollapsed`](https://developer.mozilla.org/en-US/docs/Web/API/console/groupCollapsed), the [string formatting using CSS](https://developer.mozilla.org/en-US/docs/Web/API/console#styling_console_output), and [`console.table`](https://developer.mozilla.org/en-US/docs/Web/API/console/table). I bet [`console.dir`](https://developer.mozilla.org/en-US/docs/Web/API/console/dir) and [`dirxml`](https://developer.mozilla.org/en-US/docs/Web/API/console/dirxml) could be used for something useful as well, but haven't found one yet.

Works in the big three browsers, but doesn't load `console.table` correctly the first time in anything but Firefox, for some reason.

NOTE: This won't work locally unless you are using a server, since it reads local files. Use something like [serve](https://www.npmjs.com/package/serve) to load the page locally if you want.

## How To

1. Create and save a new post or posts using the syntax below.
1. Add your file to an existing `files` property array.
1. Reload the index.html and open the console.

The object has three properties:

* `files`: The list of filepaths where posts will be found.
* `isGroup`: Boolean to signify whether the `files` should be enclosed in a `console.group` with the `title` text.
* `title`: Used if `isGroup` is true. If not `isGroup`, useful for organization.

## Syntax

Posts use a modified Gemini syntax.

### Whitespace

Blank lines are skipped. Leading and trailing whitespace is trimmed on everything except paragraphs.

### Paragraphs

Paragraphs exist on their own line. Newlines separate each paragraph.

### Headers

Headers use up to three leading hashes for different sizes of headings.

### Lists

Lists are just like Gemini:

* Each item
* Gets its own line
* Like this

### Blockquotes

> Blockquotes are prefaced with the `>` like usual.

### Formatted Lines

This is formatting as in console-style formatting using `%c`. A line prefaced with `%%` will signify that console-style CSS formatting will be expected, separated by more instances of `%%`. A formatted line implies a `%c` at the beginning and end of the string.

An example line is like this:

```
%% Hello World! %% font-weight: bold; %% font-weight: normal;
```

This will render to the following when logged:

```javascript
console.log('%cHello World!%c', 'font-weight: bold;', 'font-weight: normal;');
```

You can look in `posts/index.gmi` for a long-winded example.

