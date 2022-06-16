export function randomHash(len: number, charSetInput: String) {
  const charSet = charSetInput || 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let randomString = '';
  for (let i = 0; i < len; i++) {
    const randomPoz = Math.floor(Math.random() * charSet.length);
    randomString += charSet.substring(randomPoz, randomPoz + 1);
  }
  return randomString;
}

export function responseError(err: any) {
  const errorMessage =
    err.data.data && err.data.data.message
      ? err.data.data.message
      : err.data && err.data.message
      ? err.data.message
      : 'Something went wrong, please try again!';
  return errorMessage;
}
