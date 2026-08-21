const { Sequelize } = require('sequelize');

const isProduction = process.env.NODE_ENV === 'production';
const useSsl = String(process.env.DB_SSL || (isProduction ? 'true' : 'false')).toLowerCase() === 'true';

const commonOptions = {
  dialect: 'mysql',
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  define: {
    underscored: true,
    timestamps: true,
  },
  pool: {
    max: Number(process.env.DB_POOL_MAX || 10),
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  dialectOptions: useSsl
    ? {
        ssl: {
          minVersion: 'TLSv1.2',
          rejectUnauthorized: String(process.env.DB_SSL_REJECT_UNAUTHORIZED || 'true').toLowerCase() !== 'false',
        },
      }
    : {},
};

// DATABASE_URL is convenient on cloud providers. Individual DB_* variables remain
// supported for local MySQL and for TiDB Cloud connection parameters.
const sequelize = process.env.DATABASE_URL
  ? new Sequelize(process.env.DATABASE_URL, commonOptions)
  : new Sequelize(
      process.env.DB_NAME || 'social_awareness_db',
      process.env.DB_USER || 'root',
      process.env.DB_PASSWORD || '',
      {
        ...commonOptions,
        host: process.env.DB_HOST || '127.0.0.1',
        port: Number(process.env.DB_PORT || 3306),
      }
    );

module.exports = sequelize;
