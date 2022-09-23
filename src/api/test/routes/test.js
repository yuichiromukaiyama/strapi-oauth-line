module.exports = {
  routes: [
    {
      method: "POST",
      path: "/test",
      handler: "test.addUser",
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
