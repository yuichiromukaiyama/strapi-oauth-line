module.exports = ({ env }) => ({
  host: env("HOST", "0.0.0.0"),
  port: env.int("PORT", 1337),
  url: "https://356a-121-109-138-66.jp.ngrok.io",
  app: {
    keys: env.array("APP_KEYS"),
  },
});
