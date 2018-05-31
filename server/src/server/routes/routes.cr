require "kemal"

module Tearbox::Routes
  before_all do |env|
    env.response.content_type = "application/json"
    env.response.headers["Access-Control-Allow-Origin"] = "*"
    env.response.headers["Access-Control-Allow-Methods"] = "GET, HEAD, POST, PATCH, DELETE"
    env.response.headers["Access-Control-Allow-Headers"] = "Content-Type, Accept, Origin, Authorization"
    env.response.headers["Access-Control-Max-Age"] = "86400"
  end
end
