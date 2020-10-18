export const environment = {
    server: { port: 5060},
    db: {url: process.env.DB_URL || 'mongodb://localhost/cars-api'}
}