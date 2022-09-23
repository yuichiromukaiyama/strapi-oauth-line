module.exports = [
  "strapi::errors",
  "strapi::security",
  "strapi::cors",
  "strapi::poweredBy",
  "strapi::logger",
  "strapi::query",
  {
    name: "strapi::body",
    config: {
      multipart: true,
      patchKoa: true,
      jsonLimit: "5mb",
      formLimit: "5mb",
      textLimit: "5mb",
      encoding: "utf-8",
      formidable: {
        maxFileSize: 200 * 1024 * 1024,
      },
    },
  },
  "strapi::session",
  "strapi::favicon",
  "strapi::public",
];
