require "arangocr"
require "kemal"

require "../auth";

include Tearbox::Types
include Tearbox::PatchTypes
include Tearbox::HTTPTypes
include Tearbox::ArangoTypes

include Tearbox::Auth

module Tearbox::Routes
  def init_boxes_routes(database : Arango::Database)
    boxes = database.collection("boxes")

    post "/boxes/auth" do |env|
      unless req_body = env.request.body
        raise "Invalid body"
      end

      auth_data = BoxAuth.from_json req_body  
      unless key = decode_id auth_data.id
        raise "ID not found"
      end

      db_resp = boxes.document.get key

      unless db_resp.success?
        raise "Temp"
      end

      data = BoxData.from_json db_resp.body
      unless validate_passhash(auth_data.passcode, data.passhash.not_nil!)
        raise "Passcode mismatch"
      end

      token = create_token(
        sub: "boxes",
        aud: data.id.not_nil!,
      )

      PostBoxAuthResponse.new(token).to_json
    end

    get "/boxes/:id" do |env|
      unless key = decode_id env.params.url["id"]
        raise "ID not found"
      end

      db_resp = boxes.document.get key

      unless db_resp.success?
        raise "Temp"
      end

      data = BoxDataPublic.from_json db_resp.body
      GetBoxResponse.new(data).to_json
    end

    options "/boxes" do |env|
    end

    post "/boxes" do |env|
      unless req_body = env.request.body
        raise "Invalid body"
      end
      
      data = BoxData.from_json req_body  
      data.passhash = create_passhash(data.passcode.not_nil!)

      db_resp = boxes.document.create data
      unless db_resp.success?
        raise "Temp"
      end

      key = (Success.from_json db_resp.body).key

      db_resp = boxes.document.get key
      unless db_resp.success?
        raise "Temp"
      end

      data = BoxDataPublic.from_json db_resp.body
      token = create_token(
        sub: "boxes",
        aud: data.id.not_nil!,
      )

      PostBoxResponse.new(data, token).to_json
    end

    options "/boxes/:id" do |env|
    end

    patch "/boxes/:id" do |env|
      id = env.params.url["id"]
      unless key = decode_id id
        raise "ID not found"
      end

      unless req_body = env.request.body
        raise "Invalid body"
      end

      unless token = env.request.headers["X-Token"]?
        raise "Auth failure"
      end

      validate_token(token, sub: "boxes", aud: id)

      patch_data = BoxDataPatch.from_json req_body

      db_resp = boxes.document.update(key, patch_data)
      unless db_resp.success?
        raise "Temp"
      end

      db_resp = boxes.document.get key
      unless db_resp.success?
        raise "Temp"
      end

      data = BoxDataPublic.from_json db_resp.body
      PatchBoxResponse.new(data).to_json
    end

    delete "/boxes/:id" do |env|
      id = env.params.url["id"]
      unless key = decode_id id
        raise "ID not found"
      end

      unless req_body = env.request.body
        raise "Invalid body"
      end

      unless token = env.request.headers["X-Token"]?
        raise "Auth failure"
      end

      validate_token(token, sub: "boxes", aud: id)

      db_resp = boxes.document.delete key
      unless db_resp.success?
        raise "Temp"
      end
      DeleteBoxResponse.new(true).to_json
    end
  end

end
