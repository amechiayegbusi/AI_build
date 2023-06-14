const URL_CLIENT = {
  development: 'http://localhost:3000',
  staging: 'https://mmnv3-lotteroo-back-backend-dev.azurewebsites.net/v1',
  production: 'https://mmnv3-lotteroo-back-backend-dev.azurewebsites.net/v1',
}

const URL_SERVER = {
  development: `http://localhost:${process.env.PORT || 8000}`,
  staging: 'https://mmnv3-lotteroo-back-backend-dev.azurewebsites.net/v1',
  production: 'https://mmnv3-lotteroo-back-backend-dev.azurewebsites.net/v1',
}

const ENV = process.env.NODE_ENV || 'development'

// @ts-ignore
const BASE_URL_CLIENT = URL_CLIENT[ENV]
// @ts-ignore
const BASE_URL_SERVER = URL_SERVER[ENV]

export { BASE_URL_CLIENT, BASE_URL_SERVER }
