const source = (publisher: string, title: string, url: string, citations: string[], date = '') => ({ publisher, title, url, citations, date });

export const serverSources = [
  source('IETF', 'RFC 9110 — HTTP Semantics', 'https://www.rfc-editor.org/rfc/rfc9110.html', ['server-role'], '2022-06'),
  source('MDN contributors', 'What is a web server?', 'https://developer.mozilla.org/en-US/docs/Learn_web_development/Howto/Web_mechanics/What_is_a_web_server', ['server-hardware', 'server-handler']),
  source('Node.js', 'HTTP', 'https://nodejs.org/api/http.html', ['server-listen']),
  source('Python Software Foundation', 'http.server — HTTP servers', 'https://docs.python.org/3/library/http.server.html', ['server-port', 'server-handler']),
];

export const gatewaySources = [
  source('Microsoft Azure Architecture Center', 'API gateways', 'https://learn.microsoft.com/en-us/azure/architecture/microservices/design/gateway', ['gateway-role', 'gateway-boundary']),
  source('Amazon Web Services', 'Create routes for HTTP APIs in API Gateway', 'https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-develop-routes.html', ['gateway-route']),
  source('Amazon Web Services', 'Control access to HTTP APIs with AWS Lambda authorizers', 'https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-lambda-authorizer.html', ['gateway-auth']),
  source('Amazon Web Services', 'Throttle requests to your HTTP APIs', 'https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-throttling.html', ['gateway-limit']),
];

export const proxySources = [
  source('IETF', 'RFC 9110 — HTTP Semantics', 'https://www.rfc-editor.org/rfc/rfc9110.html', ['proxy-role'], '2022-06'),
  source('NGINX', 'NGINX Reverse Proxy', 'https://docs.nginx.com/nginx/admin-guide/web-server/reverse-proxy', ['proxy-forward', 'proxy-headers']),
  source('Apache Software Foundation', 'Reverse Proxy Guide', 'https://httpd.apache.org/docs/2.4/howto/reverse_proxy.html', ['proxy-path', 'proxy-redirect']),
  source('Cloudflare', 'How Cloudflare DNS works', 'https://developers.cloudflare.com/fundamentals/concepts/how-cloudflare-works/', ['proxy-public']),
  source('Envoy', 'HTTP header manipulation', 'https://www.envoyproxy.io/docs/envoy/latest/configuration/http/http_conn_man/headers', ['proxy-trust']),
];
