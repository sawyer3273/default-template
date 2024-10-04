module.exports = {
  apps : [
      {
        name: "moviequiz-app",
        script: './.output/server/index.mjs',
        node_args: ["--max_old_space_size=1500", "--max-http-header-size=200000"],
        instances: 0,
        instance_var: 'INSTANCE_ID',
        exec_mode: "cluster_mode",
        watch: false,
        time: true,
        log_date_format : "YYYY-MM-DD HH:mm Z",
        env_local : {
          "PORT": 8000,
          "NODE_ENV": "local"
        },
        env: {
          "PORT": 8000,
          "NODE_ENV": "production"
        }
      }
  ]
}
