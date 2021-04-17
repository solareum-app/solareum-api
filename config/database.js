module.exports = ({ env }) => ({
  defaultConnection: 'default',
  connections: {
    default: {
      connector: 'mongoose',
      settings: {
        client: 'mongo',
        uri: env('MONGO_URI')
      },
      options: {
        ssl: env('DATABASE_SSL'),
      },
    },
  },
});
