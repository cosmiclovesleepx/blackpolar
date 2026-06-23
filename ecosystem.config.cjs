module.exports = {
  apps: [
    {
      name: "blackpolar-web",
      cwd: "./apps/web",
      script: "node_modules/.bin/next",
      args: "start -p 3000",
      env: { NODE_ENV: "production" },
    },
    {
      name: "blackpolar-dashboard",
      cwd: "./apps/dashboard",
      script: "node_modules/.bin/next",
      args: "start -p 3001",
      env: { NODE_ENV: "production" },
    },
    {
      name: "blackpolar-api",
      cwd: "./apps/api",
      script: "dist/server.js",
      env: { NODE_ENV: "production" },
    },
  ],
};
