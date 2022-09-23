module.exports = ({ env }) => ({
  host: env("HOST", "0.0.0.0"),
  port: env.int("PORT", 1337),
  url: "http://47.74.46.194:1337",
  app: {
    keys: env.array("APP_KEYS"),
  },
});
