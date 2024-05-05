let message = "\"Oh no! It seems like something went terribly wrong\", even our error\" message can't handle it! Let's just pretend nothing happened and go back to doing what we were doing, shall we?\""
console.log(message)

let trimmedMessage = message.replace(/^"(.*)"$/, '$1');
console.log(trimmedMessage)