const { getDataConnect, validateArgs } = require('firebase/data-connect');

const connectorConfig = {
  connector: 'default',
  service: 'blacwom-website',
  location: 'asia-south1'
};
exports.connectorConfig = connectorConfig;

