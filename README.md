# Website in the Console

This was an experiment to build a basic Web 1.0-style website within the console. So far, the most useful things I've used are the [`console.group`](https://developer.mozilla.org/en-US/docs/Web/API/console/group)/[`groupCollapsed`](https://developer.mozilla.org/en-US/docs/Web/API/console/groupCollapsed), the [string formatting using CSS](https://developer.mozilla.org/en-US/docs/Web/API/console#styling_console_output), and [`console.table`](https://developer.mozilla.org/en-US/docs/Web/API/console/table). I bet [`console.dir`](https://developer.mozilla.org/en-US/docs/Web/API/console/dir) and [`dirxml`](https://developer.mozilla.org/en-US/docs/Web/API/console/dirxml) could be used for something useful as well, but haven't found one yet.

Works in the big three browsers, but doesn't load `console.table` correctly the first time in anything but Firefox, for some reason.
