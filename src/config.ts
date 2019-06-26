export const config = {
  PREFIX: "?",
  SERVERPREFIXES: {} as GuildPrefixMap,
  TOKEN: "NTg5NTk1MTg5NjMxMzg1NjAy.XQWd1w.5yZcJNlE3Hs5sRqePdXX0sBvH6Y",
  SHARDS: 1,
  GENIUS_API_TOKEN:
    "yVke9GpZpG1prMfz1g3TbFYeXZOmMRNRneGECQXmt5EWMD8cCo_o67577jkeVwUn",
  GENIUS_API_URI: "https://api.genius.com"
};

interface GuildPrefixMap {
  [key: string]: string;
}
