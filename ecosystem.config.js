module.exports = {
  apps: [
    {
      name: 'pitagoricos-ai',
      script: './server.js',
      cwd: '/opt/chatita-aion/apps/pitagoricos-ai',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        PORT: 3200,
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3200,
      },
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      error_file: '/var/log/pitagoricos-ai/error.log',
      out_file: '/var/log/pitagoricos-ai/out.log',
      combine_logs: true,
      time: true,
    },
  ],
};
