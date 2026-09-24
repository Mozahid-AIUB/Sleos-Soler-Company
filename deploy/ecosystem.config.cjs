// PM2 process for the OSLEOS site. Runs from the `current` symlink so a
// reload always picks up the newest release. Listens on localhost only —
// Nginx is the public entry point.
const appDir = process.env.APP_DIR || "/var/www/osleos";

module.exports = {
  apps: [
    {
      name: "osleos",
      cwd: `${appDir}/current`,
      script: `${appDir}/current/server.js`,
      exec_mode: "fork",
      instances: 1,
      max_memory_restart: "400M",
      env: {
        NODE_ENV: "production",
        PORT: "3100",
        HOSTNAME: "127.0.0.1",
      },
    },
  ],
};
