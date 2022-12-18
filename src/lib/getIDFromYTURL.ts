export const getIDFromYTURL = (url: string): string => {
  const regExp =
    /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  if (match && match[2] && match[2].length == 11) {
    return match[2];
  } else {
    //error
    console.log("url inválida");
    return "";
  }
};