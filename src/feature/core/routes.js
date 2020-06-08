const getEndpointUrl = (baseUrl, endpoint) => `${baseUrl}/${endpoint}`;
const getEndpointByIdUrl = (baseUrl, endpoint) => `${getEndpointUrl(baseUrl, endpoint)}/:id`;

const getRouteUrls = ({ baseUrl }, endpoint) => ({
  url: getEndpointUrl(baseUrl, endpoint),
  urlById: getEndpointByIdUrl(baseUrl, endpoint),
});

export default {
  getRouteUrls,
};
