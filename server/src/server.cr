require "arangocr"
require "kemal"

require "./server/types"

include Tearbox::Types
include Tearbox::ArangoTypes

APPLICATION_JSON = "application/json"

DB_HOST = "http://127.0.0.1:8529"
DB_USER = "root"
DB_PASS = ""

client = Arango::Client.new(DB_HOST, DB_USER, DB_PASS)
database = client.database("tearbox")

boxes = database.collection("boxes")

def render_404
end

def render_500(context, backtrace, verbosity)
end

get "/boxes/:id" do |env|
  env.response.content_type = APPLICATION_JSON
  begin
    unless key = decode_id env.params.url["id"]
      raise "ID not found"
    end

    data = BoxData.from_json(boxes.document.get(key).to_json)
    data.to_json_public
  rescue ex
    puts ex.message
  end
end

post "/boxes" do |env|
  env.response.content_type = APPLICATION_JSON
  begin
    unless body = env.request.body
      raise "Invalid body"
    end

    data = BoxData.from_json(body)
    result = CreateSuccess.from_json(boxes.document.create(data).to_json)
    data.key = result.key
    data.to_json_public
  rescue ex
    puts ex.message
  end
end

patch "/boxes/:id" do |env|
  env.response.content_type = APPLICATION_JSON
  begin
    unless key = decode_id env.params.url["id"]
      raise "ID not found"
    end

    unless body = env.request.body
      raise "Invalid body"
    end

    patch_data = BoxData.from_json(body)
    result = UpdateSuccess.from_json(boxes.document.update(key, patch_data).to_json)

    data = BoxData.from_json(boxes.document.get(key).to_json)
    data.to_json_public
  rescue ex
    puts ex.message
  end
end

delete "/boxes/:id" do |env|
end


serve_static false
Kemal.run
