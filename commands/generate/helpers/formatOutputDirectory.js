module.exports = input => {
  if (input) {
    if (!input.startsWith("/")) {
      input = "/" + input;
    }
    if (input.endsWith("/")) {
      input = input.substring(0, input.length - 1);
    }
  }

  return input;
};