// // Example of calling the function
// browser.runtime.onStartup.addListener(async () => {
//   const WindowPageInfo = await getWindowPageInfo();
//   if (WindowPageInfo) {
//     // Do something with the screen information
//   }
// });

export function formatString(template: string, ...args: any[]) {
  return template.replace(/{(\d+)}/g, (match, index) => args[index])
}

// const name = 'John';
// const age = 30;

// const formattedString = formatString('My name is {0} and I am {1} years old.', name, age);
// console.log(formattedString); // Output: 'My name is John and I am 30 years old.'
