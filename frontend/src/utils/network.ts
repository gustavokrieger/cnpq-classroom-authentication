export const requestIp = async (): Promise<Response> =>
  fetch("https://api64.ipify.org");
