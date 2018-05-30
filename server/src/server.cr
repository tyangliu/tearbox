require "arangocr"
require "kemal"

require "./server/types"

include Tearbox::Types
include Tearbox::PatchTypes
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

  unless key = decode_id env.params.url["id"]
    raise "ID not found"
  end

  db_resp = boxes.document.get key

  unless db_resp.success?
    raise "Temp"
  end

  data = BoxData.from_json db_resp.body
  data.to_json_public
end

post "/boxes" do |env|
  env.response.content_type = APPLICATION_JSON

  unless req_body = env.request.body
    raise "Invalid body"
  end
  
  data = BoxData.from_json req_body  

  db_resp = boxes.document.create data
  unless db_resp.success?
    raise "Temp"
  end

  key = (Success.from_json db_resp.body).key

  db_resp = boxes.document.get key
  unless db_resp.success?
    raise "Temp"
  end

  data = BoxData.from_json db_resp.body
  data.to_json_public 
end

patch "/boxes/:id" do |env|
  env.response.content_type = APPLICATION_JSON

  unless key = decode_id env.params.url["id"]
    raise "ID not found"
  end

  unless req_body = env.request.body
    raise "Invalid body"
  end

  patch_data = BoxDataPatch.from_json req_body

  db_resp = boxes.document.update(key, patch_data)
  unless db_resp.success?
    raise "Temp"
  end

  db_resp = boxes.document.get key
  unless db_resp.success?
    raise "Temp"
  end

  data = BoxData.from_json db_resp.body
  data.to_json_public 
end

delete "/boxes/:id" do |env|
  env.response.content_type = APPLICATION_JSON

  unless key = decode_id env.params.url["id"]
    raise "ID not found"
  end

  db_resp = boxes.document.delete key
  unless db_resp.success?
    raise "Temp"
  end
end


serve_static false
Kemal.run
