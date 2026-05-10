import Zavu from "@zavudev/sdk";

export const zavu = new Zavu({
  apiKey: process.env.ZAVU_API_KEY!,
});