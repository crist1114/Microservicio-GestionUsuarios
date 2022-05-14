module.exports = {

    api: {
        port: process.env.API_PORT || 3000,
    },

    jwt: {
        secret: process.env.JWT_SECRET || 'notasecret!',
    },

    mysql: {
        host: process.env.MYSQL_HOST || 'remotemysql.com',
        user: process.env.MYSQL_USER || 'vAgjZl1EsB',
        password: process.env.MYSQL_PASS || 'mLm2Gy6P0X',
        database: process.env.MYSQL_DB || 'vAgjZl1EsB',
    }
}