require "arangocr"
require "kemal"

require "./server/types"

include Tearbox::Types

DB_HOST = "http://127.0.0.1:8529"
DB_USER = "root"
DB_PASS = ""

client = Arango::Client.new(DB_HOST, DB_USER, DB_PASS)
database = client.database("tearbox")

boxes = database.collection("boxes")

box = BoxData.new(name: "Potato", passcode: "abc")
puts box.to_json_public

def render_500(context, backtrace, verbosity)
end

get "/boxes/:id" do |env|
  env.response.content_type = "application/json"
  {id: "abc", items: [] of String}.to_json
end

post "/boxes" do |env|
  data = BoxData.from_json env.request.body.not_nil!
  puts data.to_json
  puts data.to_json_public
end

put "/boxes/:id" do |env|
end

delete "/boxes/:id" do |env|
end


serve_static false
Kemal.run
